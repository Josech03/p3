var express = require('express');
var router = express.Router();
var passport = require('passport');
var cookieParser= require('cookie-parser');
var session = require('express-session');
var PassportLocal = require('passport-local').Strategy;

require('dotenv').config();

router.use(express.urlencoded({extended: true}));
router.use(cookieParser(process.env.COOKIE));
router.use(session({
	secret: process.env.COOKIE,
	resave: true,
	saveUninitialized: true
}));

router.use(passport.initialize());
router.use(passport.session());

passport.use( new PassportLocal(function(username, password, done){

	if(username === process.env.USUARIO_PRIVADO && password === process.env.CLAVE_PRIVADA)
		return done(null,{id: 1, name: "Administrador"});

	done(null, false)
}))

passport.serializeUser(function(user, done){
	done(null, user.id)
})

passport.deserializeUser(function(_user, done){
	done(null,{id: 1, name: "Aministrador"});
});
router.get('/login',(_req,res)=>{
	res.render('login.ejs')
});

router.post('/login', passport.authenticate('local',{
	successRedirect: "/",
	failureRedirect: "/login"
}));

router.get('/',(req, res, next)=>{
	if(req.isAuthenticated()) return next();

	res.redirect("/login")
})

router.get('/', function(_req, res, _next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
