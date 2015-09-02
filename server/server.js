var express = require('express');

app = express();

// NOTE: still don't fully understand the necessity of `__dirname` and how it's used
app.use(express.static(__dirname + '/../build'));
console.log("server called");


module.exports = app;
