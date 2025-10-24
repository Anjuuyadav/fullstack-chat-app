const User = require("../models/userModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const  generateToken  = require("../lib/utils");
// const { cloudinary_js_config } = require("../lib/cloudinary");
const cloudinary = require("../lib/cloudinary");

const signup = async(req , res) => {
     const{email, password, fullName} = req.body;
    try {
        if(!fullName || !password || !email){
            return res.status(400).json({message: "All fields are required"});
        }
        if(password.length < 6){
            return res.status(400).json({message: "Password must be at least 6 characters"});
        }
        let existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"Email already exists"})
        };
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashPassword,
        });

        if(newUser){
            //GENERATING JWT TOKEN
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            })
        }else{
            res.status(400).json({message: "Invalid Credentials"})
        }

        
    } catch (error) {
        console.log("Error in signup controller",error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

const login = async(req, res) => {
   const {email, password} = req.body;
    try {
        let existingUser = await User.findOne({email});
        if(!existingUser){
           return res.status(400).json({message: "Invalid Credentials"});
        }
        let confirmPassword = await bcrypt.compare(password, existingUser.password);
        if(!confirmPassword){
            return res.status(400).json({message: "Invalid Credentials"});
        }
        generateToken(existingUser._id, res);
        res.status(200).json({
            _id:existingUser._id,
            fullName: existingUser.fullName,
            email: existingUser.email,
            profilePic: existingUser.profilePic,
        });
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
};

const logout = async(req, res) => {
    try {
        res.cookie("jwt", "", {maxAge:0});
        res.status(200).json({message:"Logged out successfully"});
    } catch (error) {
        console.log("Error in logout Controller", error.messsage);
        res.status(500).json({message:"Internal Server Error"});
    }
}

const updateProfile = async(req, res) => {
    try {
        const {profilePic} = req.body;
        const userId = req.user._id;

        if(!profilePic){
            return res.status(400).json({message: "Profile Pic is required"});
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic, {
            folder: "profile_pics",
        });
        const updateUser = await User.findByIdAndUpdate(userId, {profilePic: uploadResponse.secure_url}, {new: true});

        res.status(200).json(updateUser);

    } catch (error) {
        console.log("Error in updateProfile controller", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

const checkAuth = async(req, res) => {
    try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


module.exports = {
    signup,
    login,
    logout,
    updateProfile,
    checkAuth
}