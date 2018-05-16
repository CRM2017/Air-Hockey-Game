/*

Javasript to handle mouse dragging and release
to drag a string around the html canvas
Keyboard arrow keys are used to move a moving box around
(The mouse co-ordinates are wrong if the canvas is scrolled with scroll bars.
 Exercise: can you fix this?)

Here we are doing all the work with javascript and jQuery. (none of the words
are HTML, or DOM, elements. The only DOM element is just the canvas on which
where are drawing.

This example shows examples of using JQuery
JQuery syntax:
$(selector).action();
e.g.
$(this).hide() - hides the current element.
$("p").hide() - hides all <p> elements.
$(".test").hide() - hides all elements with class="test".
$("#test").hide() - hides the element with id="test".

Mouse event handlers are being added and removed using jQuery and
a jQuery event object is being passed to the handlers

Keyboard keyDown handler is being used to move a "moving box" around

Notice in the .html source file there are no pre-attached handlers.
*/
var canvas = document.getElementById("canvas1"); //our drawing canvas

var puckSpeed = 0
var timer; //used to control the free moving word
var fontPointSize = 14; //point size for word text
var editorFont = "Arial"; //font for your editor
var user1data = {name:"Player Name: ", mark:0,nameX: 0.25*canvas.width, nameY:50, markX:0.25*canvas.width, markY:70, buttonEnabled:true,quitButtonEnabled:false };
var user2data = {name:"Player Name: ", mark:0,nameX: 0.75*canvas.width, nameY:50,markX:0.75*canvas.width, markY:70,buttonEnabled:true, quitButtonEnabled:false };
var browser = {b1:false, b2:false};

var puck = {
    x:canvas.width/2,
    y:canvas.height/2,
    t1 : canvas.width/2,
    t2 : canvas.height/2,
    xDirection: 1,
    yDirection: 1,
    r:  20, //radius
    startAngle:  0, //start angle
    endAngle:  2 * Math.PI //end angle
};

//intended for keyboard control
var paddle1 = {
  x: 50,
  y: canvas.height/2,
  r:50,
  width: 10,
  height: 70
};

var paddle2 = {
    x: canvas.width-50,
    y: canvas.height/2,
    r:50,
    width: 10,
    height: 70
};





var drawCanvas = function() {
  var context = canvas.getContext("2d");

  context.fillStyle = "white";
  context.fillRect(0, 0, canvas.width, canvas.height); //erase canvas

  context.font = "" + fontPointSize + "pt " + editorFont;
  context.lineWidth = 1;
  context.fillStyle = "red";
  context.fillText(user1data.name,user1data.nameX,user1data.nameY);
  //context.strokeText(user1data.name,user1data.nameX,user1data.nameY);
  context.fillText(user2data.name,user2data.nameX,user2data.nameY);
  //context.strokeText(user2data.name,user2data.nameX,user2data.nameY);

  context.fillText(user1data.mark,user1data.markX,user1data.markY);
 // context.strokeText(user1data.mark,user1data.markX,user1data.markY);
  context.fillText(user2data.mark,user2data.markX,user2data.markY);
  //context.strokeText(user2data.mark,user2data.markX,user2data.markY);

    //draw layout
    context.strokeStyle = "skyBlue";
    context.lineWidth = 5;
    context.beginPath();
    context.arc(
        0, //x co-ord
        canvas.height/2, //y co-ord
        canvas.height/6, //radius
        -0.5 * Math.PI, //start angle
        0.5 * Math.PI //end angle
    );
    context.stroke();
    context.beginPath();
    context.arc(
        canvas.width, //x co-ord
        canvas.height/2, //y co-ord
        canvas.height/6, //radius
        0.5 * Math.PI, //start angle
        1.5 * Math.PI //end angle
    );
    context.stroke();

    //draw line
    context.beginPath();
    context.moveTo(canvas.width/2, 0);//set start point
    context.lineTo(canvas.width/2, canvas.height);//set end point
    context.stroke();




  //draw paddles
    if(user1data.buttonEnabled == false) {
      context.beginPath();
      context.arc(paddle1.x, paddle1.y, paddle1.r,0,Math.PI*2, true);
      context.fillStyle = "blue";
      context.fill();
    }
    else{
      context.beginPath();
      context.arc(paddle1.x, paddle1.y, paddle1.r,0,Math.PI*2, true);
      context.stroke();
    }
    if(user2data.buttonEnabled == false) {
        context.beginPath();
        context.arc(paddle2.x, paddle2.y, paddle2.r,0,Math.PI*2, true);
        context.fillStyle = "blue";
        context.fill();
    }
    else{
        context.beginPath();
        context.arc(paddle2.x, paddle2.y, paddle2.r,0,Math.PI*2, true);
        context.stroke();
    }



    //draw puck
    context.beginPath();
    context.arc(
        puck.x, //x co-ord
        puck.y, //y co-ord
        puck.r, //radius
        puck.startAngle, //start angle
        puck.endAngle * Math.PI //end angle
    );

    context.fillStyle = "black";
    context.fill();





  //buttons
    if(user1data.buttonEnabled == false){
        $('#user1Button').attr("disabled", true);
        $('#user1QuitButton').attr("disabled", false);
    }
    else{
      $('#user1Button').attr("disabled", false);
      $('#user1QuitButton').attr("disabled", true);
    }
    if(user2data.buttonEnabled == false){
        $('#user2Button').attr("disabled", true);
        $('#user2QuitButton').attr("disabled", false);
    }
    else{
      $('#user2Button').attr("disabled", false);
      $('#user2QuitButton').attr("disabled", true);

    }

};


function resetLocation() {
    puck.x = canvas.width/2;
    puck.y = canvas.height/2;
    puckSpeed = 0;
    paddle1.x = 50;
    paddle1.y = canvas.height/2;
    paddle2.x = canvas.width - 50;
    paddle2.y = canvas.height/2;

    var dataObj1 = { x: paddle1.x, y: paddle1.y};
    var jsonString1 = JSON.stringify(dataObj1);
    socket.emit('paddleData1', jsonString1);

    var dataObj2 = { x: paddle2.x, y:paddle2.y };
    var jsonString2 = JSON.stringify(dataObj2);
    socket.emit('paddleData2', jsonString2);

    updateUser();
}
//JQuery Ready function -called when HTML has been parsed and DOM
//created
//can also be just $(function(){...});
//much JQuery code will go in here because the DOM will have been loaded by the time
//this runs

function handleTimer() {

    if (puck.x - puck.r <= 0 && puck.y > (1/3)*canvas.height &&  puck.y < (2/3)*canvas.height){
        user2data.mark++;
        resetLocation();
    }
    if (puck.x + puck.r >= canvas.width && puck.y > (1/3)*canvas.height &&  puck.y < (2/3)*canvas.height){
        user1data.mark++;
        resetLocation();
    }

    /*if (puckSpeed >0 ){
        puck.x = puck.x + puckSpeed * puck.xDirection;
        puck.y = puck.y + puckSpeed * puck.yDirection;
    }*/

    var dx1 = Math.abs(puck.x - paddle1.x);
    var dy1 = Math.abs(puck.y - paddle1.y);
    var dx2 = Math.abs(puck.x - paddle2.x);
    var dy2 = Math.abs(puck.y - paddle2.y);

    dist1 = Math.sqrt(dx1*dx1 + dy1*dy1);
    dist2 = Math.sqrt(dx2*dx2 + dy2*dy2);


    if (dist1 <= puck.r + paddle1.r || dist2 <= puck.r + paddle2.r){
        puck.xDirection = -1 * puck.xDirection;
        puck.yDirection = -1 * puck.yDirection;
        puckSpeed = 20;
    }
    console.log("data: " + puck.x);
    console.log("data: " + puck.y);
    //keep moving puck within bounds of canvas
    /*if (puck.x + puck.r >= canvas.width)
        puck.xDirection = -1;
    if (puck.x-puck.r <= 0) puck.xDirection = 1;
    if (puck.y+ puck.r >= canvas.height) puck.yDirection = -1;
    if (puck.y - puck.r <= 0)
        puck.yDirection = 1;*/
    if (puckSpeed >= 0) puckSpeed -= 0.2;

    var puckDataObj = {x:puck.x, y: puck.y,ps:puckSpeed, xd:puck.xDirection,yd:puck.yDirection};
    var puckJasonString = JSON.stringify(puckDataObj);
    socket.emit('puckData', puckJasonString);


    //console.log("data: " + puckJasonString);
    drawCanvas();

}

//KEY CODES
//should clean up these hard coded key codes
var RIGHT_ARROW = 39;
var LEFT_ARROW = 37;
var UP_ARROW = 38;
var DOWN_ARROW = 40;



function handleKeyDown(e) {
  console.log("keydown code = " + e.which);

  // set paddle can be moved only when both players are ready
    if(user1data.buttonEnabled == false && user2data.buttonEnabled == false){
        //paddle 1
        var paddleSpeed = 10; //amount to move in both X and Y direction
        if(browser.b1 == true){
        if(paddle1.x + paddle1.r  < canvas.width/2)  {
            if (
                e.which == RIGHT_ARROW &&
                paddle1.x + paddle1.r + paddleSpeed <= canvas.width)
                paddle1.x += paddleSpeed; //right arrow

        }
        if (e.which == UP_ARROW && paddle1.y - paddle1.r >= paddleSpeed) paddle1.y -= paddleSpeed; //up arrow

        if (e.which == LEFT_ARROW && paddle1.x - paddle1.r >= paddleSpeed) paddle1.x -= paddleSpeed; //left arrow
        if (
            e.which == DOWN_ARROW &&
            paddle1.y + paddle1.r + paddleSpeed <= canvas.height
        )
            paddle1.y += paddleSpeed; //down arrow
            var dataObj1 = { x: paddle1.x, y: paddle1.y };
            var jsonString1 = JSON.stringify(dataObj1);
            socket.emit('paddleData1', jsonString1);
        }


        //paddle2
        if(browser.b2 == true) {
            if (paddle2.x - paddle2.r > canvas.width / 2) {
                if (e.which == LEFT_ARROW && paddle2.x >= paddleSpeed) paddle2.x -= paddleSpeed; //left arrow

            }
            if (e.which == UP_ARROW && paddle2.y - paddle2.r >= paddleSpeed) paddle2.y -= paddleSpeed; //up arrow
            if (
                e.which == RIGHT_ARROW &&
                paddle2.x + paddle2.r + paddleSpeed <= canvas.width
            )
                paddle2.x += paddleSpeed; //right arrow

            if (
                e.which == DOWN_ARROW &&
                paddle2.y + paddle2.r + paddleSpeed <= canvas.height
            )
                paddle2.y += paddleSpeed; //down arrow
            var dataObj2 = { x: paddle2.x, y: paddle2.y };
            var jsonString2 = JSON.stringify(dataObj2);
            socket.emit('paddleData2', jsonString2);
        }

    }


}

function handleKeyUp(e) {
  console.log("key UP: " + e.which);
  if(user1data.buttonEnabled == false && user2data.buttonEnabled == false) {
      if (browser.b1 == true) {
      var dataObj1 = {x: paddle1.x, y: paddle1.y};
      //create a JSON string representation of the data object
      var jsonString1 = JSON.stringify(dataObj1);
      socket.emit('paddleData1', jsonString1);
      }
      if (browser.b2 == true) {
          var dataObj2 = {x: paddle2.x, y: paddle2.y};
          //create a JSON string representation of the data object
          var jsonString2 = JSON.stringify(dataObj2);
          socket.emit('paddleData2', jsonString2);
      }

  }


}

function updateUser(){
    var dataObj1 = { name: user1data.name,mark:user1data.mark, buttonEnabled: user1data.buttonEnabled,quitButtonEnabled: user1data.quitButtonEnabled };
    var jsonString1 = JSON.stringify(dataObj1);
    socket.emit('user1Data', jsonString1);
    var dataObj2 = { name: user2data.name,mark:user2data.mark,buttonEnabled: user2data.buttonEnabled, quitButtonEnabled: user2data.quitButtonEnabled };
    var jsonString2 = JSON.stringify(dataObj2);
    socket.emit('user2Data', jsonString2);
    drawCanvas();

}

function handleUser1ReadyButton() {
    browser.b1 = true;
  user1data.name = $('#user1TextField').val();
  user1data.buttonEnabled = false;
  user1data.quitButtonEnabled = true;
  //$('#user1Button').attr("disabled", true);

    /*var dataObj = { name: $('#user1TextField').val(), buttonEnabled: user1data.buttonEnabled,quitButtonEnabled: user1data.quitButtonEnabled };
    //create a JSON string representation of the data object
    var jsonString = JSON.stringify(dataObj);
    socket.emit('user1Data', jsonString);*/
    updateUser();
    drawCanvas();

}

function handleUser2ReadyButton() {
    browser.b2 = true;
    user2data.name = $('#user2TextField').val();
    user2data.buttonEnabled = false;
    user2data.quitButtonEnabled = true;
    //$('#user1Button').attr("disabled", true);
    updateUser();
    drawCanvas();

}

function handleUser1QuitButton() {
    browser.b1 = false;
  user1data.buttonEnabled = true;
  user1data.quitButtonEnabled = false;
  user1data.name = "Player Name";
  puckSpeed = 0;
  user1data.mark=0;

  var dataObj = { name: user1data.name, mark:user1data.mark,buttonEnabled: user1data.buttonEnabled,quitButtonEnabled: user1data.quitButtonEnabled };
    //create a JSON string representation of the data object
    var jsonString = JSON.stringify(dataObj);
    socket.emit('user1Data', jsonString);

    drawCanvas();
}

function handleUser2QuitButton() {
    browser.b2 = false;
    user2data.buttonEnabled = true;
    user2data.quitButtonEnabled = false;
    user2data.name = "Player Name";
    puckSpeed = 0;
    user2data.mark=0;

    var dataObj = { name: user2data.name, mark:user2data.mark, buttonEnabled: user2data.buttonEnabled, quitButtonEnabled: user2data.quitButtonEnabled };
    //create a JSON string representation of the data object
    var jsonString = JSON.stringify(dataObj);
    socket.emit('user2Data', jsonString);

    drawCanvas();
}


//connect to server and retain the socket
var socket = io('http://' + window.document.location.host);
//var socket = io('http://localhost:3000')


socket.on('paddleData1', function(data1) {
    //console.log("data: " + data);
    //console.log("typeof: " + typeof data);
    var locationData = JSON.parse(data1);
    //var locationData = data;
    paddle1.x = locationData.x;
    paddle1.y = locationData.y;
    drawCanvas();
});


socket.on('paddleData2', function(data5) {
    //console.log("data: " + data);
    //console.log("typeof: " + typeof data);
    var locationData = JSON.parse(data5);
    //var locationData = data;
    paddle2.x = locationData.x;
    paddle2.y = locationData.y;
    drawCanvas();
});




socket.on('puckData' , function (data2) {

  var locationData = JSON.parse(data2);
  puck.x = locationData.x;
  puck.y = locationData.y;
  puck.xDirection = locationData.xd;
  puck.yDirection =  locationData.yd;
  puckSpeed = locationData.ps;
  drawCanvas();
});

socket.on('user1Data' , function (data3) {
    var userData = JSON.parse(data3);
    user1data.name = userData.name;
    user1data.mark = userData.mark;
    user1data.buttonEnabled = userData.buttonEnabled;
    user1data.quitButtonEnabled = userData.quitButtonEnabled;
    drawCanvas();
});

socket.on('user2Data' , function (data4) {
    var userData = JSON.parse(data4);
    user2data.name = userData.name;
    user2data.mark = userData.mark;
    user2data.buttonEnabled = userData.buttonEnabled;
    user2data.quitButtonEnabled = userData.quitButtonEnabled;
    drawCanvas();
});


$(document).ready(function() {
  //add keyboard handler to document
  $(document).keydown(handleKeyDown);
  $(document).keyup(handleKeyUp);

  timer = setInterval(handleTimer, 100); //tenth of second


  drawCanvas();
});
