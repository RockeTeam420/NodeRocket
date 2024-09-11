const mongoose = require('mongoose');
require('dotenv').config();

const URI = `mongodb+srv://${process.env.USERBD}:${process.env.PASSWORDBD}@adso2669736.c6a7gzi.mongodb.net/${process.env.BD}?appName=ADSO2669736`;
// mongodb+srv://Kevin_RocketStore:<db_password>@adso2669736.ptf1civ.mongodb.net/?retryWrites=true&w=majority&appName=ADSO2669736
mongoose.connect(URI);

module.exports = mongoose;
