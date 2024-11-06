const express = require("express");
const app = express();
const port = 8080;
const expressSession = require("express-session");
const connectFlash = require("connect-flash");
const path= require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))

const expressOption = {
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized: true
}

app.use(expressSession(expressOption));
app.use(connectFlash());

app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})


app.get("/register", (req, res)=>{
    let {name="anonymous"}= req.query;
    req.session.name= name;
    if(name=== "anonymous"){
        req.flash("error", "user not registerd");
    }
    else{
        req.flash("success", "Registerd Successfully");
    }
    res.redirect("/hello")
});

app.get("/hello", (req, res)=>{
    res.render("page.ejs", {name: req.session.name});
})


app.get("/test", (req, res)=>{
    res.send("test done");
})

app.get("/count", (req, res)=>{
    if(req.session.count){
        req.session.count++;
    } else{
        req.session.count = 1;
    }
    res.send(`request count is ${req.session.count}`);
})

app.listen(port, ()=>{
    console.log("Listining on port : 8080");
})