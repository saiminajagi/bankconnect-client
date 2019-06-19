var express = require('express');
var path = require('path');
var session = require('express-session');
var usermodel = require('./models/usermodel');

var routes = require('./routes/routes');
var posts = require('./routes/posts');
var files = require('./routes/file');

var mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/bcclient',{useNewUrlParser: true},(err,db)=>{

    if(err) console.log(err);
    else console.log("connection to db success");
});


var app = express();
app.use(express.static(path.join(__dirname,'..','dist','bankconnect-client')));

app.use(session({secret : 'bcClientSecret',saveUninitialized: true,resave: true}));

//allowing cross origin requests.
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*'); //(instead of *) == http://localhost:3000 if only this should have access.
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type,Accept,Authorization"
    );
    if(req.mehtod === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});
app.use('/route',routes);
app.use('/posts',posts);
app.use('/file',files);

app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'../dist/bankconnect-client/index.html'));
});

setInterval(() => {
    var date = new Date();
    var cts = date.getTime(); //current time stamp.
    //console.log(cts);

    usermodel.find({},(err,doc)=>{
        var len = doc.length;

        for(i=0;i<len;++i){
            //convert the variable to int .
            if(doc[i].ts != "expired"){
                var ts = parseInt(doc[i].ts);
                if(cts - ts >= 86400000){
                    //if the time is more than a day.
                    usermodel.findOneAndUpdate({ts: ts},{$set : {ts : "expired"}},{new : true});
                }
            }
        }
    });
}, 12000);


app.listen(5000);
console.log("listening to port 5000");
