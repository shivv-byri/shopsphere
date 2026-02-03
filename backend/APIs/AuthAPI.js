const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const router = express.Router();

// STEP 1: Redirect user to Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// STEP 2: Google calls this back
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    // req.user comes from passport
    const token = jwt.sign(
      { userId: req.user._id, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Send token to frontend
    res.redirect(
      `http://localhost:3000/login-success?token=${token}`
    );
  }
);

module.exports = router;
