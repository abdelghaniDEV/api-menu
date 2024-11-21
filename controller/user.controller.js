const User = require('../module/user-module')
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');


// register user
const registerUser = async (req, res) => {
  
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) return res.status(400).json({ message: 'User already exists' });
      
      // Hash the password
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      
      // Create a new user
      const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      });
      
      await user.save();
      
      res.json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
      res.status(500).json({ message: error.message });
    }
}
// login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: 'User not found' });

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

    // Create and send JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// get all users 
const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = {
    registerUser,
    loginUser,
    getUsers,
}