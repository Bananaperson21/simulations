///////////////////////////////////////////////////////////
// SIMULATION MANAGEMENT SCRIPT
///////////////////////////////////////////////////////////
var SIMULATIONS = {};

///////////////////////////////////////////////////////////
// SIMULATION SELECTION AND LOADING
///////////////////////////////////////////////////////////
SIMULATIONS.list = [];
SIMULATIONS.playing = 0;

SIMULATIONS.play = function (id){
  SIMULATIONS.playing = id;
  SIMULATIONS.list[id].init();
}

document.body.onload = function (){
  
  /* MODIFY HTML FOR SELECTION BUTTONS */
  let container = document.getElementById("simulations");
  let html = "";
  
  SIMULATIONS.list.forEach((simulation)=>{
    html += '<a onclick="SIMULATIONS.play('+simulation.simulationid+');">'+simulation.displayname+'</a>';
  });
  
  container.innerHTML = html;
  
  /* PLAY BOUNCY BALL SIMULATION AT START */
  SIMULATIONS.play(0);
  
};