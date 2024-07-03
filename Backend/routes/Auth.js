const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchUser = require("../middleware/fetchUser");
const JWT_sign = "IhavesignedyourEntryy";

// Route1 : create a user using : POST "/api/auth/createUser" . Doesn't require auth
router.post(
  "/createUser",
  [
    // body("name").isLength({ min: 3 }).withMessage("Enter a valid name"),
    body("email").isEmail().withMessage("Enter a valid Email"),
    // body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry, a user with this email already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });

      const data = {
        user: {
          id: user.id,
        },
      };

      const authtoken = jwt.sign(data, JWT_sign);
      res.json({ authtoken });
    } catch (error) {
      console.error("Error in /createUser:", error.message);
      res.status(500).send("Some error Occurred");
    }
  }
);

// Route2 : Authenticate a User : POST "/api/auth/login" . Doesn't require auth
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Enter a valid Email"),
    body("password").exists().withMessage("Password Cannot be blank"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "Please enter correct credentials" });
      }
      const passComp = await bcrypt.compare(password, user.password);
      if (!passComp) {
        return res
          .status(400)
          .json({ error: "Please enter correct credentials" });
      }

      const data = {
        user: {
          id: user.id,
        },
      };

      const jwt_data = jwt.sign(data, JWT_sign);

      res.json({ authtoken: jwt_data });
    } catch (error) {
      console.error("Error in /login:", error.message);
      res.status(500).send("Some error Occurred");
    }
  }
);

// Route3 : Get user details : POST "/api/auth/userDetails" . Requires login
router.post("/userDetails", fetchUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error("Error in /userDetails:", error.message);
    res.status(500).send("Some error Occurred");
  }
});

module.exports = router;
