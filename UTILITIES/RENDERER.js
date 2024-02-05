//////////////////////////////////////////////////
/////GLOBAL RENDERER OBJECT
//////////////////////////////////////////////////
var RENDERER = {};




/////RENDERER ELEMENT
//////////////////////////////////////////////////
RENDERER.element = document.getElementById("renderer");
RENDERER.parent = document.getElementById("viewport");

RENDERER.baseWidth = RENDERER.element.width = 800;
RENDERER.baseHeight = RENDERER.element.height = 600;




/////RENDERER SCALING
//////////////////////////////////////////////////
RENDERER.scale = 1;

RENDERER.resize = function (){
  let widthRatio = RENDERER.parent.clientWidth/RENDERER.baseWidth;
  let heightRatio = RENDERER.parent.clientHeight/RENDERER.baseHeight;
  
  if(widthRatio<=heightRatio){RENDERER.scale = widthRatio;}
  else if(widthRatio>heightRatio){RENDERER.scale = heightRatio;}
  
  RENDERER.element.width = RENDERER.baseWidth*RENDERER.scale;
  RENDERER.element.height = RENDERER.baseHeight*RENDERER.scale;
}




/////RENDERER DRAWING
//////////////////////////////////////////////////
RENDERER.context = RENDERER.element.getContext("2d");

RENDERER.draw = function (shape,drawtype,color,x,y,w,h,rotation){

  RENDERER.lineWidth = RENDERER.scale*2;
  
  RENDERER.context.save();
  RENDERER.context.beginPath();
  
  if(shape==="ellipse"){
    RENDERER.context.ellipse(x*RENDERER.scale,y*RENDERER.scale,(w/2)*RENDERER.scale,(h/2)*RENDERER.scale,rotation*Math.PI/180,0,2*Math.PI);
  }
  
  if(shape==="rectangle"){
    RENDERER.context.translate(x*RENDERER.scale,y*RENDERER.scale)
    RENDERER.context.rotate(rotation*Math.PI/180);
    RENDERER.context.rect(-w*RENDERER.scale/2,-h*RENDERER.scale/2,w*RENDERER.scale,h*RENDERER.scale);
  }
  
  if(drawtype==="stroke"){RENDERER.context.strokeStyle = color;RENDERER.context.stroke();}
  if(drawtype==="fill"){RENDERER.context.fillStyle = color;RENDERER.context.fill();}
  RENDERER.context.restore();
}