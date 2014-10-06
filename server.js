//var http = require('http');
//
////The url we want is: 'www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
//var options = {
//    host: 'http://challenge2.airtime.com',
//    port: 2323
//};
//
//callback = function(response) {
//    var str = '';
//    console.log("response")
//
//    //another chunk of data has been recieved, so append it to `str`
//    response.on('data', function (chunk) {
//        str += chunk;
//    });
//
//    //the whole response has been recieved, so we just print it out here
//    response.on('end', function () {
//        console.log(str);
//    });
//
//    response.on('error', function () {
//        console.log(str);
//    });
//}
//
//console.log("zzzz")
//
//
//var req = http.request(options, function(res) {
//    console.log('STATUS: ' + res.statusCode);
//    console.log('HEADERS: ' + JSON.stringify(res.headers));
//    res.setEncoding('utf8');
//    res.on('data', function (chunk) {
//        console.log('BODY: ' + chunk);
//    });
//});
//
//req.on('error', function(e) {
//    console.log('problem with request: ' + e.message);
//});
//
//// write data to request body
////req.write('data\n');
////req.write('data\n');
//req.end();
//
//
////console.log(req)

var nc = require("node-cat");

var client = nc.createClient("http://challenge2.airtime.com", 2323);

client.start(
    function(client /* the tcp client returned by net.connect */, rl /* readline instance */, stdin, stdout){
        client.write("STATUS: None of your business");
        stdout.write("Sent status.");
    });