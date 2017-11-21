const express = require('express');
const app = express();
const os = require("os");
const port = 1337;

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/api', (req, res) => res.send(`{"message":"Connection with API succeeded! Connected to node ${os.hostname()}"}`));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));