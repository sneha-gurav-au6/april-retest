var mongoose = require("mongoose");
const mongoUri = "mongodb+srv://sneha:snehagurav@cluster0-5hcbr.mongodb.net/test?retryWrites=true&w=majority"
mongoose
    .connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true
    })
    .then(() => {
        console.log("mongoose connected");
    })
    .catch((err) => {
        console.log(err.message);
    });