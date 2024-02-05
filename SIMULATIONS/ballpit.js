///////////////////////////////////////////////////////////
// COLLISION BALL SIMULATION WITH FRICTION
///////////////////////////////////////////////////////////
var BallPit = {};

BallPit.displayname = "Ball Pit";
SIMULATIONS.list.push(BallPit);
BallPit.simulationid = SIMULATIONS.list.indexOf(BallPit);

///////////////////////////////////////////////////////////
// COLLISION BALL SIMULATION INITIALISER
///////////////////////////////////////////////////////////
BallPit.init = function () {
  
  /* BALLS */
  this.ballList = [];
  
  for(let i = 0; i < 500; i++){
    
    let rand = Math.random();
    
    this.ballList.push({
      position: {x:400, y:rand*580+10},
      velocity: {x:0, y:0},
      mass: 0.1,
      radius: 7.5,
      bounce: -0.99,
      drag: 0.45,
      color: 'rgb('+(Math.random()*200+55)+','+(Math.random()*200+55)+','+(Math.random()*200+55)+')'
    });
  }
  
  /* WORLD */
  this.gravity = 9.8;
  this.airDensity = 1.225;
  this.plsSlowDown = 1;
    
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
BallPit.loop = function () {
  
  /* TIME */
  this.currenttick = performance.now();
  this.deltatime = (this.currenttick - this.lasttick) / 1000;
  this.deltachunk = this.deltatime / Math.ceil(this.deltatime);
  this.lasttick = this.currenttick;
  
  let TIMEDIVIDER = 6;
  
  /* CANVAS */
  RENDERER.resize();
  
  /* UPDATE */
  for(let d = 0; d < Math.ceil(this.deltatime)*TIMEDIVIDER; d++){
    for(let i = 0; i < this.ballList.length; i++){
      
      //short name
      let ball = this.ballList[i];

      //pls slow down
      ball.velocity.x *= this.plsSlowDown ** (this.deltachunk/TIMEDIVIDER);
      ball.velocity.y *= this.plsSlowDown ** (this.deltachunk/TIMEDIVIDER);

      //add drag
      ball.velocity.x += Math.sign(ball.mass) * (((-0.5 * ball.drag * Math.PI*((ball.radius/100)**2) * this.airDensity * (ball.velocity.x**2) * Math.sign(ball.velocity.x)) / ball.mass) * (this.deltachunk/TIMEDIVIDER)) || 0;
      ball.velocity.y += Math.sign(ball.mass) * (((-0.5 * ball.drag * Math.PI*((ball.radius/100)**2) * this.airDensity * (ball.velocity.y**2) * Math.sign(ball.velocity.y)) / ball.mass) * (this.deltachunk/TIMEDIVIDER)) || 0;
      
      //add gravity
      ball.velocity.y += Math.sign(ball.mass) * this.gravity * (this.deltachunk/TIMEDIVIDER);
      
      //add movement
      ball.position.x += 100 * ball.velocity.x * (this.deltachunk/TIMEDIVIDER);
      ball.position.y += 100 * ball.velocity.y * (this.deltachunk/TIMEDIVIDER);
      
      //hit wals
      if ((ball.position.x - ball.radius) < 0) {
        ball.velocity.x *= ball.bounce;
        ball.position.x = ball.radius;
      }
      if ((ball.position.y - ball.radius) < 0) {
        ball.velocity.y *= ball.bounce;
        ball.position.y = ball.radius;
      }
      if ((ball.position.x + ball.radius) > RENDERER.baseWidth) {
        ball.velocity.x *= ball.bounce;
        ball.position.x = RENDERER.baseWidth - ball.radius;
      }
      if ((ball.position.y + ball.radius) > RENDERER.baseHeight) {
        ball.velocity.y *= ball.bounce;
        ball.position.y = RENDERER.baseHeight - ball.radius;
      }
      
    }
    
    for(let amountoftimes = 0; amountoftimes < 1; amountoftimes++){
    for(let a = 0; a < this.ballList.length; a++){
      for(let b = 0; b < this.ballList.length; b++){
        if(a != b){
          
          //hit balls
          let ballA = this.ballList[a];
          let ballB = this.ballList[b];
          
          let distance = Math.sqrt( (ballA.position.x - ballB.position.x)**2 + (ballA.position.y - ballB.position.y)**2 );
          
          let sumOfRadi = ballA.radius + ballB.radius;
          
          if (distance < sumOfRadi) {
            
            let angle = Math.atan2((ballA.position.y - ballB.position.y), (ballA.position.x - ballB.position.x));
            
            ballA.position.x += (Math.cos(angle) * (sumOfRadi - distance))/2;
            ballA.position.y += (Math.sin(angle) * (sumOfRadi - distance))/2;
            
            ballB.position.x -= (Math.cos(angle) * (sumOfRadi - distance))/2;
            ballB.position.y -= (Math.sin(angle) * (sumOfRadi - distance))/2;
            
            let tangentVector = [( ballA.position.y - ballB.position.y ),-( ballA.position.x - ballB.position.x )];
            
            let tangentVectorMagnitude = Math.sqrt( tangentVector[0]**2 + tangentVector[1]**2 );
            
            tangentVector = [(tangentVector[0]/tangentVectorMagnitude), (tangentVector[1]/tangentVectorMagnitude)];
            
            let relativeVelocity = [(ballA.velocity.x - ballB.velocity.x), (ballA.velocity.y - ballB.velocity.y)];
            
            let dotProductOfVectors = tangentVector[0]*relativeVelocity[0] + tangentVector[1]*relativeVelocity[1];
            
            let velocityComponent = [(tangentVector[0]*dotProductOfVectors), (tangentVector[1]*dotProductOfVectors)];
            
            let perpendicularVelocityComponent = [(relativeVelocity[0]-velocityComponent[0]), (relativeVelocity[1]-velocityComponent[1])];
            
            ballA.velocity.x -= perpendicularVelocityComponent[0] * -ballA.bounce;
            ballA.velocity.y -= perpendicularVelocityComponent[1] * -ballA.bounce;
            
            ballB.velocity.x += perpendicularVelocityComponent[0] * -ballB.bounce;
            ballB.velocity.y += perpendicularVelocityComponent[1] * -ballB.bounce;

            if ((ballA.position.x - ballA.radius) < 0) {ballA.velocity.x *= ballA.bounce;ballA.position.x = ballA.radius;}if ((ballA.position.y - ballA.radius) < 0) {ballA.velocity.y *= ballA.bounce;ballA.position.y = ballA.radius;}if ((ballA.position.x + ballA.radius) > RENDERER.baseWidth) {ballA.velocity.x *= ballA.bounce;ballA.position.x = RENDERER.baseWidth - ballA.radius;}if ((ballA.position.y + ballA.radius) > RENDERER.baseHeight) {ballA.velocity.y *= ballA.bounce;ballA.position.y = RENDERER.baseHeight - ballA.radius;}if ((ballB.position.x - ballB.radius) < 0) {ballB.velocity.x *= ballB.bounce;ballB.position.x = ballB.radius;}if ((ballB.position.y - ballB.radius) < 0) {ballB.velocity.y *= ballB.bounce;ballB.position.y = ballB.radius;}if ((ballB.position.x + ballB.radius) > RENDERER.baseWidth) {ballB.velocity.x *= ballB.bounce;ballB.position.x = RENDERER.baseWidth - ballB.radius;}if ((ballB.position.y + ballB.radius) > RENDERER.baseHeight) {ballB.velocity.y *= ballB.bounce;ballB.position.y = RENDERER.baseHeight - ballB.radius;}
            
          }
          
        }
      }
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
