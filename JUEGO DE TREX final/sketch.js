var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var checksound, diesound, jumpsound;

var gameoverimage;
var restartimage;
var score;


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  checksound = loadSound("checkpoint.mp3");
  diesound = loadSound("die.mp3");
  jumpsound = loadSound("jump.mp3");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameoverimage = loadImage("gameOver.png");
  restartimage = loadImage("restart.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  gO = createSprite(width/2,height/2-50,100,40);
  gO.addImage(gameoverimage);
  gO.scale = 0.5
  gO.visible = false;
   rst= createSprite(width/2,height/2,100,40)
  rst.addImage(restartimage);
  rst.scale = 0.5
  rst.visible = false;

  trex = createSprite(50,height-95,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided)
  trex.scale = 0.5;
  
  ground = createSprite(width/2,height-100,width,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width/2
  
  
  invisibleGround = createSprite(width/2,height-90,width,10);
  invisibleGround.visible = false;
  
  //crear grupos de obstáculos y nubes
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  console.log("Hola" + 5);
  
  trex.setCollider("circle",0,0,40);
  trex.debug = false;
  
  score = 0
}

function draw() {
  background(180);
  //mostrar la puntuación
  text("Puntuación : "+ score, 500,50);
  
  console.log("esto es  ",gameState)
  
  
  if(gameState === PLAY){
    //mover el suelo
    ground.velocityX = -(4 + 2*score/500);
    //puntuación
    score = score + Math.round(frameCount/60);
    if(score>0 && score %500 == 0)
    {
      checksound.play();
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //hacer que el Trex salte al presionar la barra espaciadora
    if(touches.length>0 || keyDown("space")&& trex.y >=height-150) {
        jumpsound.play();
        trex.velocityY = -13;
        touches=[];
    }
    
    //agregar gravedad
    trex.velocityY = trex.velocityY + 0.8
  
    //aparecer nubes
    spawnClouds();
  
    //aparecer obstáculos en el suelo
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
      diesound.play();  
      gameState = END;
    }
  }
   else if (gameState === END) {
      gO.visible = true;
      rst.visible = true;
    ground.velocityX = 0;
     trex.velocityX = 0;
     trex.changeAnimation("collided");
     obstaclesGroup.setLifetimeEach(-1);
     cloudsGroup.setLifetimeEach(-1);
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
   }
  
 
  //evitar que el Trex caiga
  trex.collide(invisibleGround);
  if (mousePressedOver(rst))
  {
    console.log("reiniciar el juego");
    reset();
  }
  
  
  drawSprites();
}

function reset ()
{
gameState = PLAY;
gO.visible = false;
rst.visible = false;
obstaclesGroup.destroyEach();
cloudsGroup.destroyEach();
trex.changeAnimation("running");
score = 0;


}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(width,height-115,10,40);
   obstacle.velocityX = -(6 + score / 500);
   
    //generar obstáculos al azar
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
   
    //asignar escala y ciclo de vida al obstáculo           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //agregar cada obstáculo al grupo
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
   if (frameCount % 60 === 0) {
     cloud = createSprite(width+20,height-300,40,10);
    cloud.y = Math.round(random(100,220));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -(3 + score / 500);
    
     //asignar ciclo de vida a la variable
    cloud.lifetime = 220;
    
    //ajustar la profundidad
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //ajustar la profundidad
   cloudsGroup.add(cloud);
    }
}

