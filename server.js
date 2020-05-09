const express = require('express')
const mongoose = require('mongoose')
const hbs = require("hbs")
require("./db")
require("dotenv").config()
const ShortUrl = require('./models/schema')
const app = express()
const User = require("./models/user")

mongoose.connect('mongodb://localhost/urlShortener', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
app.use(express.json())
app.set('view engine', 'hbs')

app.use(express.urlencoded({
    extended: false
}))

app.get('/', async (req, res) => {
    // const shortUrls = await ShortUrl.find()
    // console.log(shortUrls)
    // res.render('home', {
    //     shortUrls: shortUrls
    // })
    ShortUrl.find().then(function (data) {
        // console.log(data)
        res.render("home", {
            url: data,
            shortUrl: data.short,
            full: data.full,
            clicks: data.clicks
        })
        // return res.render("products", {
        //             //         product: products,
        //             //         image: products.productPic,
        //             //         length: products.length
        //             //       });
    }).catch(function (err) {
        console.log(err.message)
    })
})
// app.post("/register", (req, res) => {
//     const user = req.body
//     const users = new User({
//         ...req.body
//     }).then(function (data) {
//         console.log(data)
//     }).catch(function (err) {
//         console.log(err.message)
//     })
//     console.log(user)
// })
app.get("/register", (req, res) => {
    res.render("index")
})
app.get("/user/login", (req, res) => {
    res.render("login")
})
app.post("/register", async (req, res) => {
    const email = req.body.email
    const emailFound = await User.findOne({
        email: email
    })
    if (emailFound) {
        return res.send("You are already registered. try to login")
    }
    const user = new User({
        ...req.body
    });
    user.save().then(function (data) {
        // console.log(data)
        res.redirect("/user/login")
    }).catch(function (err) {
        console.log(err.message)
    })

})
// app.get("/", function (req, res) {
//     res.render("home.hbs")
// })
app.post("/login", (req, res) => {
    var body = req.body;
    console.log(body)
    var email = body.email;
    var password = body.password;
    if (!email || !password) return res.send("Invalid Creadiantials");
    User.userFind(email, password)
        .then(function (user) {
            // console.log(user)
            res.render("login",user.name)
            
        })
        .catch(function (err) {
            res.send("invalid Credintials");
        });
})
app.post('/shortUrls', async (req, res) => {
    await ShortUrl.create({
        full: req.body.fullUrl
    })
    // res.redirect('/')
    res.redirect("/")
})

app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({
        short: req.params.shortUrl
    })
    if (shortUrl == null) return res.sendStatus(404)
    shortUrl.clicks++
    shortUrl.save()

    res.redirect(shortUrl.full)
})


app.listen(process.env.PORT || 5000, () => {
    console.log("server connected")
});

// user
//     .save()
//     .then(function (user) {
//         req.session.userId = user._id;
//         res.redirect("/user/login");
//     })
//     .catch(function (err) {
//         console.log(err);
//         if (err.name === "ValidationError")
//             return res.status(400).send(`Validation Error: ${err.message}`);
//     });