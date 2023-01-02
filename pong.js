var canvas;
var canvasContext;
var ballX = 50;
var ballSpeedX = 13;
var ballY = 50;
var ballSpeedY = 4;

var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 8;

var showingWinScreen = false;

var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_THICKNESS = 10;
const PADDLE_HEIGHT = 100;

let gamePaused = false; // boolean flag
let gameLoop;

function calculateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = evt.clientX - rect.left - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop;
  return {
    x:mouseX,
    y:mouseY
  };

}

function handleMouseClick(evt) {
  if(showingWinScreen) {
    player1Score = 0;
    player2Score = 0;
    showingWinScreen = false;
  }
}

function resetGame() {
  player1Score = 0;
  player2Score = 0;
  showingWinScreen = false;
  ballX = 50;
  ballY = 50;
  ballSpeedX = 13;
  ballSpeedY = 4;
  paddle1Y = 250;
  paddle2Y = 250;
  gamePaused = false;
}

function startGame() {
  resetGame();

  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');

  var framesPerSecond = 30;
  clearInterval(gameLoop);
  gameLoop = setInterval(function() {
    if(!gamePaused) {
      drawEverything();
      moveEverything();
    }
  }, 1000/framesPerSecond);

  canvas.addEventListener('mousedown', 
    function(evt) { // pass the event object here
      handleMouseClick(evt);
  });

  canvas.addEventListener('mousemove',
    function(evt) {
      var mousePos = calculateMousePos(evt);
      paddle1Y = mousePos.y-(PADDLE_HEIGHT/2);
    });

  if (gamePaused) {
    pauseButton.textContent = "Resume Game";
  } else {
    pauseButton.textContent = "Pause Game";
  }
}

function pauseGame() {
  gamePaused = !gamePaused;
  if (gamePaused) {
    clearInterval(gameLoop); // stop the game loop
    pauseButton.textContent = "Resume Game";
  } else {
    gameLoop = setInterval(function() { // start the game loop
      if(!gamePaused) {
        drawEverything();
        moveEverything();
      }
    }, 1000/framesPerSecond);
    pauseButton.textContent = "Pause Game";
  }
}

const startButton = document.getElementById('startButton');
startButton.addEventListener('click', startGame);

const pauseButton = document.getElementById('pauseButton');
pauseButton.addEventListener('click', pauseGame);

// const mouse = document.canvas.getElementById('mousedown');
// canvas.addEventListener('mousedown', handleMouseClick);

function ballReset() {
if(player1Score >= WINNING_SCORE ||
   player2Score >= WINNING_SCORE) {
     showingWinScreen = true;
   }

  ballSpeedX = -ballSpeedX;
  ballX = canvas.width/2;
  ballY = canvas.height/2;
}

function computerMovement() {
  var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);
  if(paddle2YCenter < ballY-37) {
    paddle2Y += 20;
  } else if (paddle2YCenter > ballY+37) {
    paddle2Y -= 20;
  }
}

function moveEverything() {
  if(showingWinScreen) {
    return;
  }
  computerMovement();

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if(ballX < 0) {
      if(ballY > paddle1Y &&
         ballY < paddle1Y+PADDLE_HEIGHT) {
           ballSpeedX = -ballSpeedX;

           var deltaY = ballY
            -(paddle1Y + PADDLE_HEIGHT/2);
           ballSpeedY = deltaY * 0.35;
         } else {
      player2Score ++; // Must be before ballReset(); so that the game can decide when the win condition is reached
      ballReset();
         }
    }
    if(ballX > canvas.width) {
        if(ballY > paddle2Y &&
           ballY < paddle2Y+PADDLE_HEIGHT) {
             ballSpeedX = -ballSpeedX;
             var deltaY = ballY
              -(paddle2Y + PADDLE_HEIGHT/2);
            ballSpeedY = deltaY * 0.35;
           } else {
        player1Score ++; // Must be before ballReset();
        ballReset();
           }
    }
    if(ballY < 0) {
      ballSpeedY = -ballSpeedY;
    }
    if(ballY > canvas.height) {
      ballSpeedY = -ballSpeedY;
    }

}

function drawNet() {
  for(var i=0; i<canvas.height; i+=40) {
    colorRect(canvas.width/2-1, i, 2, 20, 'white');
  }
}

function drawEverything() {
  // Will draw black canvas
  colorRect(0,0,canvas.width,canvas.height, 'black');

  if(showingWinScreen) {
    canvasContext.fillStyle = 'white';
    if(player1Score >= WINNING_SCORE) {
          canvasContext.fillText("Left Player Won!", canvas.width/2, 200)
    } else if(player2Score >= WINNING_SCORE) {
          canvasContext.fillText("Right Player Won!", canvas.width/2, 200)
    }

    canvasContext.fillText("Click to Continue", canvas.width/2, 500)
    return;
  }

  drawNet();

  // Draws player's paddle
  colorRect(0, paddle1Y, PADDLE_THICKNESS, 100, 'white');

  // Draws second paddle
  colorRect(canvas.width-PADDLE_THICKNESS, paddle2Y, PADDLE_THICKNESS, 100, 'white');

  // Draws game ball
  colorCirlce(ballX, ballY, 10, 'white');

  // Draws game score
  canvasContext.fillText(player1Score, 100, 100)
  canvasContext.fillText(player2Score, canvas.width-100, 100)
}

function colorCirlce(centerX, centerY, radius, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0,Math.PI*2, true);
  canvasContext.fill();
}

function colorRect(leftX,topY, width,height, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX,topY, width,height);
}
