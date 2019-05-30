var express = require('express');
var path = require('path');
var app = express();

var posts = require('./routes/posts');
var routes = require('./routes/routes');

app.use(express.static(path.join(__dirname,'..','dist','bankConnect')));
app.use('/posts',posts);
//app.use('/',routes);

app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'../dist/bankConnect/index.html'));
})

app.listen(5000,()=>{
    console.log("listening to 5000");
});