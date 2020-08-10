var PORT = process.env.PORT || 80;
let express = require('express');
var request = require('request');
let app = express();
let server = app.listen(PORT)

app.use(express.static('public'));

console.log("Socket server is running. localhost:" + PORT)

let socket = require('socket.io');
let io = socket(server);


io.sockets.on('connection', newConnection);

function newConnection(socket) {
    console.log('connection:', socket.id);

    socket.on('translate', translate)
    function translate(data) {
        var url = 'https://script.google.com/macros/s/AKfycbwRlOYLco6-8ceIYUtFFkBBXbUK7rpJtT_HpGIyNQlB6lrxVcU/exec';
        url += '?text=' + data.text + '&source=' + data.source + '&target=' + data.target;
        var options = {
            url: url
        };
        console.log(url);
        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                socket.emit('translated', body);
            }
            else {
                console.log("Error " + response.statusCode);
            }
        }
        request(options, callback);
    }
}

