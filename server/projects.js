var express = require('express');
var url = require('url'); 
var router = express.Router();
var pool = require('./models/database');
const queries = require('./fixed_data/queries');
const categories = require('./fixed_data/category');
const helper = require('./models/helper');
var session;

// Personal Record Page
router.get('/personal_record', function(req, res, next) {
    session=req.session;
    var chart_data;
    if(session.userId){
        // Query to get Friend
        pool.query(queries.getFriend, [session.userId], (e, r) => {
            if (e){
                res.status(401).send('fail');
            } else {
                // Query to get historical price for personal
                pool.query(queries.getHistoricalPersonalRecord, [session.userId], (e2, r2) => {
                    if (e2){
                        res.status(401).send('fail');
                    } else {
                        // Query to get historical price for friends
                        pool.query(queries.getHistoricalPersonalRecordFriend, [session.userId], (e3, r3) => {
                            chart_data = helper.organizeChartData(r2.rows);
                            friend_chart_data = helper.organizeFriendData(r3.rows, r.rows);
                            res.render('personal_record', 
                            { username: session.userEmail, categories: categories.category, 
                                friends: r.rows, dates: chart_data[0], datas: chart_data[1],
                                friend_dates: friend_chart_data[0], friend_datas: friend_chart_data[1],
                                friend_names: helper.getFriendName(r.rows)
                            });
                        });
                    }
                })
            }
        });
    } else {
        res.redirect('/signin');
    }
});

router.post('/personal_record', function(req, res, next) {
    // Receieve Data
    session=req.session;
    var amount = req.body.amount;
    var category = req.body.category;
    var friend = req.body.friend;
    var date = req.body.date;

    // Set up multiselect data
    friend = helper.multiselectHelper(friend);

    // Save records for friends
    for (let i=0; i<friend.length; i++) {
        pool.query(queries.savePersonalRecordFriend, [session.userId, amount, date, friend[i]], (e, r) => {
            console.log(e);
            if (e){
                res.status(401).send('fail');
            }
        });
    }

    // Save records for personal
    if (amount != "" && date != ""){
        pool.query(queries.savePersonalRecord, [session.userId, category, amount, date], (e, r) => {
            console.log(e);
            if (e){
                res.status(401).send('fail');
            }
        });
    }

    // Refresh page
    res.redirect('/projects/personal_record');
});

// Under personal record for adding friends
router.post('/addfriend', function(req, res, next) {
    session=req.session;
    var name = req.body.name;
    if (name != ""){
        pool.query(queries.addFriend, [session.userId, name], (e, r) => {
            console.log(e);
            if (e){
                res.status(401).send('fail');
            }
        });
    }
    res.redirect('/projects/personal_record');
});


// Group Record Page
router.get('/group_record', function(req, res, next) {
    session=req.session;
    if(session.userId){
        // Query to get Friend
        pool.query(queries.getFriend, [session.userId], (e, r) => {
            if (e){
                res.status(401).send('fail');
            } else {
                res.render('group_record',{username: session.userEmail, friends: r.rows});
            }
        });
    } else {
        res.redirect('/signin');
    }
});

router.post('/group_record', function(req, res, next) {
    session=req.session;
    var amount = req.body.amount;
    var payee = req.body.payee;
    var select2 = req.body.select2;
    var length = req.body.length;
    var tip = req.body.tip;
    var dummy_user = 'dummy'
    console.log(req.body);
    select2 = helper.multiselectHelper(select2);
    payee = helper.multiselectHelper(payee);
    length = helper.multiselectHelper(length);
    tip = tip == '' ? '0' : tip;
    var record = helper.getGroupRecordSummary(amount, payee, select2, length, tip);
    res.render('result.ejs', {username: session.userEmail, record: record});
});
module.exports = router;