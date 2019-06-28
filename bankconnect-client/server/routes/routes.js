var express = require('express');
var nodemailer = require('nodemailer');
var path = require('path');
var bodyParser = require('body-parser');
var passwordHash = require('password-hash');
var url = require('url');
var requestmodule = require('request');
var handlebars = require('handlebars');
var fs = require('fs');

// to read html file
var readHTMLFile = function (path, callback) {
  fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
    if (err) {
      throw err;
      callback(err);
    }
    else {
      callback(null, html);
    }
  });
};

var usermodel = require('../models/usermodel');
var bankmodel = require('../models/bankmodel');
var request = require('../models/requestmodel');
var partner = require('../models/partnermodel');
var files = require('../models/filemodel');
var subapi = require('../models/subapi');

var routes = express.Router();

var urlencodedParser = bodyParser.urlencoded({ extended: true });
routes.use(bodyParser.json());

var sess;

//YOU SHOULD USE 'urlencodedParser' TO GET THE POST DATA
routes.route('/sendmail')
  .post(urlencodedParser, (req, res) => {

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
      fname: fname,
      lname: lname,
      org: org,
      ts: timestamp,
      password: pass,
      email: useremail,
      confirmation: false,
      role: "fintech",
      files: false
    });
    newuser.save((err) => {
      if (err)
        console.log("error while inserting user " + err);
    });

    sess = req.session;
    sess.email = useremail;
    sess.admin = 0;
    sess.fintech = 1;
    sess.bank = 0;
    sess.ts = timestamp;

    var newrequest = new request({
      org: org,
      email: useremail
    });

    newrequest.save();
    var msg = "Thank you.. Please wait for approval to continue the process'+ `<br>` + 'you can close this window now";
    res.json(msg);
  });


//======================== BANK DETAILS =============================

routes.route('/bankdetails')
  .post(urlencodedParser, (req, res) => {

    var bankname = req.body.bankname;
    var bankemail = req.body.email;
    var hashpwd = passwordHash.generate(req.body.pass);
    var date = new Date();
    var timestamp = date.getTime();

    var newbank = new bankmodel({
      bankname: bankname,
      email: bankemail,
      password: hashpwd,
      ts: timestamp,
      confirmation: false,
      integrated: false,
      apis: null,
      sport: "default",
      sip: "default",
      tlsname: "default",
      tlsversion: "default"
    });
    newbank.save();

    var sess = req.session;
    sess.email = req.body.email;
    sess.admin = 0;
    sess.bank = 1;
    sess.fintech = 0;
    console.log("bank email is :" + sess.email);
    sendmail_bank(bankemail, timestamp, bankname);
    var msg = "Email sent.. Please check your email to continue the process'+ `<br>` + 'you can close this window";
    res.json(msg);
  })

//======================== CONFIRMATION ===================
routes.route('/bank_confirm/:ts/:id')
  .get((req, res) => {
    var sess = req.session;
    bankmodel.find({ email: req.params.id }, (err, doc) => {
      if (req.params.ts == doc[0].ts) {
        bankmodel.findOneAndUpdate({ email: req.params.id }, { $set: { confirmation: true } }, { new: true }, (err, doc) => {
        });
        console.log("updated bank");
        res.redirect('/dashboard');
      }
      else {
        bankmodel.findByIdAndRemove({ ts: req.params.ts });
        res.json('confirmation failed');
      }
    }).limit(1).sort({ ts: -1 });
  });

// ============================== ALL ABOUT IDBP ============================
routes.route('/idbpdetails')
  .post(urlencodedParser, (req, res) => {

    var sport = req.body.sport;
    var sip = req.body.sip;
    var tlsname = req.body.tlsname;
    var tlsversion = req.body.tlsversion;

    var sess = req.session;

    if(sess.bank){
      bankmodel.find({ email: sess.email }, (err, doc) => {
        if (err) console.log('he is not bank');
        if (doc) {
          //means he is bank
          bankmodel.findOneAndUpdate({ email: sess.email }, { sport: sport, sip: sip, tlsname: tlsname, tlsversion: tlsversion }, { new: true }, (err, doc) => {
            if (err) console.log('error in bank model');
          });
          res.json("updated details");
          console.log('updated bank idbp details');
        }
      })
    } else {
      res.json("please login first");
    }

  })

routes.route('/loginconfirm')
  .post(urlencodedParser, (req, res) => {
    var sess = req.session;
    usermodel.find({ email: req.body.email }, (err, doc) => {
      if (doc.length == 0) {
        //check if the user is a bank
        bankmodel.find({ email: req.body.email }, (err, doc) => {
          if (doc.length == 0) {
            var msg = "Invalid email";
            var obj = {
              status: 0,
              msg: "entered invalid email"
            }
            res.json(obj);
          } else {
            //he is a user.
            if (passwordHash.verify(req.body.pass, doc[0].password)) {
              sess.email = req.body.email;
              sess.role = doc[0].role;
              sess.bank = 1; sess.admin = 0; sess.fintech = 0;

              var obj = {
                status: 1,
                msg: "Login Successful"
              }
              res.json(obj);
            } else {
              console.log("entered wrong pass");
              var obj = {
                status: 0,
                msg: "Wrong Password.Please try again"
              }
              res.json(obj);
            }
          }
        })

      }
      else {
        //check for password.
        if (passwordHash.verify(req.body.pass, doc[0].password)) {
          //login successful
          sess.email = req.body.email;
          sess.role = doc[0].role;
          if (doc[0].role == "admin"){
            sess.admin = 1; sess.fintech = 0; sess.bank = 0; }
          else if (doc[0].role == "fintech"){
            sess.fintech = 1; sess.admin = 0; sess.bank = 0; }
          console.log("organisation is: " + doc[0].org);
          sess.org = doc[0].org;
          var obj = {
            status: 1,
            msg: "Login Successful"
          }
          res.json(obj);
        } else {
          console.log("entered wrong pass");
          var obj = {
            status: 0,
            msg: "Wrong Password.Please try again"
          }
          res.json(obj);
        }
      }
    })
  });

routes.route('/getUserType')
  .get((req, res) => {
    var sess = req.session;
    console.log("sess.email: " + sess.email);
    if(sess.bank){
      bankmodel.find({ email: sess.email }, (err, doc) => {
        res.json('bank');
      })
    }else if(sess.admin || sess.fintech){
      usermodel.find({ email: sess.email }, (err, doc) => {
        res.json(doc[0].role);
      })
    }
    else{
      res.json('user role not matched');
    }
  })

//============================ADMIN PROFILE: For Fintech and Bank only===========================================
routes.route('/adminprofile')
  .get((req, res) => {
    var sess = req.session;

    if (sess.fintech) {
      console.log("user is an fintech");
      usermodel.find({ email: sess.email }, (err, doc) => {
        if (err) console.log(err);
        if (doc) {
          console.log("fintech found");
          var type = "fintech";
          var myObj = {
            fname: doc[0].fname,
            lname: doc[0].lname,
            useremail: doc[0].email,
            usertype: type
          }
          res.json(myObj)
        }
      });
    } else if (sess.bank) {
      console.log("user is a bank");
      bankmodel.find({ email: sess.email }, (err, doc) => {
        console.log("bank found");
        if (err) console.log(err);
        if (doc) {
          var type = "bank";
          var myObj = {
            bankname: doc[0].bankname,
            bankemail: doc[0].email,
            usertype: type
          }
          res.json(myObj)
        }
      });
    } else {
      res.json("Please login to get profile");
    }
  });

  // =========================PROFILE: For Regulatory board admin or Bank connect admin==============
  routes.route('/profile')
  .get((req, res) => {
    var sess = req.session;

    //check what kind of user he is..
    usermodel.find({ email: sess.email }, (err, doc) => {
      var myObj = {
        username: doc[0].username,
        fname: doc[0].fname,
        lname: doc[0].lname,
        useremail: doc[0].email
      }
      res.json(myObj);
    })
  });

// to get to know who is using the session
routes.route('/checkuserfordashboard')
.get((req, res) => {
  var sess = req.session;
  if(sess.admin){
    res.json('admin');
  }else if(sess.fintech){
    res.json('fintech');
  }else if(sess.bank){
    res.json('bank');
  }else{
    res.json(0)
  }
});

// routes.route('/sendFileForm/:email')
// .get((req,res)=>{
//   var sess = req.session;
//   sess.email = req.params.email;

//   console.log(sess.email+" is filling a file form");
//   res.sendFile(path.join(__dirname,'fileupload.html'));
// })


routes.route('/publishApi')
  .post(urlencodedParser, (req, res) => {
    usermail = req.body.email;
    console.log("email at 5000 " + usermail);
    apis = req.body.apis;
    bankmodel.findOneAndUpdate({ email: usermail }, { $set: { apis: req.body.apis } }, { new: true }, (err, doc) => {
      if (err) console.log(err);
    });
  })

routes.route('/getPartners')
  .get((req, res) => {
    partner.find({}, (err, doc) => {
      var part = [];
      for (i = 0; i < doc.length; ++i) {
        part.push(doc[i]);
      }
      res.json(part);
    })
  })


routes.route('/pendingReq')
  .get((req, res) => {
    request.find({}, (err, doc) => {
      var req = [];
      for (i = 0; i < doc.length; ++i) {
        req.push(doc[i]);
      }
      res.json(req);
    })
  })

  .post(urlencodedParser, (req, res) => {
    var state = req.body.state;
    var org = req.body.org;
    var partneremail = req.body.email;
    var sess = req.session;

    if (state) {
      usermodel.findOneAndUpdate({ email: partneremail }, { confirmation: true }, { new: true }, (err, doc) => { });
      var newpartner = new partner({
        org: org,
        email: partneremail,
        active: true,
        files: false
      });

      newpartner.save();
    }

    request.findOneAndDelete({ org: org }, (err, doc) => console.log(err));

    sendmailtopartner(partneremail, org);
  });

routes.route('/getBanks')
  .get((req, res) => {
    bankmodel.find({}, (err, doc) => {

      var banks = [];
      for (var i = 0; i < doc.length; ++i) {
        banks.push(doc[i]);
      }

      res.json(banks);
    });
  })

routes.route('/getApi')
  .post((req, res) => {
    console.log("the bank is: " + req.body.bank);
    bankmodel.find({ bankname: req.body.bank }, (err, doc) => {
      res.json(doc[0].apis);
    })
  })

routes.route('/password')
  .post((req, res) => {
    var sess = req.session;

    //check if the passwords are correct
    usermodel.find({ email: sess.email }, (err, doc) => {
      if (passwordHash.verify(req.body.old, doc[0].pass)) {
        //check if the two passwords match
        if (req.body.new == req.body.renew) {
          var hashpwd = passwordHash.generate(pass);
          usermodel.findOneAndUpdate({ email: sess.email }, { $set: { pass: hashpwd } }, (err, doc) => {
            if (err) console.log(err);
            res.json(1);
          });
        } else res.json(-1);
      } else res.json(0);
    });
  })

routes.route('/setBank')
  .post(urlencodedParser, (req, res) => {
    var bank = req.body.bank;

  })

// confirmation to view banklist...only admin and fintech can view banklists, not the bankadmin
routes.route('/getConfirmation')
  .get((req, res) => {
    var sess = req.session;
    if (sess.email) {
      usermodel.find({ email: sess.email }, (err, doc) => {
        if (doc.length) {
          if (doc[0].confirmation)
            res.json(1);
          else res.json(0);
        } else { //this is a bank. so send 0
          res.json(0);
        }

      })
    }else if (sess.bank) {
      res.json(1);
    }else { res.json(0) }

  })

routes.route('/checklogin')
  .get((req, res) => {
    var sess = req.session;

    console.log("414: " + sess.email);
    if (sess.email) {
      //change the adminmodel to usermodel.
      if (sess.fintech) {
        console.log("fintech here");
        usermodel.find({ email: sess.email }, (err, doc) => {
          res.json(doc[0].fname);
        })
      } else if (sess.admin) {
        console.log("Regulatory board admin here");
        usermodel.find({ email: sess.email }, (err, doc) => {
          res.json(doc[0].fname);
        })
      }
      else if (sess.bank) {
        console.log("bank here");
        bankmodel.find({ email: sess.email }, (err, doc) => {
          res.json(doc[0].bankname);
        })
      }
      else { res.json(0); }
    }

    else { res.json(0); }
  })

routes.route('/logout')
  .get((req, res) => {
    req.session.destroy();
    res.json('session destroyed');
  })

routes.route('/revoke')
  .post(urlencodedParser, (req, res) => {
    partner.findOneAndUpdate({ org: req.body.org }, { active: false }, { new: true }, (err, doc) => { });

    res.json("partner revoked from bank conncet client");
  })

routes.route('/showFileForm')
  .get((req, res) => {
    res.sendFile(path.join(__dirname, 'fileupload.html'));
  })

routes.route('/getPartnerDetails')
  .get((req, res) => {
    var sess = req.session;

    partner.find({ email: sess.email }, (err, doc) => {
      res.json(doc[0]);
    })
  })

routes.route('/showFileFormMail/:email/:org')
  .get((req, res) => {
    var sess = req.session;
    sess.email = req.params.email;
    sess.org = req.params.org;

    res.sendFile(path.join(__dirname, 'fileupload.html'));
  })


routes.route('/getFilesClient')
  .post(urlencodedParser, (req, res) => {
    //get the files of the client
    var email = req.body.email;

    files.find({ email: email }, (err, doc) => {
      console.log("no of docs: " + doc.length);
      if (doc.length) {
        var fileArray = [];
        //for loop not working
        for (var i = 0; i < doc.length; ++i) {
          fileArray.push(doc[i].file);
        }
        var myObj = {
          files: fileArray,
          email: req.body.email
        }

        res.json(myObj);
      } else {
        res.json("no files uploaded");
      }
    })
  })

routes.route('/subscribeApi')
  .post(urlencodedParser, (req, res) => {
    var sess = req.session;

    var api = req.body.api;
    var bank = req.body.bank;

    subapi.find({ email: sess.email, bank: bank }, (err, doc) => {
      //get all the current apis from that bank
      if (doc.length == 0) {

        var newsubapi = new subapi({
          email: sess.email,
          bank: bank,
          apis: api
        });
        newsubapi.save();

      } else {
        var oldapis = [];
        oldapis = doc[0].apis;
        oldapis.push(api);

        subapi.findOneAndUpdate({ email: sess.email, bank: bank }, { $set: { apis: oldapis } }, { new: true }, (err, doc) => {
          // the api list is updated
          if(err) console.log(err);
        });
      }

    })

    res.json("api has been subscribed");
  })

  .get((req, res) => {
    var sess = req.session;

    subapi.find({ email: sess.email }, (err, doc) => {
      res.json(doc);
    })
  })

//    ************************************************************************************

//    ==============================END OF ROUTING =======================================

//    ************************************************************************************

function sendmail(email, ts) {
  var link = `http://ibm.bankconnect:5000/route/confirm/${ts}/${email}`;
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      // user: process.env.GMAIL_USER,
      // pass: process.env.GMAIL_PASS
      user: 'ibm.bankconnect@gmail.com',
      pass: 'Modified@2017'
    }
  });

  var mailOptions = {
    from: 'ibm.bankconnect@gmail.com',
    to: `${email}`,
    subject: 'Email confirmation for Bank Connect',
    text: 'That was easy!',
    html: `${link}`
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

function sendmail_bank(email, ts, bankname) {
  var link = `http://ibm.bankconnect:5000/route/bank_confirm/${ts}/${email}`;
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      // user: process.env.GMAIL_USER,
      // pass: process.env.GMAIL_PASS
      user: 'ibm.bankconnect@gmail.com',
      pass: 'Modified@2017'
    }
  });

  readHTMLFile(path.join(__dirname, '../views/bankconnect-email-confirmation-for-bank.html'), function (err, html) {
    var template = handlebars.compile(html);
    var replacements = {
      bankname: `${bankname}`,
      link: `${link}`
    };
    var htmlToSend = template(replacements);
    var mailOptions = {
      from: 'ibm.bankconnect@gmail.com',
      to: `${email}`,
      subject: 'Email confirmation for Bank Connect',
      text: 'That was easy!',
      html: htmlToSend
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  });
}

function sendmailtopartner(pemail, org) {

  var link = `http://ibm.bankconnect:5000/route/showFileFormMail/${pemail}/${org}`;
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'ibm.bankconnect@gmail.com',
      pass: 'Modified@2017'
    }
  });

  readHTMLFile(path.join(__dirname, '../views/bankconnect-partner-approval.html'), function (err, html) {
    var template = handlebars.compile(html);
    var replacements = {
      orgname: `${org}`,
      link: `${link}`
    }
    var htmlToSend = template(replacements);
    var mailOptions = {
      from: 'ibm.bankconnect@gmail.com',
      to: `${pemail}`,
      subject: 'Approval from Bank Connect Admin',
      text: 'That was easy!',
      html: htmlToSend
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  });
}

module.exports = routes;
