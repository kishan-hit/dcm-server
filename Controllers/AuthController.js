const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AdminModel = require("../Models/Admin");
const QueryModel = require('../Models/Query');
const JobModel = require('../Models/Job');
const ApplicantModel = require('../Models/Applicant')

const User = require('../Models/User');
const TempUser = require('../Models/TempUserSchema')
const nodemailer = require('nodemailer');
const crypto = require('crypto');

require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const sendOTP = (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: "prakashankit526@gmail.com",
        subject: 'Register as DCM admin',
        text: `Your OTP code is ${otp}.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        }
        else {
            console.log('Email sent: ' + info.response);
        }
    });
};

const register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // const userExists = await User.findOne({ email });

        // if (userExists) {
        //   return res.status(400).json({ message: 'User already exists' });
        // }

        // const otp = crypto.randomInt(100000, 999999).toString();
        // const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        // const hashedPassword = await bcrypt.hash(password, 10);

        // const user = new User({
        //   name,
        //   email,
        //   password: hashedPassword,
        //   otp,
        //   otpExpires,
        // });

        // await user.save();

        // await sendOTP(email, otp);

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
        let tempUser = await TempUser.findOne({ email });

        if(tempUser){
            await TempUser.deleteOne({ email });
        }

        // const hashedPassword = await bcrypt.hash(password, 10);
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpiry = Date.now() + 600000; // 10 min

        tempUser = new TempUser({
            name,
            email,
            password: password,
            otp,
            otpExpiry
        });


        await tempUser.save();

        await sendOTP(email,otp);


        res.status(201).json({ message: 'Please verify OTP.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        // const user = await User.findOne({ email });
        // if (!user) {
        //     return res.status(400).json({ message: 'Invalid email or OTP' });
        // }

        // if (user.otp !== otp || user.otpExpires < Date.now()) {
        //     return res.status(400).json({ message: 'Invalid or expired OTP' });
        // }

        // user.isVerified = true;
        // user.otp = undefined;
        // user.otpExpires = undefined;
        // await user.save();

        const tempUser = await TempUser.findOne({ email });
        if (!tempUser) {
            return res.status(400).json({ message: 'Invalid email or OTP' });
        }

        if (tempUser.otp !== otp || tempUser.otpExpiry < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        const newUser = new User({
            name: tempUser.name,
            email: tempUser.email,
            password: tempUser.password
        });

        await newUser.save();
        await TempUser.deleteOne({ email });

        res.status(200).json({ message: 'OTP verified. User is now verified.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User doesn't exist" });
        }

        // const isMatch = await bcrypt.compare(password, user.password);
        const isMatch = (password === user.password)

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '3h',
        });

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// const signup = async (req, res) => {
//     try {
//         const { name, email, password } = req.body;
//         const admin = await AdminModel.findOne({ email });
//         if (admin) {
//             return res.status(409)
//                 .json({ message: 'User already exists', success: false });
//         }
//         const adminModel = new AdminModel({ name, email, password });
//         adminModel.password = await bcrypt.hash(password, 10);
//         await adminModel.save();
//         res.status(201)
//             .json({
//                 message: "Signup success",
//                 success: true
//             })
//     } catch (err) {
//         res.status(500)
//             .json({
//                 message: "Internal server errror",
//                 success: false
//             })
//     }
// }


// const login = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const admin = await AdminModel.findOne({ email });
//         const errorMsg = 'Auth failed email or password is wrong';
//         if (!admin) {
//             return res.status(403)
//                 .json({ message: errorMsg, success: false });
//         }
//         const isPassEqual = await bcrypt.compare(password, admin.password);
//         if (!isPassEqual) {
//             return res.status(403)
//                 .json({ message: errorMsg, success: false });
//         }
//         const jwtToken = jwt.sign(
//             { email: admin.email, _id: admin._id },
//             process.env.JWT_SECRET,
//             { expiresIn: '24h' }
//         )

//         res.status(200)
//             .json({
//                 message: "Login Success",
//                 success: true,
//                 jwtToken,
//                 email,
//                 name: admin.name
//             })
//     } catch (err) {
//         res.status(500)
//             .json({
//                 message: "Internal server errror",
//                 success: false
//             })
//     }
// }


const postQuery = async (req, res) => {
    try {
        const { name, email, contact, query } = req.body;
        await QueryModel.create({ name, email, contact, query });
        res.status(201)
            .json({
                message: "Query sent",
                success: true
            })
    } catch (err) {
        res.status(500)
            .json({
                message: "Server errror",
                success: false
            })
    }
}


const postJob = async (req, res) => {
    try {
        const { role, description } = req.body;
        await JobModel.create({ role, description });
        res.status(201)
            .json({
                message: "Job posted",
                success: true
            })
    } catch (err) {
        res.status(500)
            .json({
                message: "Server errror",
                success: false
            })
    }
}


async function getJobs(req, res) {
    
    try {
        const jobList = await JobModel.find({});
        jobList.reverse();
        return res.status(201).send(jobList);

    } catch (error) {
        return res.send(error);
    }
}


async function getQueries(req, res) {
    try {
        const queryList = await QueryModel.find({});
        queryList.reverse();
        return res.status(201).send(queryList);

    } catch (error) {
        return res.send(error);
    }
}

async function getApplicants(req, res) {
    try {
        const role = req.query.role;
        const applicantList = await ApplicantModel.find({});
        var result = applicantList.filter(function(e, i) {
            return e.role == role
          })
        
        result.reverse();
        return res.status(201).send(result);

    } catch (error) {
        return res.send(error);
    }
}

module.exports = {
    // signup,
    login,
    postQuery,
    getQueries,
    postJob,
    getJobs,
    getApplicants,
    getUser,
    register,
    verifyOtp,
    sendOTP
}