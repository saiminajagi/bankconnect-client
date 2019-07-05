var express = require('express');
var path = require('path');
var session = require('express-session');
var axios = require('axios');

var usermodel = require('./models/usermodel');
var banks = require('./models/bankmodel');
var transaction = require('./models/transaction');

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
app.use(express.static(path.join(__dirname,'routes','docs')));

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
app.use('/files',files);

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

setTimeout(() => {
    //here we have just the port number to recognise the bank but we need complete url later.
    //var url = `http://idbpportal.bank.com:${doc[i].sport}/route/getTransactions`;
    var url = `http://idbpportal.bank.com:3000/route/getTransactions`;
    axios.get(`${url}`)
    .then(resp => {
        var data = resp.data.transactions; //it is an array of transactions of bank and orgs.
        runLoop(data);
    })
    .catch(err => {
        console.log(err);
    })

}, 30000)

/* to refer more about aync & await visit : https://www.geeksforgeeks.org/using-async-await-in-node-js/  */

//first declare the function which you want to run synchronously as 'async'.
//inside the function declare the part as 'await' which you want to complete before you go to next loop. 
runLoop = async (transactions)=>{
    for(var tran of transactions){
        //check whether the transation already exists
        //before we go to next loop we want this function to complete its execution.
        await transaction.find({ $and: [{ bank: tran.bank }, { org: tran.org }] }, (err, doc) => {
            if(doc.length){
                transaction.findOneAndUpdate({ $and: [{ bank: tran.bank }, { org: tran.org }] },{hits: tran.hits, success: tran.success, fail: tran.fail},{new: true},(err,doc)=>{
                })
            }else{
                var newtransaction = new transaction({
                    bank: tran.bank,
                    org: tran.org,
                    hits: tran.hits,
                    success: tran.success,
                    fail: tran.fail
                });
                newtransaction.save();
            }
        })
        
    }
}

    
app.listen(5000);
console.log("listening to port 5000");
