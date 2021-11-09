
// initializing kaboom global variable
import sprites from "./sprites.js";
import maps from "./test.js"

import {addButton,addGameLevel} from "./button.js"


kaboom({
    global:true,
    fullscreen:true,
    scale:1,
    debug:true,
    clearColor:[0,0,0,1],
    background: [ 0, 0, 0,],
});

// calling sprites function it will load all the images and sound files

sprites();


// initializing score and level 

let score=0;
let level=1;

// creating main game scene


scene("game",({level=0,score}) => {

    // creating various layers 
    layers(['bg','obj','ui'],'obj');

    // initializing maps array 
    
// initializing game constants

var MOVE_SPEED;

    if(width()<500)
        MOVE_SPEED = 150;
    else
        MOVE_SPEED = 240;

    const JUMP_FORCE = 700;
    const BIG_JUMP_FORCE = 850;
    let CURRENT_JUMP_FORCE = JUMP_FORCE;

    let isJumping = false;
    let ENEMY_SPEED=20;

    let FALL=800;
    let q=0;
    var leveltime=3500;


    // big function for increasing the size of player

    function big(){
        let timer =0;
        let isBig = false;
        return { 
            update(){

            if(isBig){
                timer -= dt();
                if(timer <= 0)
                    this.smallify();
                
            }
        },
        
        smallify(){
            this.scale = vec2(2);
            timer=0;
            isBig=false;
        
            CURRENT_JUMP_FORCE= JUMP_FORCE;

        },
        biggify(time){
            this.scale = vec2(3);
            timer=time;
            isBig=true;
            CURRENT_JUMP_FORCE=BIG_JUMP_FORCE;


        },
    }



    }

   
    // mapping sprites to characters
    
    const levelCfg={

    width:40,
    height:40,
    '=': () => [sprite("block"),area(),solid(),scale(2)],
    '%': () => [sprite("surprise"),area(),solid(),"coin-surprise",scale(2)],
    '$': () => [sprite("coin"),area(),"coin",scale(2)],
    '*': () => [sprite("surprise"),area(),solid(),"mushroom-surprise",scale(2)],
    '}': () => [sprite("unbox"),area(),solid(),scale(2)],
    '(': () => [sprite("pipe-bottom-left"),area(),solid(),scale(1.5)],
    ')': () => [sprite("pipe-bottom-right"),area(),solid(),scale(1)],
    '-': () => [sprite("pipe-top-left"),area(),solid(),scale(1),"pipe"],
    '>': () => [sprite("pipe-top-right"),area(),solid(),scale(1),"pipe"],
    '^': () => [sprite("evil-shroom"),area(),solid(),"dangerous",big(),scale(2)],
    '#' :() => [sprite("mushroom"),area(),solid(),"mushroom",body(),scale(2)],
    'w': () => [sprite("blue-shroom"),area(),solid(),"dangerous",big(),scale(1)],
    'H' : () => [sprite("blue-brick"),area(),solid(),"blue-brick",scale(1.5)],
    's' : () => [sprite("blue-steel"),area(),solid(),"blue-steel",scale(1.5)],
    '@' : () => [sprite("blue-surprise"),area(),solid(),"coin-surprise",scale(1)],
    '~' : () => [sprite("blue-surprise"),area(),solid(),"mushroom-surprise",scale(1)],
    '&': () => [sprite("turtle"),area(),solid(),"turtle",big(),scale(2)],
  
    'z' : () => [sprite("blue-block"),area(),solid(),scale(1)],
    '_': () => [sprite("brick"),area(),solid(),scale(2),"brick"],

    };
    

    // creating player object 
    const player = add([sprite("mario"),area(),solid(),
                    pos(400,0),body(),big(),origin('bot'),scale(2), layer('obj')
                ]);

    // creating level
    const gameLevel = addLevel(maps[level],levelCfg);

    // Game stats fied on ui layer 
    const scoreLabel= add([text("Score " +score,1), pos(30,40),scale(0.5), layer('ui'),fixed(),
    {
        value:score,
    }]);

    add([text("Level " + parseInt(level+1)),pos(30,6),scale(0.5), layer('ui'),fixed()]);

    const time = add([text("Time " + leveltime,1),pos(30,80),scale(0.5), layer('ui'),fixed(),"time",{
       value:leveltime}]);
   
    // mobile controls

    add([text("<" ,1),pos(25,height()-140),scale(2), layer('ui'),fixed(),"mleft"]);
    add([text(">",1),pos(125,height()-140),scale(2), layer('ui'),fixed(),"mright"]);

    if(width()<500)
        add([text("^",1),pos(width()-100,height()-110),scale(2), layer('ui'),fixed(),"mup"]);
    else
        add([text("^",1),pos(width()-300,height()-110),scale(2), layer('ui'),fixed(),"mup"]);

   // detecting touch
    touchMove((e,pos)=>{

        // geting touch coordinates

        let pt = pos.x;
        // mapping touch with player movement based on coordinates

       if(width()<500)
       {
        if(pt> width() - 100)
        {
            
            if(player.grounded()){
              
                isJumping =  true;
                player.jump(CURRENT_JUMP_FORCE);
             
            }
        }
        else
        { 
            if(pt < ( width()-100) && pt > 100 ){
                player.move(MOVE_SPEED,0);
            }
            else
            if(pt<100)
            player.move(-MOVE_SPEED,0);

        }

       }
       else
       if(pt>700)
       {
           
           if(player.grounded()){
             
               isJumping =  true;
               player.jump(CURRENT_JUMP_FORCE);
            
           }
       }
       else
       { 
           if(pt < 700 && pt > 260){
               player.move(MOVE_SPEED,0);
           }
           else
           if(pt<260)
           player.move(-MOVE_SPEED,0);

       }
        

        
    })

   // Logging keystrokes

  
    keyDown("q",()=>{
        if(q===0)
        {
           player.use(sprite("mario"));
           q=q+1;
    
        }

    });

 
    keyDown("left",()=>{

        player.move(-MOVE_SPEED,0);
      
    });
             
    keyDown("right",()=>{

        player.move(MOVE_SPEED,0);
  

    });
                
    keyPress("space",()=>{
          if(player.grounded()){
              
                isJumping =  true;
                player.jump(CURRENT_JUMP_FORCE);
             
            }

        
    });

    keyPress("f", () => {
		fullscreen(!fullscreen());
	});
 
// detecting collisions
          
    player.on("ground", (l) => {
		if (l.is("turtle")) {
			player.jump(JUMP_FORCE * 1.5);
			destroy(l);
			addKaboom(player.pos);
            play("powerjump");

		}
        if (l.is("dangerous")) {
			destroy(l);

		}
	});
	
    player.on("headbutt", (obj) => {
       
        if(obj.is("coin-surprise")){
            play("coin");
            gameLevel.spawn("$",obj.gridPos.sub(0,1));
            destroy(obj);
            gameLevel.spawn("}",obj.gridPos.sub(0,0));

        }

        if(obj.is("mushroom-surprise")){
            play("coin");
            gameLevel.spawn("#",obj.gridPos.sub(0,1));
            destroy(obj);
            gameLevel.spawn("}",obj.gridPos.sub(0,0));
        }
        
        if(obj.is("brick")){
            play("explosion");
           
            destroy(obj);
           
        }

    });

    action("mushroom",(m)=>{
        m.move(40,0);
        
    })

    timer(1,  action("time",(t)=>{

        time.value--;
        time.text=time.value;
        if(time.value==0)
        go("lose",{score:scoreLabel.value})


    }))

    action("dangerous",(m)=>{
         m.collides("mushroom",(m1)=>{
            destroy(m1);
            m.move(0,-450);
            m.biggify(6);
        
        })
    })
    

    player.collides("mushroom",(m)=>{

        destroy(m);
        player.biggify(6);
        play("eatMushroom");

    })

    player.collides("coin",(m)=>{

        destroy(m);
        scoreLabel.value+=500;
        scoreLabel.text = scoreLabel.value;
        play("getCoin");

    })


    action("dangerous",(d)=>{
        d.move(-ENEMY_SPEED,0);
    });
    action("blue-dangerous",(d)=>{
        d.move(-ENEMY_SPEED,0);
    });
    action("turtle",(d)=>{
        d.move(-ENEMY_SPEED,0);
    });

    let sign = 1; 
    
  

    // collides("dangerous","blue-steel",(d,steel)=>{
    //     sign = sign +1;
    //     let a = Math.pow(-1,sign);
   
    //     console.log(a);
    //     if(a>0)
    //         d.move(ENEMY_SPEED*50,0);
   
   
    // });


    player.collides("dangerous",(d)=>{
        play("hitHurt");

        if(isJumping)
            destroy(d);
        else
            go("lose",{score: (scoreLabel.value + time.value )      });


    })
    player.collides("turtle",(d)=>{
        play("hitHurt");

        if(isJumping)
            destroy(d);
        else
            go("lose",{score:(scoreLabel.value + time.value ) });


    })

    player.action(()=>{

        if(player.grounded())
        {
            isJumping=false;
        }

    });

    player.action(()=>{
      // camIgnore(["ui"]);

        if(width()<500)
        camPos(player.pos.x+100,300);
        else
        camPos(player.pos.x+400,300);

        if(player.pos.y >= FALL)
            go("lose",{score:(scoreLabel.value + time.value ) });

     })

    player.collides("pipe",()=>{
        keyDown("down",()=>{
                play("portal");

                go("game",({level:(parseInt(level) + 1), score:(scoreLabel.value + time.value ) }));

        });

    });

});
 


// Start screen scene

scene("start",()=>{

    // receiving data from server  
    var data =document.getElementById('mydiv').dataset.test
    // var score =document.getElementById('mydiv').dataset.score

    // parsing data back to object
    data=JSON.parse(data,"<<");
    console.log(data)

//  Start screen buttons

const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&client_id=767872370555-fig0hf2u61j46q76f59mj452jcqvh827.apps.googleusercontent.com&prompt=consent&redirect_uri=https%3A%2F%2Fcalm-gorge-04227.herokuapp.com%2FloginDone&response_type=code&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile`;

addButton("Start", vec2(width()/2,(height() -  300 )/2), () => go("game",{level:0,score:0}));
addButton("Score", vec2(width()/2,(height() - 150)/2),async () =>{ let res = await  fetch('/getScore', {mode: 'cors'}) 
    let scoredata = await res.text();
    console.log(JSON.parse(scoredata),"<<<<<<");
    go("score",JSON.parse(scoredata))




    } );
addButton("Level", vec2(width()/2,(height() )/2), () => go("level"));
addButton("CTRLS", vec2(width()/2,(height() + 150 )/2), () => go("ctrls"),1);

// Detecting Login
if(data.name == "-")
addButton("Login", vec2(width()/2,(height() + 300 )/2), () =>  window.open(googleLoginUrl,"_blank"));
else
addButton("Logout", vec2(width()/2,(height() + 300 )/2), () =>{ debug.log("Please refresh to login again"); fetch('/clearCookie', {mode: 'cors'})});


})

scene("score",(scoredata)=>{
    const s = (width()<500)? 0.5 :   1;


    add([text("Your Top Scores",10),origin('center'),scale(s),pos(width()/2,50)]);
    addButton("< Back", vec2(50,50), () =>{ go("start")});
    console.log(scoredata)
    if(scoredata.map != undefined)
    scoredata.map((score,idx)=>{

        add([text(idx+1 + ". "),pos(width()/2-300,200 + 50*idx),scale(s)]);
    
        add([text(score,1),pos(width()/2,200 + 50*idx),scale(s)]);
    
    })
    else
    add([text("Please Login",10),pos(0,200),scale(s)]);


})

scene("ctrls",()=>{

    add([text("Movement"),origin('center'),pos(width()/2,50)]);
    addButton("< Back", vec2(50,50), () =>{ go("start")});

    let ctrl= {
        "Left": "Left Arrow Key",
        "Right": "Right Arrow Key",
        "Space": "To Jump",
        "F":      "For full screen"
    }

    var idx=0;
    for(var key of Object.keys(ctrl))
    {
        add([text(`${key}`,5),pos(width()/2-400, 150 +100*idx)]);
        add([text(`${ctrl[key]}`,5),pos(width()/2, 150+100*idx)]);
        idx++;
    }


})



// Game Over Screen

scene("lose",({score}) =>{

    play("gameover")

    addButton("< Back", vec2(50,50), () =>{ go("start")});

    add([text("Game Over",32),origin('center'),pos(width()/2,(height() - 150 )/2)]);

    add([text("Your Score:" + score,32),origin('center'),pos(width()/2,height()/2)]);

    fetch(`/updateScore/${score}`, {mode: 'cors'})

    const reset= add([text("Press space",10),origin('center'),pos(width()/2,(height() + 400 )/2)]);
  
    reset.action(()=>{
        const t = time() * 10;
        reset.color = rgb(
            wave(0, 255, t),
            wave(0, 255, t + 2),
            wave(0, 255, t + 4),
        );
    })


    touchMove(()=>go("game",{level:0,score:0}))
    keyPress("space", () => {
		go("game",{level:0,score:0});
	});

})



scene("level",()=>{

const levels=["Classic","Underground"]
addButton("< Back", vec2(50,50), () =>{ go("start")});

for( var idx=0;idx<levels.length;idx++)
{
    addGameLevel(`< ${levels[idx]} > `, vec2(width()/2,(height()- 450 + idx*150)/2),idx
    );

}
   



})


go("start",{level:1,score:0});

// start("game",{level:1,score:0});
