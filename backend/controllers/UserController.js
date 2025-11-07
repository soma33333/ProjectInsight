const User=require("../models/User")
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: `${__dirname}/../.env` });



const Register= async (req, res) => {
    const { name, email, password } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ name, email, password: hashedPassword });
  
      await newUser.save();
      res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
      res.status(500).json({ message: "Error registering user", error });
    }
}



const Login= async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid password" });
      }
  
      const token = jwt.sign({ id: user._id,name:user.name,email:user.email }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // true on Vercel
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 3600000,
      });

  
      res.json({ message: "Logged in successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error logging in", error });
    }
  };

  
  const Logout = (req, res) => {
  console.log("log-out");
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/", // always specify path
  });
  res.json({ message: "Logged out successfully" });
};

  




  
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "2020an0120743@gmail.com",
      pass: "hbuu kkxo ruph czbn",
    },
  });
  
  const sendOtpEmail = async (email, otp) => {
    try {
      await transporter.sendMail({
        from: "2020an0120743@gmail.com",
        to: email,
        subject: "Your OTP for Verification",
        text: `Your OTP is ${otp}. Please use this to verify your email.`,
      });
      return true;
    } catch (error) {
      console.error("Error sending OTP:", error);
      return false;
    }
  };
  
  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };
  
 const generate_Otp=async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
      const otp = generateOTP();
      const emailSent = await sendOtpEmail(email, otp);
      if (emailSent) {
        res.status(200).json(otp);
      } else {
        res.status(500).json({ message: "Error sending OTP." });
      }
    } catch (error) {
      res.status(500).json({ message: "Email Not found", error });
    }
  };
  
const setpassword= async (req, res) => {
    const { email, newpassword } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const hashedPassword = await bcrypt.hash(newpassword, 10);
  
      user.password = hashedPassword;
      await user.save();
  
      return res.status(200).json({ message: "Password reset successfully!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Error resetting password", error });
    }
  };





 
  const   login_status= async (req, res) => {
    console.log("login status...")
    res.status(200).json({ user: req.user });
   
  };
  
  module.exports={Register,Login,Logout,setpassword,generate_Otp,Logout,login_status}