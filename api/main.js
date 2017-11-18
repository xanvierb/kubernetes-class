const express = require('express');
const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/api', (req, res) => res.send('{"message":"Connection with API succeeded!"}'));

app.listen(1337, () => console.log('Example app listening on port 1337!'));