var PLAY = 1;
var END = 0;
var gameState = PLAY;
var trex, trex_running, trex_collided
var ground, iGround, groundImage
var cloud, cloudImage, cloudGroup
var ob1, ob2, ob3, ob4, ob5, ob6, oGroup
var score
var gameOverImg
var jumpSound, checkpointSound, dieSound

function preload() {
  trex_running = loadAnimation("trex1.png", "trex2.png", "trex3.png")
  trex_collided = loadAnimation("trex_collided.png")
  groundImage = loadImage("ground2.png")
  cloudImage = loadImage("cloud1.png")
  ob1 = loadImage("obstacle1.png")
  ob2 = loadImage("obstacle2.png")
  ob3 = loadImage("obstacle3.png")
  ob4 = loadImage("obstacle4.png")
  ob5 = loadImage("obstacle5.png")
  ob6 = loadImage("obstacle6.png")
  gameOverImg = loadImage("gameOver.png")
  jumpSound = loadSound("jump.mp3")
  checkpointSound = loadSound("checkpoint.mp3")
  dieSound = loadSound("die.mp3")
}

function setup() {
  //createCanvas(600, 200)
  createCanvas(windowWidth, windowHeight)
  //create a trex sprite
  //trex = createSprite(50, 180, 20, 50)
  trex = createSprite(50, height - 70, 20, 50)

  trex.addAnimation("running", trex_running)
  trex.addAnimation("collided", trex_collided)
  trex.scale = 0.5
  //console.log(trex.depth)
  //groundSprites
  //ground = createSprite(200, 180, 400, 20)
  ground = createSprite(width/2, height - 80, width, 2)
  ground.addImage("ground", groundImage)

  //iGround = createSprite(200, 200, 400, 20)
  iGround = createSprite(width/2, height - 10, width, 125)
  iGround.visible = false

  //gameOver = createSprite(300, 100)
  gameOver = createSprite(width/2, height/2 - 50)
  gameOver.addImage(gameOverImg)
  gameOver.scale = 0.45

  //create obstacle and cloud group
  oGroup = createGroup()
  cloudGroup = createGroup()

  console.log("Hello" + 5)
  score = 0
  //trex.debug = true
  trex.setCollider("circle", 0, 0, 40)
}

function draw() {
  background(220)
  text("Score: " + score, 375, 20)


  if (gameState === PLAY) {
    score += Math.round(getFrameRate() / 60)
    if (score % 10 === 0) {
      checkpointSound.play()
    }
    gameOver.visible = false
    ground.velocityX = -2
    if (ground.x < 0) {
      ground.x = ground.width / 2
    }
    //console.log(ground.width)
    //console.log(trex.y)
    if ((touches.length > 0 || keyDown("SPACE")) && trex.y >= height - 120) {
      trex.velocityY = -12.4
      jumpSound.play()
      touches = []
    }

    //add gravity to trex
    trex.velocityY += 0.8
    spawnClouds()
    spawnObstacles()
    if(oGroup.isTouching(trex)){
      gameState = END
      dieSound.play()
    }
  }
  else if (gameState === END){
    gameOver.visible = true
    trex.changeAnimation("collided", trex_collided)
    ground.velocityX = 0
    trex.velocityY = 0
    oGroup.setLifetimeEach(-1)
    cloudGroup.setLifetimeEach(-1)
    oGroup.setVelocityXEach(0);
    cloudGroup.setVelocityXEach(0);
    if ((touches.length > 0 || mousePressedOver(gameOver))){
      touches = []
      reset()
    }
  }

  //stop trex from falling down
  trex.collide(iGround)

  
  drawSprites()
}

function spawnClouds() {
  if (frameCount % 60 === 0) {
    //cloud = createSprite(600, 100, 40, 10)
    cloud = createSprite(width + 20, height - 300, 40, 10)
    cloud.addImage(cloudImage)
    cloud.velocityX = -2
    cloud.y = Math.round(random(10, 60))
    cloud.scale = 0.1
    cloud.depth = trex.depth
    trex.depth = trex.depth + 1
    //console.log(cloud.depth)
    cloud.lifetime = 300
    cloudGroup.add(cloud)
  }
}

function spawnObstacles() {
  if (frameCount % 60 === 0) {
    //var obstacle = createSprite(400, 165, 10, 40)
    var obstacle = createSprite(600, height - 95, 20, 30)
    obstacle.velocityX = -4
    var r = Math.round(random(1, 6))
    switch (r) {
      case 1:
        obstacle.addImage(ob1)
        break;
      case 2:
        obstacle.addImage(ob2)
        break;
      case 3:
        obstacle.addImage(ob3)
        break;
      case 4:
        obstacle.addImage(ob4)
        break;
      case 5:
        obstacle.addImage(ob5)
        break;
      case 6:
        obstacle.addImage(ob6)
        break;
      default:
        break;
    }
    obstacle.scale = 0.4
    obstacle.lifetime = 300
    oGroup.add(obstacle)
  }
}

function reset() {
  gameState = PLAY
  gameOver.visible = false
  oGroup.destroyEach()
  cloudGroup.destroyEach()
  score = 0
  trex.changeAnimation("running", trex_running)
}