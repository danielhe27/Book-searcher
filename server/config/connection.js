//importing a mongoose library
const mongoose = require('mongoose');

//connecting to mongodb database using the connecting string from the.env file
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/googlebooks');

//exporting the connection object
module.exports = mongoose.connection;
