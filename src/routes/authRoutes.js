import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
const router = express.Router();

const generateToken = (userId) => {
    return jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn:"15d"})
}

router.post("/register", async (req, res) => {
    try {
        const {email, username, password} = req.body;

        if(!username || !email || !password) {
            return res.status(400).json({message:"All fields are required"});
        }
        if(password.length < 6 ) {
            return res.status(400).json({message:"Password should be atleast 6 character long."});
        }
        if(username.length <3) {
            return res.status(400).json({message:"Username should be atleast 3 characters long."});
        }
        //Check if user already existed 
        const existingEmail = await User.findOne({email});
        if(existingEmail) {
            return res.status(400).json({message: "Email already exists."});
        }
        const existingUsername = await User.findOne({username});
        if(existingUsername) {
            return res.status(400).json({message:"Username already exist."});
        }

        const user = new User({
            username,
            email,
            password,
        })
        await user.save();

        const token = generateToken(user._id)
        res.status(200).json({
            token,
            user : {
                id: user._id,
                username:user.username,
                email:user.email,
                profileImage: user.profileImage
            }
        })
    } catch (error) {
        console.log("Error in register route", error);
        res.status(500).json({message:"Internal server error"});
    }
});
router.post("/login", async (req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password) return res.status(400).json({message:"All fields are required"});

        //Check if user exists 
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({message:"Invalid crediantials"});

        const isPasswordCorrect = await user.comparePassword(password);
        if(!isPasswordCorrect) return res.status(400).json({message:"Invalid crediantials"});

        const token = generateToken(user._id);

        res.status(200).json({
            token,
            user: {
               id: user._id,
               username: user.username,
               email: user.email, 
            },
        });

    } catch (error) {
        console.log("Error while login",error);
        res.status(500).json({message:"Internal server error"});
    }
});
export default router;