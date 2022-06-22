var express = require('express');
var router = express.Router();
var pool = require('./models/database');
const queries = require('./queries/queries');
var session;

router.get('/', function(req, res, next) {
    session=req.session;
    if(session.userid){
        res.render('index', { username: session.userid });
    } else {
        res.render('index', { username: null });
    }
});

router.get("/signin", function(req, res) {
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
            if (r.rows.length != 1){
                res.status(201).send('fail');
            }else{
                session=req.session;
                session.userid=req.body.email;
                res.status(200).send('login');
            }
        }
    });
});

router.get("/signup", function(req, res) {
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

router.get("/signout", function(req, res) {
    req.session.userid = null;
    res.redirect('/');
});









router.get("/home", function(req, res) {
    var email = req.query.email;
    var password = req.query.password;
    pool.query(queries.checkUserLogIn, [email, password], (err, res) => {
        if (err) {
            console.log("Error - Failed");
            console.log(err);
        }
        else{
            res.render('home', {});
        }
    });
});

module.exports = router;