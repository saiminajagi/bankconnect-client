var express = require('express');
var nodemailer = require('nodemailer');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passwordHash = require('password-hash');
var  multipart  =  require('connect-multiparty');
var  multipartMiddleware  =  multipart({ uploadDir:  path.join(__dirname,'uploads') });
var fs = require('fs');
var multer = require('multer');
var handlebars = require('handlebars');

// to read html file
var readHTMLFile = function(path, callback) {
	fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
		if (err) {
			throw err;
			callback(err);
		}
		else {
			callback(null, html);
		}
	});
  };

// models--------------------

var partner = require('../models/partnermodel');
var usermodel = require('../models/usermodel');
var docs = require('../models/docs');

var storage = multer.diskStorage({
	destination:function(req,file,cb){
		cb(null,path.join(__dirname,'uploads'))
	},
	filename: function(req,file,cb){
		cb(null,Date.now() + file.originalname);
	}
});
var upload = multer({ storage:storage });

var MongoClient = require('mongodb').MongoClient;

var files = express.Router();

var urlencodedParser = bodyParser.urlencoded({extended: true});
files.use(bodyParser.json());
files.use(bodyParser.urlencoded({extended:true}));

var sess;

files.route('/upload')
.post(upload.any(),(req,res)=>{
    var sess = req.session;
    var files_array = [];
    partner.findOneAndUpdate({email:sess.email},{files:true},{new:true},(err,doc)=>{});
    usermodel.findOneAndUpdate({ email: sess.email }, { confirmation: true }, { new: true }, (err, doc) => { });
    //convert the files to b64 format and store it in db
    var dirpath = path.join(__dirname,'uploads');
    fs.readdir(dirpath, function(err, items){
        for (var i=0; i<items.length; i++) {
            recentfile = path.join(__dirname,'uploads',items[i]);
            var b64 = new Buffer(fs.readFileSync(recentfile)).toString("base64");

            files_array.push(b64);
            //this delets the file
            fs.unlinkSync(recentfile);
        }

        MongoClient.connect('mongodb://localhost:27017/bcclient',{ useNewUrlParser: true },(err,client)=>{
            if(err){
                console.log("Please check you db connection parameters");
            }else{
                var db = client.db('bcclient');
                var collection = db.collection('files');
                collection.insertOne({email:sess.email,file:files_array[0]},(err,res)=>{
                    if(err) console.log("error while inserting file in db: "+err);
                })
            }
        })

        MongoClient.connect('mongodb://localhost:27017/bcclient',{ useNewUrlParser: true },(err,client)=>{
            if(err){
                console.log("Please check you db connection parameters");
            }else{
                var db = client.db('bcclient');
                var collection = db.collection('files');
                collection.insertOne({email:sess.email,file:files_array[1]},(err,res)=>{
                    if(err) console.log("error while inserting file in db: "+err);
                })

                //add him to pending docs as well
                var collection = db.collection('docs');
                //sess.org is not being stored
                collection.insertOne({email:sess.email,org: sess.org},(err,res)=>{
                    if(err) console.log("error while inserting pending docs: "+err);
                })
            }
        })

        //add this to pending docs as well
    });

    res.redirect('/login');
})

files.route('/acceptdoc')
	.post((req, res) => {
		//accept the doc so add him to the partner
		var sess = req.session;

		var email = sess.docemail;
		var org = sess.docorg;

		//delete the request from pending docs
		docs.findOneAndDelete({ email: sess.docemail }, (err, doc) => {
			//do nothing
		});
        //copy the token from usermodel to partner model
        usermodel.find({email: sess.docemail},(err,doc)=>{

            var newpartner = new partner({
                org: org,
                email: email,
                active: true,
                files: true,
                token: doc[0].token
            });

            newpartner.save();

            //send a mail saying that he has been onboarded succesfully
            var sub = "IDBP Partner Portal";
            var bankname = `${sess.bank}`
            var msg = `<p> Hello partner! you have successfully onboarded as a partner by BANK CONNECT</p>`;
            var pemail = sess.docemail;
            sendRequestMailAccept(pemail, sub, bankname, msg, doc[0].token);

        })

		res.redirect('/profile');
	});

files.route('/declinedoc')
    .post((req, res) => {
        var sess = req.session;

        var email = sess.docemail;
        docs.findOneAndDelete({ email: sess.docemail }, (err, doc) => {
            //do nothing
        });

        //send a mail saying that his request to onboard has been rejected.

        res.redirect('/profile');
    })

function sendRequestMailAccept(email, sub, bankname, msg, token) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            // user: process.env.GMAIL_USER,
            // pass: process.env.GMAIL_PASS
            user: 'ibm.idbp@gmail.com',
            pass: 'Modified@2017'
        }
    });

    readHTMLFile(path.join(__dirname, '../views/idbppartner-final-onboard-msg.html'), function (err, html) {
        var template = handlebars.compile(html);
        var replacements = {
            bankname: `${bankname}`,
            link: `${msg}`,
            token : `${token}`
        }
        var htmlToSend = template(replacements);
        var mailOptions = {
            from: 'ibm.idbp@gmail.com',
            to: `${email}`,
            subject: `${sub}`,
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

module.exports = files;
