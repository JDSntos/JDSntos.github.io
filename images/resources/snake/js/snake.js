const board_border = 'black';
const board_background = "white";
const snake_col = 'lightgreen';
const snake_border = 'black';

//Declare snake default location	
let snake = [
  {x: 200, y: 200},
  {x: 190, y: 200},
  {x: 180, y: 200},
  {x: 170, y: 200},
  {x: 160, y: 200}
]


let score = 0;
let changing_direction = false;
let dx = 10;
let dy = 0;

let food_x;
let food_y;

//Normal speed
//Decrease the number to make it faster
var speed = null;
var level = 1;


// Get the canvas element
const snakeboard = document.getElementById("gameArea");
// Return a two dimensional drawing context
const snakeboard_ctx = snakeboard.getContext("2d");


let btnStart = document.getElementById("btn_start");
btnStart.onclick = function(){
  checkDifficulty();
  if(speed != null){
    closePrompt();
    gameStart();
  }
}

function closePrompt(){
  document.getElementById("prompt").style.display = "none";
  document.getElementById("difficulty").style.display = "none";
  document.getElementById("button").style.display = "none";

}

function checkDifficulty(){
  const diff = document.querySelectorAll('input[name="radDiff"]');
  for(const dif of diff){
    if(dif.checked){
      speed = dif.value;
      break;
    }
  }
}


// gameStart function called when Start button on click
function gameStart(){
	main();
	generate_food();
	document.addEventListener("keydown", change_direction);
}

// main function called repeatedly to keep the game running
function main() {
  //Check if the game has ended
  if (has_game_ended()){
    document.getElementById("gameOver").style.display = "block";
    document.getElementById("difficulty").style.display = "block";
    document.getElementById("button").style.display = "block";
    return;
  }

    changing_direction = false;

    setTimeout(function onTick(){
		clearCanvas();
		drawFood();
		moveSnake();
		drawSnake();

		main();
	}, speed)        

}

// draw a border around the canvas
function clearCanvas() {
  //  Select the colour to fill the drawing
  snakeboard_ctx.fillStyle = board_background;
  //  Select the colour for the border of the canvas
  snakeboard_ctx.strokestyle = board_border;
  // Draw a "filled" rectangle to cover the entire canvas
  snakeboard_ctx.fillRect(0, 0, snakeboard.width, snakeboard.height);
  // Draw a "border" around the entire canvas
  snakeboard_ctx.strokeRect(0, 0, snakeboard.width, snakeboard.height);
}

// Draw the snake on the canvas
function drawSnake() {
  // Draw each part
  snake.forEach(drawSnakePart)
}

function drawFood() {
  snakeboard_ctx.fillStyle = 'yellow';
  snakeboard_ctx.strokestyle = 'black';
  snakeboard_ctx.fillRect(food_x, food_y, 10, 10);
  snakeboard_ctx.strokeRect(food_x, food_y, 10, 10);
}

// Draw snake part (10 pixels each)
function drawSnakePart(snakePart) {		
  // Set the colour of the snake part
  snakeboard_ctx.fillStyle = snake_col;
  // Set the border colour of the snake part
  snakeboard_ctx.strokestyle = snake_border;
  // Draw a "filled" rectangle to represent the snake part at the coordinates
  // the part is located
  snakeboard_ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
  // Draw a border around the snake part
  snakeboard_ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function random_food(min, max) {

  return Math.round((Math.random() * (max-min) + min) / 10) * 10;
}

function generate_food() {
  // Generate a random number the food x-coordinate
  food_x = random_food(0, snakeboard.width - 10);
  // Generate a random number for the food y-coordinate
  food_y = random_food(0, snakeboard.height - 10);
  // if the new food location is where the snake currently is, generate a new food location
  snake.forEach(function has_snake_eaten_food(part) {
    const has_eaten = part.x == food_x && part.y == food_y;
    if (has_eaten) generate_food();
  });
}

function moveSnake(){

	// Create the new Snake's head
  const head = {x: snake[0].x + dx, y: snake[0].y + dy};
  // Add the new head to the beginning of snake body
  snake.unshift(head);
  const has_eaten_food = snake[0].x === food_x && snake[0].y === food_y;
  if (has_eaten_food) {
    // Increase score
    if(speed == 80){
      score += 10;
    }
    else if(speed == 50){
      score += 20;
    }
    else{
      score += 30;
    }

    // Display score on screen
    document.getElementById('score').innerHTML = score;
    // Generate new food location
    generate_food();
  } else {
    // Remove the last part of snake body
    snake.pop();
  }

}

function change_direction(event) {

  const LEFT_KEY = 37;
  const RIGHT_KEY = 39;
  const UP_KEY = 38;
  const DOWN_KEY = 40;    

// Prevent the snake from reversing
  if (changing_direction) return;

  changing_direction = true;

  const keyPressed = event.keyCode;
  const goingUp = dy === -10;
  const goingDown = dy === 10;
  const goingRight = dx === 10;
  const goingLeft = dx === -10;

  if (keyPressed === LEFT_KEY && !goingRight) {
    dx = -10;
    dy = 0;
  }
  if (keyPressed === UP_KEY && !goingDown) {
    dx = 0;
    dy = -10;
  }
  if (keyPressed === RIGHT_KEY && !goingLeft) {
    dx = 10;
    dy = 0;
  }
  if (keyPressed === DOWN_KEY && !goingUp) {
    dx = 0;
    dy = 10;
  }
}

function has_game_ended() {

	for (let i = 4; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true
  }
  const hitLeftWall = snake[0].x < 0;
  const hitRightWall = snake[0].x > snakeboard.width - 10;
  const hitToptWall = snake[0].y < 0;
  const hitBottomWall = snake[0].y > snakeboard.height - 10;

  return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall
  
}


