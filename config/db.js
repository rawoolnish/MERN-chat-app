const mongoose = require('mongoose');
const URI = process.env.MONGO_URI;


mongoose.connect(URI).then(() => {
    console.log("connection Successful")
}).catch((error) => {
    console.log("ERROR ! " + error.message)
})




