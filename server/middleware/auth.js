const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    let token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    // ✅ Remove Bearer prefix if present
    if (token.startsWith("Bearer ")) {
        token = token.slice(7, token.length).trim();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // attach decoded user to request
        next();
    } catch (err) {
        console.error("JWT Error:", err); // 👈 log the error
        res.status(401).json({ message: "Invalid token" });
    }
};
