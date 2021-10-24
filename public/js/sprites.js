
const sprites = ()=>{


// sprites for level 1

loadSprite("coin","images//coin.png");
loadSprite("evil-shroom","images//enemy.png");
loadSprite("brick","images//brick.png");
loadSprite("mario","images//mario.png");
loadSprite("mushroom","images//mushroom.png");
loadSprite("block","images//block.png");
loadSprite("pipe-top-left","images//ptl.png");
loadSprite("pipe-top-right","images//ptr.png");
loadSprite("pipe-bottom-left","images//pbl.png");
loadSprite("pipe-bottom-right","images//pbr.png");
loadSprite("unbox","images//unbox.png");
loadSprite("surprise","images//surprise.png");
loadSprite("mario1","images//mariol1.png");
loadSprite("mario2","images//mariol2.png");
loadSprite("turtle","images//inturtle.png");



// sprites for level 2

loadSprite("blue-brick","images//blue-brick.png");
loadSprite("blue-shroom","images//blue-shroom.png");
loadSprite("blue-steel","images//blue-steel.png");
loadSprite("blue-surprise","images//blue-surprise.png");
loadSprite("blue-block","images//blue-block.png");


loadSound("powerjump", "sounds/powerjump.wav");
loadSound("hitHurt","sounds/hitHurt.wav");
loadSound("portal","sounds/portal.wav");
loadSound("eatMushroom","sounds/eatMushroom.wav");

loadSound("coin","sounds/coin.wav");
loadSound("laser","sounds/laser.wav");
loadSound("powerup","sounds/powerup.wav");
loadSound("surprise","sounds/surprise.wav");

loadSound("getCoin","sounds/getCoin.wav");
loadSound("explosion","sounds/explosion.wav");
loadSound("gameover","sounds/gameover.wav");

}




export default sprites;
