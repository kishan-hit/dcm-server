const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');

require('dotenv').config();
require('./Models/Db');
const PORT = process.env.PORT || 8080;


app.use(bodyParser.json());
app.use(cors());
app.use('/auth', AuthRouter);
app.use('/resumes', express.static("resumes"));
app.use(express.json());


const multer = require('multer');
const { default: mongoose } = require('mongoose');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './resumes')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() 
      cb(null, uniqueSuffix + file.originalname)
    }
  })
  
  const upload = multer({ storage: storage })


const ApplicantModel = require('./Models/Applicant');
const { status } = require('express/lib/response');

app.post("/post-application",upload.single("resume"), async(req,res) => {
    const role = req.body.role;
    const name = req.body.name;
    const email = req.body.email;
    const contact = req.body.contact;
    const fileName = req.file.filename;

    try{
        await ApplicantModel.create({
            role: role,
            name: name,
            email: email,
            contact: contact,
            resume: fileName
        })
        res.send({status: "ok"});
    } catch(err){
        res.json({status: err})
    }
})


app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})