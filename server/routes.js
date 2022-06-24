var express = require('express');
var router = express.Router();
var pool = require('./models/database');
const queries = require('./fixed_data/queries');
var session;

// Home Page
router.get('/', function(req, res, next) {
    session=req.session;
    if(session.userEmail){
        res.render('index', { username: session.userEmail });
    } else {
        res.render('index', { username: null });
    }
});


// Sign In Page
router.get("/signin", function(req, res) {
    session=req.session;
    if(session.userEmail){
        res.redirect('/');
    }
    res.render('signin', {});
});

router.post("/signin", function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    pool.query(queries.checkUserLogIn, [email, password], (e, r) => {
        if (e) {
            res.status(401).send('fail');
        }
        else{
            if (r.rows.length < 1){
                res.status(201).send('fail');
            }else{
                session=req.session;
                session.userId=r.rows[0].id;
                session.userEmail=req.body.email;
                res.status(200).send('login');
            }
        }
    });
});


// Sign Up Page
router.get("/signup", function(req, res) {
    session=req.session;
    if(session.userEmail){
        res.redirect('/');
    }
    res.render('signup', {});
});

router.post("/signup", function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    var first_name = req.body.password;
    var last_name = req.body.password;
    pool.query(queries.addUser, [email, password, first_name, last_name], (e, r) => {
        if (r !== undefined && r.rowCount == 1){
            res.status(200).send('created');
        } else {
            res.status(401).send('fail');
        }
    });
});


// Sign Out Redirect
router.get("/signout", function(req, res) {
    req.session.userId = null;
    req.session.userEmail = null;
    res.redirect('/');
});

module.exports = router;