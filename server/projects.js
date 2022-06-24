var express = require('express');
var router = express.Router();
var pool = require('./models/database');
const queries = require('./fixed_data/queries');
const categories = require('./fixed_data/category');
var session;

// test
router.get('/', function(req, res, next) {
    session=req.session;
});

router.get('/personal_record', function(req, res, next) {
    session=req.session;
    var date_list;
    var data_list;
    var chart_data;
    if(session.userId){
        pool.query(queries.getFriend, [session.userId], (e, r) => {
            if (e){
                res.status(401).send('fail');
            } else {
                pool.query(queries.getHistoricalPersonalRecord, [session.userId], (e2, r2) => {
                    chart_data = organizeChartData(r2.rows);
                    console.log(chart_data[0]);
                    console.log(chart_data[1]);
                    res.render('personal_record', 
                    { username: session.userEmail, categories: categories.category, friends: r.rows, dates: chart_data[0], datas: chart_data[1]});
                })
            }
        });
    } else {
        res.redirect('/signin');
    }
});

router.post('/personal_record', function(req, res, next) {
    session=req.session;
    var amount = req.body.amount;
    var category = req.body.category;
    var friend = req.body.friend;
    var date = req.body.date;
    if (!Array.isArray(friend)){
        friend = [friend];
    }
    for (let i=0; i<friend.length; i++) {
        pool.query(queries.savePersonalRecordFriend, [session.userId, amount, date, friend[i]], (e, r) => {
            console.log(e);
            if (e){
                res.status(401).send('fail');
            }
        });
    }
    pool.query(queries.savePersonalRecord, [session.userId, category, amount, date], (e, r) => {
        console.log(e);
        if (e){
            res.status(401).send('fail');
        }
    });
    res.redirect('/projects/personal_record');
});

function organizeChartData(rows) {
    var date_list;
    var data_list;
    var temp_date;
    var all_data = {};
    for(let i=0; i < rows.length; i++){
        temp_date = rows[i].date.toISOString().split('T')[0];
        if(!Object.keys(all_data).includes(temp_date)){
            all_data[temp_date] = 0;
        }
        all_data[temp_date] += parseFloat(rows[i].amount);
    }
    var items = Object.keys(all_data).map(function(key) {
        return [key, all_data[key]];
    });
    items.sort(function(a, b) {
        a = a[0].split('-').join('');
        b = b[0].split('-').join('');
        return a > b ? 1 : a < b ? -1 : 0;
    });
    date_list = items.map(function(element) {
        return element[0]
    });
    data_list = items.map(function(element) {
        return element[1]
    });
    return [date_list, data_list];
}

module.exports = router;