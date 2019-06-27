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

// models--------------------

var partner = require('../models/partnermodel');

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
            }
        })

        //add the request to the bank connect.
        MongoClient.connect('mongodb://localhost:27017/idbp',{ useNewUrlParser: true },(err,client)=>{
            if(err){ 
                console.log("Please check you db connection parameters");
            }else{
                var db = client.db('idbp');
                var collection = db.collection('requests');
                console.log(sess.org);
                collection.insertOne({email:sess.email,org:sess.org,via:"client"},(err,res)=>{
                    if(err) console.log("error while inserting file in db: "+err);
                })
            }
        })
    });

    res.redirect('/login');
})

module.exports = files;