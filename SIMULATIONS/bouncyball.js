///////////////////////////////////////////////////////////
// BOUNCY BALL SIMULATION WITH GRAVITY AND AIR RESISTANCE
///////////////////////////////////////////////////////////
var bouncyBall = {};

bouncyBall.displayname = "Bouncy Ball";
SIMULATIONS.list.push(bouncyBall);
bouncyBall.simulationid = SIMULATIONS.list.indexOf(bouncyBall);

///////////////////////////////////////////////////////////
// BOUNCY BALL SIMULATION INITIALISER
///////////////////////////////////////////////////////////
bouncyBall.init = function () {
  
  /* BALLS */
  this.ballList = [];
  
  for(let i = 0; i < 1000; i++){
    this.ballList.push({
      position: {x:Math.random()*800, y:200},
      velocity: {x:0, y:0},
      mass: 0.5,
      radius: Math.random()*10 + 2.5,
      bounce: -0.925,
      drag: 0.45,
      color: '#'+Math.floor(Math.random()*16777215).toString(16)
    });
  }
  
  /* WORLD */
  this.gravity = 9.8;
  this.airDensity = 1.225;
    
  /* TIME */
  this.lasttick = performance.now();
  this.currenttick = performance.now();
  
  this.deltatime = 0;
  this.deltachunk = 0;
    
  /* FOCUS */
  this.focused = 1;
  
  document.onvisibilitychange = function (){
    this.lasttick = performance.now();
  }.bind(this);
  
  /* START */
  window.cancelAnimationFrame(this.loopid);
  this.loopid = requestAnimationFrame(this.loop.bind(this));
  
}

///////////////////////////////////////////////////////////
// BOUNCY BALL SIMULATION LOOP
///////////////////////////////////////////////////////////
bouncyBall.loop = function () {
  
  /* TIME */
  this.currenttick = performance.now();
  this.deltatime = (this.currenttick - this.lasttick) / 1000;
  this.deltachunk = this.deltatime / Math.ceil(this.deltatime);
  this.lasttick = this.currenttick;
  
  /* CANVAS */
  RENDERER.resize();
  
  /* UPDATE */
  for(let d = 0; d < Math.ceil(this.deltatime); d++){
    for(let i = 0; i < this.ballList.length; i++){
      
      //short name
      let ball = this.ballList[i];
      
      //add drag
      ball.velocity.x += Math.sign(ball.mass) * (((-0.5 * ball.drag * Math.PI*((ball.radius/100)**2) * this.airDensity * (ball.velocity.x**2) * Math.sign(ball.velocity.x)) / ball.mass) * this.deltachunk) || 0;
      ball.velocity.y += Math.sign(ball.mass) * (((-0.5 * ball.drag * Math.PI*((ball.radius/100)**2) * this.airDensity * (ball.velocity.y**2) * Math.sign(ball.velocity.y)) / ball.mass) * this.deltachunk) || 0;
      
      //add gravity
      ball.velocity.y += Math.sign(ball.mass) * this.gravity * this.deltachunk;
      
      //add movement
      ball.position.x += 100 * ball.velocity.x * this.deltachunk;
      ball.position.y += 100 * ball.velocity.y * this.deltachunk;
      
      //hit walls
      if((ball.position.y + ball.radius) > RENDERER.baseHeight){
        ball.velocity.y *= ball.bounce;
        ball.position.y = RENDERER.baseHeight - ball.radius;
      }
      
    }
  }
  
  /* DRAW */
  for(let i = 0; i < this.ballList.length; i++){
    let ball = this.ballList[i];
    RENDERER.draw("ellipse","fill",ball.color,ball.position.x,ball.position.y,ball.radius*2,ball.radius*2,0);
  }
  
  /* CONTINUE */
  if(SIMULATIONS.playing===this.simulationid){this.loopid = requestAnimationFrame(this.loop.bind(this));}
  
}
