var leftWall,rightWall;
var leftWallGroup,rightWallGroup;
var topWall,bottomWall;
var ball,ball_img;
var flag = "fall";
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var score = 0;
var wallSpeed = -4;
var gameStatePong = "serve";
var invisibleLeftEdge,invisibleRightEdge;

function preload(){
  ball_img = loadImage("redBall.png");
}

function setup(){
  createCanvas(400,600);

  if(flag === "fall"){

  ball = createSprite(250,200,20,20);
  ball.addImage("ball",ball_img)
  ball.scale = 0.14;

  leftWallGroup = new Group();
  rightWallGroup = new Group();

  topWall = createSprite(200,0,450,5);
  topWall.visible = false;

  bottomWall = createSprite(200,600,450,5);
  bottomWall.visible = false;

  invisibleLeftEdge = createSprite(0,300,5,800);
  invisibleRightEdge = createSprite(398,300,5,800);

  invisibleLeftEdge.visible = false;
  invisibleRightEdge.visible = false;

  ball.setCollider("circle",0,0,75);
  ball.debug = false
  }

  if(flag === "pong"){
    userPaddle = createSprite(390,300,10,70);
    computerPaddle = createSprite(10,300,10,70);
    ball = createSprite(200,300,12,12);

    computerScore = 0;
    playerScore = 0;
    gameStatePong = "serve";
  }
}

function endFall(){
  score = leftWallGroup.length-8;
  alert("Score : "+score);
  leftWallGroup.destroyEach();
  rightWallGroup.destroyEach();
  ball.destroy();
  topWall.destroy();
  invisibleLeftEdge.destroy();
  invisibleRightEdge.destroy();
}

function draw(){
  background(255);

  if(flag === "fall"){
    fall();
    if(ball.isTouching(topWall)){
      endFall();
      flag="pong";
      background("white");
      setup();
    }
  }
  if(flag === "pong"){
    pong();
    if(gameStatePong==="over"){
      text("Game Over",170,160);
    }
  }

  edges = createEdgeSprites();
  drawSprites();
}

function spawnWalls(){

    if(frameCount%20===0){
      var randomWidth = random(50,300);
      leftWall = createSprite(randomWidth/2,600,randomWidth,20);
      leftWall.shapeColor = "black";
      leftWall.velocityY = wallSpeed;

      rightWall = createSprite(randomWidth+40+(400-40-randomWidth)/2,leftWall.y,400-40-randomWidth,20);
      rightWall.shapeColor = "black";
      rightWall.velocityY = leftWall.velocityY;

      leftWall.lifetime = 350;
      rightWall.lifetime = 350;

     leftWall.depth = rightWall.depth;
     ball.depth = rightWall.depth;
     
      leftWallGroup.add(leftWall);
      rightWallGroup.add(rightWall);

    }
}

function fall(){
  ball.collide(invisibleLeftEdge);
  ball.collide(invisibleRightEdge);

  if(gameState === PLAY){
    
    ball.velocityY = 4;
    
    if(keyDown(LEFT_ARROW)){
      ball.x -= 8;
    }

    if(keyDown(RIGHT_ARROW)){
      ball.x += 8;
    }
      spawnWalls();
      

      if(leftWallGroup.isTouching(ball)){
      ball.collide(leftWallGroup);
      ball.setVelocity(0,0);
      }

      if(rightWallGroup.isTouching(ball)){
      ball.collide(rightWallGroup);
      ball.setVelocity(0,0);
      }
}
}

function pong(){
  background("white");

   text(computerScore,170,20); 
   text(playerScore, 230,20); 

   //draw dotted lines 
   for (var i = 0; i < 600; i+=20) {
      line(200,i,200,i+10); 
    } 

    if (gameStatePong === "serve") {
     text("Press Space to Serve",150,180); 
  } 

  if (keyDown("r")) {
    gameStatePong = "serve";
    computerScore = 0;
    playerScore = 0; 
} 

  if (computerScore=== 5 || playerScore === 5){
   gameStatePong = "over"; 
}


  if (keyDown("space") && gameStatePong == "serve") { 
     ball.velocityX = 5;
     ball.velocityY = 5;
     gameStatePong = "play"; 
    } 

  userPaddle.y = World.mouseY;
     
  if(ball.isTouching(userPaddle)){
      
     ball.x = ball.x - 5;
     ball.velocityX = -ball.velocityX;
    }
        
  if(ball.isTouching(computerPaddle)){
     ball.x = ball.x + 5;
     ball.velocityX = -ball.velocityX;
    }
       
  if(ball.x > 400 || ball.x < 0){
     
               if (ball.x < 0) 
               { playerScore++; 
              }
               else 
               { computerScore++; 
              }
               ball.x = 200;
               ball.y = 250;
                ball.velocityX = 0;
                 ball.velocityY = 0;
                  gameStatePong = "serve"; 
                }
                 //make the ball bounce off the top and bottom walls 
                 if (ball.isTouching(edges[2]) || ball.isTouching(edges[3])) 
                 { ball.bounceOff(edges[2]);
                   ball.bounceOff(edges[3]);
                    // wall_hitSound.play(); 
                  }
                   //add AI to the computer paddle so that it always hits the ball 
                   computerPaddle.y = ball.y;
}

