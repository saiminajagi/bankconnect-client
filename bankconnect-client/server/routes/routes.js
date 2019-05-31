var express = require('express');
var nodemailer = require('nodemailer');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var axios = require('axios');


var usermodel = require('../models/usermodel');
var bankmodel = require('../models/bankmodel');
var apimodel = require('../models/apimodel');

var routes = express.Router();

var urlencodedParser = bodyParser.urlencoded({extended: true});
routes.use(bodyParser.json());

var sess;


//YOU SHOULD USE 'urlencodedParser' TO GET THE POST DATA
routes.route('/sendmail')
.post(urlencodedParser,(req,res)=>{

    //get the email and phone.
    console.log("entered /sendmail");
    console.log(req.body);

    var username = req.body.username;
    var fname = req.body.fname;
    var lname = req.body.lname;
    var useremail = req.body.email;
    var pass = req.body.pass;
    var admin = req.body.admin;
    //generate a code.
    var date = new Date();
    var timestamp = date.getTime();

    //make an entry in the database in a collection called users.
    //use the schema of the collection.
    var newuser = new usermodel({
        username: username,
        fname : fname,
        lname : lname,
        admin : admin,
        ts : timestamp,
        email : useremail,
        bankConnected : false,
        confirmation : false,
        integrated : false
    });
    newuser.save((err)=>{
        if(err)
        console.log("error while inserting user " + err);
    });

    sess = req.session;
    sess.email = useremail;
    sess.ts = timestamp;

    sendmail(useremail,timestamp);
    var msg = "Email sent.. Please check your email to continue the process'+ `<br>` + 'you can close this window";
    res.json(msg);
});

routes.route('/confirm/:ts/:id')
.get((req,res)=>{

    usermodel.find({email : req.params.id},(err,doc)=>{
        if(req.params.ts == doc[0].ts){
            usermodel.findOneAndUpdate({email : req.params.id},{$set : {confirmation : true}},{new : true},(err,doc)=>{
            });
            console.log("updated");
            res.redirect('/dashboard');
        }
        else{
            usermodel.findByIdAndRemove({ts : req.params.ts});
            res.json('confirmation failed');
        }
     }).limit(1).sort({ ts : -1});
});

//======================== BANK DETAILS =============================

routes.route('/bankdetails')
.get((req,res)=>{
    usermodel.find({email:sess.email},(err,doc)=>{
        if(doc[0].bankConnected)
            res.json(1)
        else res.json(0);
    })
})
.post(urlencodedParser,(req,res)=>{
    var sess;
    sess = req.session;

    var newbank = new bankmodel({
    bankname : req.body.bankname,
    username : req.body.username,
    pass = req.body.pass,
    email = sess.email
    });
    newbank.save();

    var date = new Date();
    var timestamp = date.getTime();

    sendmail_bank(sess.email,timestamp);
    var msg = "Email sent.. Please check your email to continue the process'+ `<br>` + 'you can close this window";
    res.json(msg);
})

//======================== CONFIRMATION ===================
routes.route('/bank_confirm/:ts/:id')
.get((req,res)=>{
    bankmodel.find({email : req.params.id},(err,doc)=>{
        if(req.params.ts == doc[0].ts){
            usermodel.findOneAndUpdate({email : req.params.id},{$set : {bankConnected : true}},{new : true},(err,doc)=>{
            });
            console.log("updated bank");
            res.redirect('/dashboard');
        }
        else{
            bankmodel.findByIdAndRemove({ts : req.params.ts});
            res.json('confirmation failed');
        }
     }).limit(1).sort({ ts : -1});
});

// ============================== ALL ABOUT IDBP ============================
routes.route('/idbpdetails')
.get((req,res)=>{
    usermodel.find({email:sess.email},(err,doc)=>{
        if(doc[0].bankConnected)
            res.json(1)
        else res.json(0);
    })
})
.post(urlencodedParser,(req,res)=>{

})

routes.route('/integrated')
.get((req,res)=>{
    var sess = req.session;

    if(sess.email){
        usermodel.find({email: sess.email},(err,doc)=>{
            console.log(doc[0].integrated);
            console.log(doc[0].confirmation);
            if((!doc[0].integrated && !doc[0].confirmation)||(doc[0].integrated)){
                console.log("sending 1");
                res.json(1);
            }
            else res.json(0);
        });
    }else
        res.json(1);

})

//============================ PROFILE ===========================================
routes.route('/profile')
.get((req,res)=>{
    var sess = req.session;

    usermodel.find({email: sess.email},(err,doc)=>{
      var myObj = {
        username: doc[0].username,
        fname: doc[0].fname,
        lname: doc[0].lname,
        admin: doc[0].admin,
        useremail: doc[0].email
      }
      res.json(myObj)
    })
});
//==============================END OF ROUTING =======================================

function sendmail(email,ts){
    var link = `http://localhost:3000/route/confirm/${ts}/${email}`;
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            // user: process.env.GMAIL_USER,
            // pass: process.env.GMAIL_PASS
            user : 'tushartdm117@gmail.com',
            pass : 'fcb@rc@M$N321'
        }
        });

        var mailOptions = {
            from: 'tushartdm117@gmail.com',
            to: `${email}`,
            subject: 'Email confirmation for Bank Connect',
            text: 'That was easy!',
            html : `${link}`
        };

        transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
        });
}

function sendmail_bank(email,ts){
    var link = `http://localhost:3000/bank_confirm/confirm/${ts}/${email}`;
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            // user: process.env.GMAIL_USER,
            // pass: process.env.GMAIL_PASS
            user : 'tushartdm117@gmail.com',
            pass : 'fcb@rc@M$N321'
        }
        });

        var mailOptions = {
            from: 'tushartdm117@gmail.com',
            to: `${email}`,
            subject: 'Email confirmation for Bank Connect',
            text: 'That was easy!',
            html : `${link}`
        };

        transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
        });
}

module.exports = routes;
