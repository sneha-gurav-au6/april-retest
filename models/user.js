// const mongo = require("mongoose")
// const User = new mong
var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
var Schema = mongoose.Schema;

var schema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});
schema.statics.userFind = function (email, password) {
    var userObj = null;
    return new Promise(function (resolve, reject) {
        User.findOne({
                email: email
            })
            .then(function (user) {
                if (!user) reject("Incorrect Credintials");
                userObj = user;
                return bcrypt.compare(password, user.password);
            })
            .then(function (isMatched) {
                if (!isMatched) reject("Incorrect credentials");
                resolve(userObj);
            })
            .catch(function (err) {
                reject(err);
            });
    });
};
schema.pre("save", function (next) {
    var user = this;
    if (user.isModified("password")) {
        bcrypt
            .hash(user.password, 10)
            .then(function (hashedPassword) {
                user.password = hashedPassword;
                next();
            })
            .catch(function (err) {
                next(err);
            });
    }
});

var User = mongoose.model("urlUser", schema);
module.exports = User;