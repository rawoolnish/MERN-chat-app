const asyncHandler = require("express-async-handler");
const genarateToken = require("../../config/genarateToken");
const bcrypt = require('bcryptjs')
const User = require('../models/user')


const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("All fields mandatory");
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    const user = await User.create({
        name,
        email,
        password,
        pic,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            pic: user.pic,
            token: genarateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error("Something went Wrong");
    }
});


const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error("All fields mandatory");
    }

    const user = await User.findOne({ email });

    if (!user) {
        res.status(400);
        throw new Error("User Not Found")
    } else {
        const passwordCompare = await bcrypt.compare(password, user.password)
        if (passwordCompare) {
            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                pic: user.pic,
                token: genarateToken(user._id)
            })
        } else {
            res.status(400);
            throw new Error("Invalid Password")
        }
    }
})


const allUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search
        ? {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } },
            ],
        }
        : {};

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(users);
});
module.exports = { registerUser, authUser, allUsers }