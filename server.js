/*

To test:
Open two browsers at http://localhost:3000/assignment3.html

//collaboration with Socket IO

*/

var puck;



//Cntl+C to stop server
const app = require('http').createServer(handler)
const io = require('socket.io')(app) //wrap server app in socket io capability
const fs = require("fs") //need to read static files
const url = require("url") //to parse url strings
const PORT = process.env.PORT || 3000

app.listen(PORT) //start server listening on PORT



const ROOT_DIR = "html"; //dir to serve static files from

const MIME_TYPES = {
  css: "text/css",
  gif: "image/gif",
  htm: "text/html",
  html: "text/html",
  ico: "image/x-icon",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  js: "application/javascript",
  json: "application/json",
  png: "image/png",
  txt: "text/plain"
}

function get_mime(filename) {
  var ext, type;
  for (let ext in MIME_TYPES) {
    type = MIME_TYPES[ext]
    if (filename.indexOf(ext, filename.length - ext.length) !== -1) {
      return type
    }
  }
  return MIME_TYPES["txt"]
}

io.on('connection', function(socket){

  socket.on('paddleData1', function(data1){
    //console.log('RECEIVED BOX DATA: ' + data)
    //to broadcast message to everyone including sender:
    io.emit('paddleData1', data1) //broadcast to everyone including sender
  });

    socket.on('paddleData2', function(data5){
        //console.log('RECEIVED BOX DATA: ' + data)
        //to broadcast message to everyone including sender:
        io.emit('paddleData2', data5) //broadcast to everyone including sender
    });


  socket.on('puckData', function (data2) {
    console.log('RECEIVED Ball DATA: ' + data2)

      var puck = JSON.parse(data2);
      //if (puckData.ps >0) {

      /*if (puck.x + 15 >= 1000)
          puck.xDirection = -1;
      if (puck.x - 15 <= 0) puck.xDirection = 1;
      if (puck.y + 15 >= 600) puck.yDirection = -1;
      if (puck.y - 15 <= 0)
          puck.yDirection = 1;
      //if (puck.ps >= 0) puck.ps -= 0.1;
      //puck.x = puck.x + puck.ps * puck.xDirection;
      //puck.y = puck.y + puck.ps * puck.yDirection;
      */
      //puck.x ++ ;
      //puck.y ++;

      if(puck.ps>0){
          puck.x = puck.x + puck.ps * puck.xd;
          puck.y = puck.y + puck.ps * puck.yd;
      }

      if (puck.x + 20 >= 1000)
      puck.xd = -1;
      if (puck.x - 20 <= 0) puck.xd = 1;
      if (puck.y + 20 >= 600) puck.yd = -1;
      if (puck.y - 20 <= 0)
      puck.yd = 1;

      console.log("x:" + puck.x);
      console.log("y:" + puck.y);
  //}


  var jsonString = JSON.stringify(puck);
  io.emit('puckData', jsonString);
    //console.log('RECEIVED Ball DATA: ' + data)

});
socket.on('user1Data', function (data3) {
    io.emit('user1Data', data3);
});
socket.on('user2Data', function (data4) {
    io.emit('user2Data', data4);
});

});

function handler(request, response) {
var urlObj = url.parse(request.url, true, false);
console.log("\n============================");
console.log("PATHNAME: " + urlObj.pathname);
console.log("REQUEST: " + ROOT_DIR + urlObj.pathname);
console.log("METHOD: " + request.method);

var receivedData = "";

//attached event handlers to collect the message data
request.on("data", function(chunk) {
  receivedData += chunk;
});

//event handler for the end of the message
request.on("end", function() {
  console.log("REQUEST END: ");
  console.log("received data: ", receivedData);
  console.log("type: ", typeof receivedData);

  //if it is a POST request then echo back the data.
  /*
    A post message will be interpreted as either a request for
    the location of the moving box, or the location of the moving box
    being set by a client.
    If the .x and .y attributes are >= 0
    treat it as setting the location of the moving box.
    If the .x and .y attributes are < 0 treat it as a request (poll)
    for the location of the moving box.
    In either case echo back the location of the moving box to whatever client
    sent the post request.

    Can you think of a nicer API than using the numeric value of .x and .y
    to indicate a set vs. get of the moving box location.
    */
      if (request.method == "POST") {
        /*
        var dataObj = JSON.parse(receivedData);
        if (dataObj.x >= 0 && dataObj.y >= 0) {
          //Here a client is providing a new location for the moving box
          //capture location of moving box from client
          movingBoxLocation = JSON.parse(receivedData);
          console.log("received data object: ", movingBoxLocation);
          console.log("type: ", typeof movingBoxLocation);
        }
        //echo back the location of the moving box to who ever
        //sent the POST message
        response.writeHead(200, { "Content-Type": MIME_TYPES["json"] });
        response.end(JSON.stringify(movingBoxLocation)); //send just the JSON object
        */
      }

      if (request.method == "GET") {
        //handle GET requests as static file requests
        fs.readFile(ROOT_DIR + urlObj.pathname, function(err, data) {
          if (err) {
            //report error to console
            console.log("ERROR: " + JSON.stringify(err))
            //respond with not found 404 to client
            response.writeHead(404)
            response.end(JSON.stringify(err))
            return
          }
          response.writeHead(200, {
            "Content-Type": get_mime(urlObj.pathname)
          })
          response.end(data)
        })
      }
    })
  }

console.log("Server Running at PORT 3000 CNTL-C to quit");
