var request = require('request');

var options = {
    url: 'https://script.google.com/macros/s/AKfycbwRlOYLco6-8ceIYUtFFkBBXbUK7rpJtT_HpGIyNQlB6lrxVcU/exec?text=' + encodeURI("日本語") + '&source=ja&target=en'
};

function callback(error, response, body) {
    console.log("aa");
    if (!error && response.statusCode == 200) {
        console.log(body);
    }
    else {
        console.log("Error");
    }
}

request(options, callback);
