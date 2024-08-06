const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuerySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    query: {
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

const QueryModel = mongoose.model('query', QuerySchema);

module.exports = QueryModel;