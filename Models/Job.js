const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JobSchema = new Schema({
    role: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
},
    {
        timestamps: {
            createdAt: "createdAt",
            updatedAt: "updatedAt"
        }
    }
)

const JobModel = mongoose.model('job', JobSchema);

module.exports = JobModel;