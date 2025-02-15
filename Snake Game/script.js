const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d"); //2d drawing context of the canvas to draw shapes, lines,text
const scoreText = document.querySelector("#scoreText");
const resetBtn = document.querySelector("#resetBtn");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "white";
const snakeColor = "black";
const snakeBorder = "black";
const foodColor = "red";
const unitSize = 25; //25px
let running = false;
let xVelocity = unitSize; //sets initial movement of snake,starts moving to the right (positive x direction)
let yVelocity = 0; //not moving vertically (y direction is 0)
let foodX; //stores food position
let foodY; //stores food position
let score = 0; //start game with zero
let snake = [
  { x: unitSize * 4, y: 0 }, //creates the starting snake as an array with x,y coordinates
  { x: unitSize * 3, y: 0 }, //snake starts as a straigth line moving to the right
  { x: unitSize * 2, y: 0 },
  { x: unitSize, y: 0 },
  { x: 0, y: 0 },
];

window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);

gameStart(); //game starts

function gameStart() {
  running = true;
  scoreText.textContent = score;
  createFood();
  drawFood();
  nextTick(); //starts the game loop by calling nextTick() function
}
function nextTick() {
  if (running) {
    setTimeout(() => {
      clearBoard();
      drawFood();
      moveSnake();
      drawSnake();
      checkGameOver();
      nextTick();
    }, 75); //runs every 75 milliseconds to keep game updating
  } else {
    displayGameOver();
  }
}
function clearBoard() {
  ctx.fillStyle = boardBackground; // this function means it clears the previous frame
  ctx.fillRect(0, 0, gameWidth, gameHeight); //0,0 means x,y coordinates which starts at left edge and top edge of canvas. fillRect means filled rectangle on the canvas
}
function createFood() {
  function randomFood(min, max) {
    //generates random number between min, max based on unitsize according to the grid
    const randNum =
      Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
    return randNum; //generates x , y positions for the food within the board
  }
  foodX = randomFood(0, gameWidth - unitSize);
  foodY = randomFood(0, gameWidth - unitSize); //ensures the food align with the grid
}
function drawFood() {
  ctx.fillStyle = foodColor;
  ctx.fillRect(foodX, foodY, unitSize, unitSize); // draws food on board at its current x,y position
}
function moveSnake() {
  const head = { x: snake[0].x + xVelocity, y: snake[0].y + yVelocity };
  //moves the snake by adding a new head in direction of current velocity
  snake.unshift(head);
  //if snake head is reaches the food then..
  if (snake[0].x == foodX && snake[0].y == foodY) {
    score += 1; //increase the score
    scoreText.textContent = score;
    createFood(); //generate new food
  } else {
    snake.pop(); //eliminates the tail part of snake when moved to keep the length same
  }
}
function drawSnake() {
  ctx.fillStyle = snakeColor;
  ctx.strokeStyle = snakeBorder;
  snake.forEach((snakePart) => {
    //draws each part of snake on board with a border on each part
    ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
    ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
  });
}
function changeDirection(event) {
  const keyPressed = event.keyCode; //codes of arrow keys
  const LEFT = 37;
  const UP = 38; //code of up key
  const RIGHT = 39;
  const DOWN = 40;
  //changes the snake direction based on arrow keys
  const goingUp = yVelocity == -unitSize;
  const goingDown = yVelocity == unitSize;
  const goingRight = xVelocity == unitSize;
  const goingLeft = xVelocity == -unitSize;

  switch (true) {
    case keyPressed == LEFT && !goingRight: //ensures the snake not moving right
      xVelocity = -unitSize; //snake will start moving left(negative x direction)
      yVelocity = 0; //stops the vertical movement
      break;
    case keyPressed == UP && !goingDown:
      xVelocity = 0;
      yVelocity = -unitSize;
      break;
    case keyPressed == RIGHT && !goingLeft:
      xVelocity = unitSize;
      yVelocity = 0;
      break;
    case keyPressed == DOWN && !goingUp:
      xVelocity = 0;
      yVelocity = unitSize;
      break;
  }
}
function checkGameOver() {
  //checks the snake hits the wall
  switch (true) {
    case snake[0].x < 0:
      running = false;
      break;
    case snake[0].x >= gameWidth:
      running = false;
      break;
    case snake[0].y < 0:
      running = false;
      break;
    case snake[0].y >= gameHeight:
      running = false;
      break;
  }
  for (let i = 1; i < snake.length; i += 1) {
    //checks snake collides with itself
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      running = false; //if either happens game stops
    }
  }
}
function displayGameOver() {
  //displays game over in middle of board when game ends
  ctx.font = "50px MV Boli";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER!", gameWidth / 2, gameHeight / 2);
  running = false;
}
function resetGame() {
  // resets the score ,snake position and direction
  score = 0;
  xVelocity = unitSize;
  yVelocity = 0;
  snake = [
    { x: unitSize * 4, y: 0 },
    { x: unitSize * 3, y: 0 },
    { x: unitSize * 2, y: 0 },
    { x: unitSize, y: 0 },
    { x: 0, y: 0 },
  ];
  gameStart();
}
