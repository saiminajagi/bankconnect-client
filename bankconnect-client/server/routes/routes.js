var express = require('express');
var nodemailer = require('nodemailer');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var axios = require('axios');


var usermodel = require('../models/usermodel');
var bankmodel = require('../models/bankmodel');

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
        confirmation : false,
        sport: "default",
        sip : "default",
        tlsname : "default",
        tlsversion: "default"
    });
    newuser.save((err)=>{
        if(err)
        console.log("error while inserting user " + err);
    });

    sess = req.session;
    sess.email = useremail;
    sess.admin = 1;
    sess.bank = 0;
    sess.ts = timestamp;

    sendmail(useremail,timestamp);
    var msg = "Email sent.. Please check your email to continue the process'+ `<br>` + 'you can close this window";
    res.json(msg);
});

routes.route('/confirm/:ts/:id')
.get((req,res)=>{
  var sess = req.session;
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
.post(urlencodedParser,(req,res)=>{

    var bankname = req.body.bankname;
    var bankemail = req.body.email;
    var bankpass = req.body.pass;
    var date = new Date();
    var timestamp = date.getTime();

    var newbank = new bankmodel({
        bankname: bankname,
        email: bankemail,
        password: bankpass,
        ts: timestamp,
        confirmation : false,
        sport: "default",
        sip : "default",
        tlsname : "default",
        tlsversion: "default"
    });
    newbank.save();

    var sess = req.session;
    sess.email = bankemail;
    sess.admin = 0;
    sess.bank = 1;
    sendmail_bank(req.body.email,timestamp);
    var msg = "Email sent.. Please check your email to continue the process'+ `<br>` + 'you can close this window";
    res.json(msg);
})

//======================== CONFIRMATION ===================
routes.route('/bank_confirm/:ts/:id')
.get((req,res)=>{
    var sess = req.session;
    bankmodel.find({email : req.params.id},(err,doc)=>{
        if(req.params.ts == doc[0].ts){
            bankmodel.findOneAndUpdate({email : req.params.id},{$set : {confirmation : true}},{new : true},(err,doc)=>{
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
.post(urlencodedParser,(req,res)=>{

    var sport = req.body.sport;
    var sip = req.body.sip;
    var tlsname = req.body.tlsname;
    var tlsversion = req.body.tlsversion;

    var sess = req.session;

    if(sess.admin){
      usermodel.find({email:sess.email},(err,doc)=>{
        if(err) console.log('he is not admin');
        if(doc){
          //means he is an admin
          usermodel.findOneAndUpdate({ email : sess.email }, {sport : sport, sip: sip, tlsname:tlsname, tlsversion : tlsversion },{new : true},(err,doc)=>{
            if(err) console.log('error in admin model');
          });
          res.json("updated details");
          console.log('updated admin idbp details');
        }
      })
    }else if(sess.bank){
      bankmodel.find({email:sess.email},(err,doc)=>{
        if(err) console.log('he is not bank');
        if(doc){
          //means he is bank
          bankmodel.findOneAndUpdate({ email : sess.email }, {sport : sport, sip: sip, tlsname:tlsname, tlsversion : tlsversion },{new : true},(err,doc)=>{
            if(err) console.log('error in bank model');
          });
          res.json("updated details");
          console.log('updated bank idbp details');
        }
      })
    }else{
      res.json("please login first");
    }

})


//============================ PROFILE ===========================================
routes.route('/adminprofile')
.get((req,res)=>{
    var sess = req.session;

    if(sess.admin){
      usermodel.find({email: sess.email},(err,doc)=>{
        if(err) console.log(err);
        if(doc){
          var type = "admin";
          var myObj = {
            username: doc[0].username,
            fname: doc[0].fname,
            lname: doc[0].lname,
            admin: doc[0].admin,
            useremail: doc[0].email,
            usertype: type
          }
          res.json(myObj)
        }
      });
    } else if(sess.bank){
      bankmodel.find({email:sess.email},(err,doc)=>{
        if(err) console.log(err);
        if(doc){
          var type = "bank";
          var myObj = {
            bankname: doc[0].bankname,
            bankemail: doc[0].email,
            usertype: type
          }
          res.json(myObj)
        }
      });
    } else{
      res.json("Please login to get profile");
    }


});

routes.route('/checkadmin')
.get((req, res)=>{
  var sess = req.session;
  if(sess.admin){
    res.json(1);
  } else{res.json(0);}
});

routes.route('/checkbank')
.get((req, res)=>{
  var sess = req.session;
  if(sess.bank){
    res.json(1);
  } else{res.json(0);}
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
    var link = `http://localhost:3000/route/bank_confirm/${ts}/${email}`;
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
