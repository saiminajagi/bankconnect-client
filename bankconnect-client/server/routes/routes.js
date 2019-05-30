var express = require('express');
var nodemailer = require('nodemailer');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var axios = require('axios');


var usermodel = require('../models/usermodel');
var cbsmodel = require('../models/cbsmodel');
var apimodel = require('../models/apimodel');

var routes = express.Router();

var urlencodedParser = bodyParser.urlencoded({extended: true});
routes.use(bodyParser.json());

var sess;

routes.get('/',(req,res)=>{
})

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

routes.route('/corebankservices/register')
.get((req,res)=>{
    var sess = req.session;
//retrieve the versions, integration option based on the cbs.

    cbsmodel.find({},(err,doc)=>{
        var obj = {
            fin : [],
            tcs : [],
            flex : []
        }
        for(i=0; i< doc.length;++i){
            if(doc[i].name == "Finnacle"){
                obj.fin = doc[i].versions;
            }else if(doc[i].name == "TCS Bancs"){
                obj.tcs = doc[i].versions;
            }else if(doc[i].name == "Flexcube"){
                obj.flex = doc[i].versions;
            }
        }
        //console.log("versions: "+obj);
        res.json(obj);
    })
})

//to show the connecting with finnacle message and browse api's option.
.post(urlencodedParser,(req,res)=>{

    var cbs = req.body.cbs;
    var version = req.body.version;
    var intopt = req.body.intopt;
    var sip = req.body.sip;
    var cred = req.body.cred;

    var sess = req.session;

    console.log(sess.email);
    console.log("cbs details: "+cbs+" "+version+" "+intopt+" "+sip+" "+cred);
    // use $set to update a single field
    usermodel.findOneAndUpdate({ email : sess.email }, {cbs : cbs, version : version, intopt : intopt, sip: sip, cred:cred},{new : true},(err,doc)=>{
            if(err) console.log(err);
        });

    res.json("updated details");
});

routes.route('/api')
.get((req,res)=>{

    var sess = req.session;
    global.apis=[];

    //get the apis based on the users cbs and version.
    usermodel.find({email : sess.email },(err,doc)=>{
        //only 1 document will be returned.
        var cbs = doc[0].cbs;
        var ver = doc[0].version;

        apimodel.find({cbs : cbs},(err,doc)=>{
            if(err) console.log(err);

            var len = doc.length; var i=0;

            for(i=0;i<len;++i){
                global.apis.push(doc[i].name);
            }

            console.log(global.apis);
            res.json(global.apis);
        });
    });

})

.post(urlencodedParser,(req,res)=>{
    //add the chosen apis in the user models.
    var apis = req.body.apis;
    var api_arr = [];
    var sess = req.session;

    //console.log(apis);

    usermodel.findOneAndUpdate({email : sess.email},{api_list : apis},(err,doc)=>{
        if(err) console.log(err);
    });

    res.json("Services published successfully");
});

routes.route('/api/selected')
.get((req,res)=>{

    console.log("entered here");
    var sess = req.session;
    global.apis=[];

    //get the apis based on the users cbs and version.
    usermodel.find({email : sess.email },(err,doc)=>{
        //only 1 document will be returned.
        //directly get the api_list
        console.log("selected apis: "+ doc[0].api_list);
        var selected_api = doc[0].api_list;

        res.json(selected_api);
    });
});

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

module.exports = routes;
