// backend/routes/auth.js

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Post = require('../models/Post');

const multer = require('multer');
const path = require('path');




const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const router = express.Router();

// Registration Endpoint
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
});



// Login Endpoint
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }
    
    const token = jwt.sign({ id: user._id }, 'secretkey', { expiresIn: '1h' });
        // Set the token in an HTTP-only cookie
        res.cookie('token', token, {
          httpOnly: true, // Not accessible via JavaScript
          secure: process.env.NODE_ENV === 'production', // Set to true in production
          maxAge: 3600000, // 1 hour
        });
    
        res.json({ message: 'Logged in successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});

//logout
router.post('/logout', (req, res) => {
  res.clearCookie('token'); // Clear the token cookie
  res.json({ message: 'Logged out successfully' });
});


// Middleware to protect routes
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token, 'secretkey', (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user; // Attach user to request
    next();
  });
};

// Protected Route
router.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is protected data', user: req.user });
});









///////////////////////////////////////////////
/////////////////////////

const transporter = nodemailer.createTransport({
  service: 'gmail', // Replace with your email service
  auth: {
    user: '2020an0120743@gmail.com', // Your email
    pass: 'hbuu kkxo ruph czbn', // Your email password
  },
});



const sendOtpEmail = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: '2020an0120743@gmail.com', // Sender address
      to: email, // Recipient email
      subject: 'Your OTP for Verification',
      text: `Your OTP is ${otp}. Please use this to verify your email.`,
    });
    return true; // Return true if the email is sent successfully
  } catch (error) {
    console.error('Error sending OTP:', error);
    return false; // Return false if there was an error
  }
};





const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
};

router.post('/email-otp', async (req, res) => {
  const { email} = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    const otp = generateOTP();
    const emailSent = await sendOtpEmail(email, otp);
    if (emailSent) {
      res.status(200).json(otp);
    } else {
      res.status(500).json({ message: 'Error sending OTP.' });
    }



  } catch (error) {
    res.status(500).json({ message: 'Email Not found', error });
  }
});







// Endpoint to reset the password

router.post('/set-new-password', async (req, res) => {
  const { email, newpassword } = req.body;

  try {
    // Find the user in the database
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newpassword, 10);

    // Update the user's password and save
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: 'Password reset successfully!' });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Error resetting password', error });
  }
});



/////

const uploadmiddelware= multer({dest:'uploads/' });
// app.use('../uploads', express.static('../uploads'))


// POST route to handle form submission
router.post('/upload',authenticateToken, uploadmiddelware.single('image'), async(req, res) => {
  const { title, summary } = req.body;
 
  const author = req.user.id;
  res.json({files:req.file})
  const postdoc= await Post.create({
    title,
    summary,
    image:req.file.path,
    author,
  })

});

router.get('/getpost', async (req, res) => {
  try {
    const posts = await Post.find().populate('author','name'); // Fetch all posts from the database
    res.status(200).json(posts); // Send the posts as a JSON response
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.get('/post/:id', authenticateToken,async (req, res) => {
  const {id}=req.params
  try {
    const post = await Post.findById(id).populate('author','name')
    res.status(200).json({post,user:req.user}); // Send the posts as a JSON response
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


//edit
router.put('/post/:id', authenticateToken, uploadmiddelware.single('image'), async (req, res) => {
  const { title, summary } = req.body;
  const postId = req.params.id; // Get the post ID from the request parameters
  const author = req.user.id;
  console.log("ggg")

  try {
      // Find the post and update it
      const post = await Post.findByIdAndUpdate(
          postId,
          {
              title,
              summary,
              image: req.file ? req.file.path : undefined, // Use new image if provided
              author,
          },
          { new: true } // Return the updated document
      );

      if (!post) {
          return res.status(404).json({ message: 'Post not found' });
      }

      res.json({ message: 'Post updated successfully', post });
  } catch (error) {
      console.error('Error updating post:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});



module.exports = router;
