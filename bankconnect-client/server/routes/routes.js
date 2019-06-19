var express = require('express');
var nodemailer = require('nodemailer');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var axios = require('axios');
var cors = require('cors');
var passwordHash = require('password-hash');

var usermodel = require('../models/usermodel');
var bankmodel = require('../models/bankmodel');
var request = require('../models/requestmodel');

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

    var hashpwd = passwordHash.generate(req.body.pass);

    var username = req.body.username;
    var fname = req.body.fname;
    var lname = req.body.lname;
    var useremail = req.body.email;
    var pass = hashpwd;
    var org = req.body.org;
    //generate a code.
    var date = new Date();
    var timestamp = date.getTime();

    //make an entry in the database in a collection called users.
    //use the schema of the collection.
    var newuser = new usermodel({
        username: username,
        fname : fname,
        lname : lname,
        org : org,
        ts : timestamp,
        password : pass,
        email : useremail,
        confirmation : false,
        role : "fintech"
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

    var newrequest = new request({
      org: org,
      email: useremail
    });

    newrequest.save();

    sendmail(useremail,timestamp);
    var msg = "Email sent.. Please check your email to continue the process'+ `<br>` + 'you can close this window";
    res.json(msg);
});

routes.route('/confirm/:ts/:id')
.get((req,res)=>{
  var sess = req.session;
    usermodel.find({email : req.params.id},(err,doc)=>{

        if(req.params.ts === doc[0].ts){
            usermodel.findOneAndUpdate({email : req.params.id},{$set : {confirmation : true}},{new : true},(err,doc)=>{
            });
            console.log("updated");
            //res.redirect('/dashboard');
            res.sendFile(path.join(__dirname,'fileupload.html'));
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
        integrated : false,
        apis : null,
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

routes.route('/loginconfirm')
.post(urlencodedParser,(req,res)=>{
    var sess = req.session;
    usermodel.find({email: req.body.email},(err,doc)=>{
        if(doc.length == 0){
            var msg = "Invalid email";
            var obj = {
                status: 0,
                msg : "entered invalid email"
            }
            res.json(obj);
        }
        else{
            //check for password.
            if(passwordHash.verify(req.body.pass,doc[0].password)){
                //login successful
                sess.email = req.body.email;
                sess.role = doc[0].role;
                var obj = {
                    status: 1,
                    msg : "Login Successful"
                }
                res.json(obj);
            }else{
                console.log("entered wrong pass");
                var obj = {
                    status: 0,
                    msg : "Wrong Password.Please try again"
                }
                res.json(obj);
            }
        }
    })
});

routes.route('/getUserType')
.get((req,res)=>{
    var sess = req.session;
    console.log("sess.email: "+sess.email);
    usermodel.find({email: sess.email},(err,doc)=>{
        res.json(doc[0].role);
    })
})

//============================ PROFILE ===========================================
routes.route('/adminprofile')
.get((req,res)=>{
    var sess = req.session;

    if(sess.admin){
        console.log("user is an admin");
      usermodel.find({email: sess.email},(err,doc)=>{
        if(err) console.log(err);
        if(doc){
            console.log("admin found");
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
        console.log("user is a bank");
      bankmodel.find({email:sess.email},(err,doc)=>{
        console.log("bank found");
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


routes.route('/publishApi')
.post(urlencodedParser,(req,res)=>{
    usermail = req.body.email;
    console.log("email at 5000 "+usermail);
    apis = req.body.apis;
    bankmodel.findOneAndUpdate({email:usermail},{$set:{apis : req.body.apis}},{new: true},(err,doc)=>{
        if(err) console.log(err);
    });
})

routes.route('/checkbank')
.get((req, res)=>{
  var sess = req.session;
  if(sess.bank){
    res.json(1);
  } else{res.json(0);}
});

routes.route('/pendingReq')
.get((req,res)=>{
    request.find({},(err,doc)=>{
        var req = [];
        for(i=0;i<doc.length;++i){
            req.push(doc[i]);
        }
        res.json(req);
    })
})

.post(urlencodedParser,(req,res)=>{
  var state = req.body.state;
  var name = req.body.name;
  var partneremail = req.body.email;
  var sess =req.session;

  if(state){
      usermodel.findOneAndUpdate({name : org},{confirmation:true},{new:true},(err,doc)=>{});

  }
  
  request.findOneAndDelete({org: name},(err, doc)=> console.log(err));
});

routes.route('/getBanks')
.get((req,res)=>{
    bankmodel.find({},(err,doc)=>{

      var banks = [];
      for(var i=0;i<doc.length;++i){
        banks.push(doc[i]);
      }
      
      res.json(banks);
    });
})

routes.route('/getApi')
.post((req,res)=>{
  console.log("the bank is: "+req.body.bank);
  bankmodel.find({bankname: req.body.bank},(err,doc)=>{
    res.json(doc[0].apis);
  })
})

routes.route('/password')
.post((req,res)=>{
    var sess = req.session;

    //check if the passwords are correct
    usermodel.find({email : sess.email},(err,doc)=>{
        if(passwordHash.verify(req.body.old,doc[0].pass)){
            //check if the two passwords match
            if(req.body.new == req.body.renew){
                var hashpwd = passwordHash.generate(pass);
                usermodel.findOneAndUpdate({email :  sess.email},{$set:{pass : hashpwd }},(err,doc)=>{
                    if(err) console.log(err);
                    res.json(1);
                });
            }else res.json(-1);
        }else res.json(0);
    });
})

routes.route('/setBank')
.post(urlencodedParser, (req,res)=>{
    var bank = req.body.bank;

})
routes.route('/profile')
.get((req,res)=>{
    var sess = req.session;

    //check what kind of user he is..
    usermodel.find({email: sess.email},(err,doc)=>{
      var myObj = {
        username: doc[0].username,
        fname: doc[0].fname,
        lname: doc[0].lname,
        useremail: doc[0].email
      }
      res.json(myObj);
    })
});

//==============================END OF ROUTING =======================================

function sendmail(email,ts){
    var link = `http://localhost:5000/route/confirm/${ts}/${email}`;
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
    var link = `http://localhost:5000/route/bank_confirm/${ts}/${email}`;
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
