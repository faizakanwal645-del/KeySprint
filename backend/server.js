const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const session = require("express-session");
const SQLiteStore = require("connect-sqlite3")(session);
const bcrypt = require("bcryptjs");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
require("dotenv").config();

const app = express();
// Serve KeySprint frontend files
app.use("/backend", (req, res) => res.sendStatus(404));

const PORT = process.env.PORT || 3000;

// Read JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic security headers
app.use(helmet({
    contentSecurityPolicy: false
}));

// Login attempt protection
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    message: "Too many attempts. Please try again later."
});

// Database connection
const db = new sqlite3.Database(
    path.join(__dirname, "keysprint.db"),
    (error) => {
        if (error) {
            console.error("Database connection failed:", error.message);
        } else {
            console.log("KeySprint database connected!");
        }
    }
);

// Create users table
db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

// Session configuration
app.use(session({
    store: new SQLiteStore({
        db: "sessions.sqlite",
        dir: __dirname
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24
    }
}));

app.get("/api/health", (req, res) => {
    res.json({ message: "KeySprint backend is running!" });
});
// User Signup API
app.post("/api/signup", loginLimiter, (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            message: "All fields are required."
        });
    }

    if (password.length < 8) {
        return res.status(400).json({
            message: "Password must be at least 8 characters."
        });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    bcrypt.hash(password, 12, (hashError, hashedPassword) => {
        if (hashError) {
            return res.status(500).json({
                message: "Could not create account."
            });
        }

        db.run(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            [cleanName, cleanEmail, hashedPassword],
            function (dbError) {
                if (dbError) {
                    if (dbError.code === "SQLITE_CONSTRAINT") {
                        return res.status(409).json({
                            message: "This email is already registered."
                        });
                    }

                    return res.status(500).json({
                        message: "Database error."
                    });
                }

                req.session.userId = this.lastID;

                res.status(201).json({
                    message: "Account created successfully!"
                });
            }
        );
    });
});
// User Login API
app.post("/api/login", loginLimiter, (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required."
        });
    }

    const cleanEmail = email.trim().toLowerCase();

    db.get(
        "SELECT * FROM users WHERE email = ?",
        [cleanEmail],
        (error, user) => {
            if (error) {
                return res.status(500).json({
                    message: "Database error."
                });
            }

            if (!user) {
                return res.status(401).json({
                    message: "Invalid email or password."
                });
            }

            bcrypt.compare(password, user.password, (compareError, isMatch) => {
                if (compareError || !isMatch) {
                    return res.status(401).json({
                        message: "Invalid email or password."
                    });
                }

                req.session.regenerate((sessionError) => {
                    if (sessionError) {
                        return res.status(500).json({
                            message: "Could not start session."
                        });
                    }

                    req.session.userId = user.id;

                    res.json({
                        message: "Login successful!",
                        user: {
                            id: user.id,
                            name: user.name,
                            email: user.email
                        }
                    });
                });
            });
        }
    );
});
// Check Current User API
app.get("/api/me", (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({
            message: "You are not logged in."
        });
    }

    db.get(
        "SELECT id, name, email FROM users WHERE id = ?",
        [req.session.userId],
        (error, user) => {
            if (error) {
                return res.status(500).json({
                    message: "Database error."
                });
            }

            if (!user) {
                return res.status(401).json({
                    message: "User not found."
                });
            }

            res.json({ user });
        }
    );
});
// User Logout API
app.post("/api/logout", (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            return res.status(500).json({
                message: "Could not logout."
            });
        }

        res.clearCookie("connect.sid");

        res.json({
            message: "Logged out successfully!"
        });
    });
});
// Protect KeySprint Website Pages

app.use((req, res, next) => {

    const publicPages = [
        "/signup.html",
        "/login.html",
        "/signup.js",
        "/login.js",
        "/style.css",
        "/api/health",
        "/api/signup",
        "/api/login"
    ];

    if (
        req.path.startsWith("/api/") &&
        !publicPages.includes(req.path)
    ) {
        if (!req.session.userId) {
            return res.status(401).json({
                message: "Please login first."
            });
        }
        return next();
    }

    if (publicPages.includes(req.path)) {
    return next();
}
    if (!req.session.userId) {
        return res.redirect("/login.html");
    }

    next();
});
app.use(express.static(path.join(__dirname, ".."), {
    dotfiles: "deny"
}));
// Open KeySprint Home Page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "index.html"));
});
// Start server
const server = app.listen(PORT, () => {
    console.log(`KeySprint server running at http://localhost:${PORT}`);
});

server.on("close", () => {
    console.log("Server has closed!");
});

server.on("error", (error) => {
    console.error("Server error:", error);
});