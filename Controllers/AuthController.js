const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AdminModel = require("../Models/Admin");
const QueryModel = require('../Models/Query');
const JobModel = require('../Models/Job');
const ApplicantModel = require('../Models/Applicant')



const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const admin = await AdminModel.findOne({ email });
        if (admin) {
            return res.status(409)
                .json({ message: 'User already exists', success: false });
        }
        const adminModel = new AdminModel({ name, email, password });
        adminModel.password = await bcrypt.hash(password, 10);
        await adminModel.save();
        res.status(201)
            .json({
                message: "Signup success",
                success: true
            })
    } catch (err) {
        res.status(500)
            .json({
                message: "Internal server errror",
                success: false
            })
    }
}


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await AdminModel.findOne({ email });
        const errorMsg = 'Auth failed email or password is wrong';
        if (!admin) {
            return res.status(403)
                .json({ message: errorMsg, success: false });
        }
        const isPassEqual = await bcrypt.compare(password, admin.password);
        if (!isPassEqual) {
            return res.status(403)
                .json({ message: errorMsg, success: false });
        }
        const jwtToken = jwt.sign(
            { email: admin.email, _id: admin._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )

        res.status(200)
            .json({
                message: "Login Success",
                success: true,
                jwtToken,
                email,
                name: admin.name
            })
    } catch (err) {
        res.status(500)
            .json({
                message: "Internal server errror",
                success: false
            })
    }
}


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


async function getJobs(req,res){
    try {
        const jobList = await JobModel.find({});
        jobList.reverse();
        return res.status(201).send(jobList);

    } catch (error) {
        return res.send(error);
    }
}


async function getQueries(req,res){
    try {
        const queryList = await QueryModel.find({});
        queryList.reverse();
        return res.status(201).send(queryList);

    } catch (error) {
        return res.send(error);
    }
}

async function getApplicants(req,res){
    try {
        const applicantList = await ApplicantModel.find({});
        applicantList.reverse();
        return res.status(201).send(applicantList);

    } catch (error) {
        return res.send(error);
    }
}

module.exports = {
    signup,
    login,
    postQuery,
    getQueries,
    postJob,
    getJobs,
    getApplicants
}