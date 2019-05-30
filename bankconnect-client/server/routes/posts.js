var express = require('express');
var router = express.Router();
var axios = require('axios');

var postAPI = 'https://jsonplaceholder.typicode.com'

router.get('/',(req,res)=>{
    console.log("entered at posts route");
    axios.get(`${postAPI}`).then(posts =>{
        console.log(posts.data);
        res.status(200).json(posts.data);
    })
    .catch(err =>{
        res.status(500).send(err);
    })
})

module.exports = router; 