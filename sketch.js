var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOverImg, restartImg;
var jumpSound , checkPointSound, dieSound;

localStorage['highestScore']=0;


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
   restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(windowWidth-10, windowHeight-20);
  // width height  of canvas

  trex = createSprite(50,height-30,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" ,trex_collided);
  trex.scale = 0.5;
  trex.debug = true;
  trex.setCollider("rectangle", 0,0, 100, 100);
  //console.log(trex)
  
  ground = createSprite(width/2,height-50,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(width/2, height-200);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2, height-150);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(width/2,height-30,width,10);
  invisibleGround.visible = false;
  //invisibleGround.debug = true

  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
}

function draw() {
  
  background(180);
  //displaying score
  text("Highest Score: "+localStorage['highestScore'], width-100,50);
  text("Score: "+ score, width-100,80);
 
  
  if(gameState === PLAY){
    gameOver.visible = false;
    restart.visible = false;
    //move the ground
    ground.velocityX = -(4 + score/100);
    //scoring
    score = score + Math.round(getFrameRate()/50);

    if(score%500 == 0 && score>0){
      checkPointSound.play();
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(( keyDown("space") || touches.length>0 )  &&  trex.y >= height-80 ) {
        trex.velocityY = -12;
          jumpSound.play();
          touches = [];
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
      gameState = END;
      dieSound.play();
      //trex.velocityY = -10;
      //jumpSound.play();
    }
  }
   else if (gameState === END) {
     
      gameOver.visible = true;
      restart.visible = true;
     
      ground.velocityX = 0;
      trex.velocityY = 0.2;
     
      //change the trex animation
      trex.changeAnimation("collided", trex_collided);
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
     
     checkScore();

    if(mousePressedOver(restart)){
      reset(); // function call
    }
   }
  
  //stop trex from falling down
  trex.collide(invisibleGround);
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(width+30,height-60,10,40);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle 
    obstacle.velocityX =  -(4 + score/100);
    obstacle.scale = 0.5;
    obstacle.lifetime = (width+100)/obstacle.velocityX;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    cloud = createSprite(width+30,height-100,40,10);
    cloud.y = Math.round(random(height-150,height-230));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = (width+100)/cloud.velocityX;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
    }
}

function reset(){
  gameState = PLAY;//assign
  
  cloudsGroup.destroyEach();
  obstaclesGroup.destroyEach(); 
   
  trex.changeAnimation("running");

  score = 0;
  //frameCount = 0;
  
}

function checkScore(){
 if(score>localStorage['highestScore'] )
   localStorage['highestScore'] = score;
}

