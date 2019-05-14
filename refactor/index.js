const express = require('express');
const app = express();
const http = require('http').Server(app);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

http.listen(process.env.PORT || 3000, () => {
    console.log('listening on *:3000...');
});
