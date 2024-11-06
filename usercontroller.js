const user = require("../models/user.js");

module.exports.signupform= (req, res) => {
    res.render("./users/signup.ejs");
}

module.exports.signup= async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        let newuser = new user({
            username,
            email
        });

        let user1 = await user.register(newuser, password);
        req.login(user1,(err) => {
            if (err) {
                return next();
            }
            req.flash("success", "Welcome to wonderlust");
            res.redirect("/listing")
        })
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/Signup");
    }

}

module.exports.loginform = (req, res) => {
    res.render("./users/login.ejs");
}

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to wonderlust");
    let redirecturl = res.locals.redirecturl || "/listing";
    res.redirect(redirecturl);
}

module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next();
        }
        req.flash("success", "you are logout");
        res.redirect("/listing");
    });
}