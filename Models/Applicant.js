const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ApplicantSchema = new Schema({
    role: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    contact: {
        type: String,
        required: true
    },
    resume: {
        type: String
    },
    qualification: {
        type: String
    }
},
    {
        timestamps: {
            createdAt: "createdAt",
            updatedAt: "updatedAt"
        }
    }
)

const ApplicantModel = mongoose.model('applicant', ApplicantSchema);

module.exports = ApplicantModel;