const express  = require('express');
const path = require('path');
const cors= require('cors');
const port = 3000;


const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/test")

const app = express();
app.get('/' , function (req, res) {
    res.sendFile (path.resolve(__dirname,'public', "index.html"));
})

app.use(express.static(path.join(__dirname,'public')));
app.use(express.json());
app.use(cors);

app.listen(port, ()=>{
    console.log('listening on port  '+port);
})
