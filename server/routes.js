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

router.get("/getemaill", function (request, response){
    var firstname = request.query.firstname;

    if (firstname != "") {
        response.send("Your email address is " + firstname + "@gullele.com");
    } else {
        response.send("Please provide us first name");
    }
});

router.get("/signin", function(req, res) {
    var email = 'testuser@mail.com';
    var  password = 'test'
    pool.query(queries.checkUserLogIn, [email, password], (err, res) => {
        if (err) {
            console.log("Error - Failed");
            console.log(err);
        }
        else{
            // console.log(res.rows);
        }
    });
    res.render('signin', {});
});

router.post("/signin", function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    pool.query(queries.checkUserLogIn, [email, password], (e, r) => {
        if (e) {
            res.status(401).send('faill');
        }
        else{
            if (r.rows.length != 1){
                res.status(401).send('failll');
            }else{
                session=req.session;
                session.userid=req.body.email;
                console.log(r.rows);
                res.status(200).send('loginn');
            }
        }
    });
});

router.get("/signup", function(req, res) {
    res.render('signin', {});
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