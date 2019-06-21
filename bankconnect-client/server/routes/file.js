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
    console.log(req.files);
    res.json("files recieved");
})

//files.route('/upload')
// .post(multipartMiddleware,(req,res)=>{
//     console.log("entered here!");
//     var sess = req.session;

//     var dirpath = path.join(__dirname,'uploads');
//     var recentfile,newtime;

//     fs.readdir(dirpath, function(err, items){
//         for (var i=0; i<items.length; i++) {
//             if(i==0){
//                 recentfile = path.join(__dirname,'uploads',items[i]);
//                 newtime = fs.statSync(dirpath + "/" + items[0]).ctime.getTime();
//             }else{
//                 if(fs.statSync(dirpath + "/" + items[i]).ctime.getTime() > newtime ){
//                     newtime = fs.statSync(dirpath + "/" + items[i]).ctime.getTime();
//                     recentfile = path.join(__dirname,'uploads',items[i]);
//                 }   
//             }
//         }

//         //converting the recent file to base64 format
//         var b64 = new Buffer(fs.readFileSync(recentfile)).toString("base64");

//         //now use the newb64path to upload the file into the database
//         MongoClient.connect('mongodb://localhost:27017/bcclient',{ useNewUrlParser: true },(err,client)=>{
//             if(err){ 
//                 console.log("Please check you db connection parameters");
//               }else{
//                 var db = client.db('bcclient');
//                 var collection = db.collection('files');
//                 collection.insertOne({user:sess.user,file:b64},(err,res)=>{
//                     if(err) console.log("error while inserting in db: "+err);
//                 })
//               }
//         })

//         //displaying the base64 in the jpg format
//         fs.writeFile(path.join(__dirname,'demo.jpg'),new Buffer(b64,"base64"),(err)=>{});
//     });

//     // var sub = "Bank Connect Client";
//     // var msg = `<p> Hello Business Manager. ${sess.org} has uploaded the necessary documents. Please Validate it.</p>`;
//     // var link = `http://localhost:3000/docs/${sess.user}/${sess.org}`;
//     // sendmail(sub,msg,link);

//     // res.json({
//     //     'message': 'File uploaded successfully'
//     // });

//     res.redirect('/banklist');
// });

module.exports = files;