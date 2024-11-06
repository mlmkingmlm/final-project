if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}
console.log(process.env.SECRET)

const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const mongoose = require("mongoose");
const ejsmate = require("ejs-mate");
const methodoverride = require("method-override");
const expresserr = require("./utils/expressError.js");
// const { listingschema, reviewschema } = require("./joi.js");
const listingroute = require("./router/listing.js");
const reviewroute= require("./router/review_route.js");
const userroute= require("./router/user.js");
const expressSession = require("express-session");
const MongoStore = require('connect-mongo');
const messageflash = require("connect-flash");
const passport = require("passport");
const localstratezy = require("passport-local");
const user = require("./models/user.js");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.engine('ejs', ejsmate);
app.use(express.urlencoded({ extended: true }));
app.use(methodoverride("_method"));
app.use(express.static(path.join(__dirname, "public")));


const store = MongoStore.create({
    mongoUrl: process.env.ATLAS_CLUSTER,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

const expressOptions = {
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true
    }
}




app.use(expressSession(expressOptions));
app.use(messageflash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstratezy(user.authenticate()) );

// use static serialize and deserialize of model for passport session support
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());


app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentuser = req.user;
    next();
})

main().then((res) => {
    console.log("db connected ");
}).catch(err => {
    console.log(err);
})

async function main() {
    await mongoose.connect(process.env.ATLAS_CLUSTER);
}

app.use("/listing", listingroute);
app.use("/listing/:id/review", reviewroute);
app.use("/",userroute);


app.get("/demouser", async (req, res)=>{
    let fakeuser = new user({
        email:"mlmking@123",
        username:"Naveen Kumar"
    });

    let newuser = await user.register(fakeuser, "Thigga");
    res.send(newuser);
});


app.all("*", (req, res, next) => {
    next(new expresserr(404, "page not found"));
})

// ERROR HANDLER MIDDLWARE

app.use((err, req, res, next) => {
    let { status = 500, message = "Async error" } = err;
    res.status(status).render("error.ejs", { err }); 
});

app.get("/", (req, res) => {
    res.send("root diractory");
})

 
app.listen(port, () => {
    console.log(`Listining on port:${port}`);
})
