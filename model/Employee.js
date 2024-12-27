const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Employee', employeeSchema);

// The model 'Employee' looks for the collecion 'employees' in the database 'companyDB'
// (lowercase, plural version of the model name)