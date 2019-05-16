const express = require('express');
const app = express();
const http = require('http').Server(app);

// Import files
app.use('/css', express.static(__dirname + '/css'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

http.listen(process.env.PORT || 3000, () => {
    console.log('listening on *:3000...');
});
