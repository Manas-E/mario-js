

kaboom({
    global:true,
    fullscreen:true,
    scale:1,
    debug:true,
    clearColor:[0,0,0,1],
    background: [ 0, 0, 0,],
});








// sprites for level 1

loadSprite("coin","http://127.0.0.1:5500//images//coin.png");
loadSprite("evil-shroom","http://127.0.0.1:5500//images//enemy.png");
loadSprite("brick","http://127.0.0.1:5500//images//brick.png");
loadSprite("mario","http://127.0.0.1:5500//images//mario.png");
loadSprite("mushroom","http://127.0.0.1:5500//images//mushroom.png");
loadSprite("block","http://127.0.0.1:5500//images//block.png");
loadSprite("pipe-top-left","http://127.0.0.1:5500//images//ptl.png");
loadSprite("pipe-top-right","http://127.0.0.1:5500//images//ptr.png");
loadSprite("pipe-bottom-left","http://127.0.0.1:5500//images//pbl.png");
loadSprite("pipe-bottom-right","http://127.0.0.1:5500//images//pbr.png");
loadSprite("unbox","http://127.0.0.1:5500//images//unbox.png");
loadSprite("surprise","http://127.0.0.1:5500//images//surprise.png");
loadSprite("mario1","http://127.0.0.1:5500//images//mariol1.png");
loadSprite("mario2","http://127.0.0.1:5500//images//mariol2.png");
loadSprite("turtle","http://127.0.0.1:5500//images//inturtle.png");






// sprites for level 2

loadSprite("blue-brick","http://127.0.0.1:5500//images//blue-brick.png");
loadSprite("blue-shroom","http://127.0.0.1:5500//images//blue-shroom.png");
loadSprite("blue-steel","http://127.0.0.1:5500//images//blue-steel.png");
loadSprite("blue-surprise","http://127.0.0.1:5500//images//blue-surprise.png");
loadSprite("blue-block","http://127.0.0.1:5500//images//blue-block.png");


loadSound("powerjump", "sounds/powerjump.wav");
loadSound("hitHurt","sounds/hitHurt.wav");
loadSound("portal","sounds/portal.wav");
loadSound("eatMushroom","sounds/eatMushroom.wav");

loadSound("coin","sounds/coin.wav");
loadSound("laser","sounds/laser.wav");
loadSound("powerup","sounds/powerup.wav");
loadSound("surprise","sounds/surprise.wav");

loadSound("getCoin","sounds/getCoin.wav");





let score=0;
let level=1;


scene("game",({level,score}) => {

    layers(['bg','obj','ui'],'obj');

    const maps=[[
    '                                                         ',
    '                                                         ',
    '                                                         ',
    
    '                                                         ',
    '                                                         ',
    '                                                         ',
    '       %     =*==%=                                                  ',
    '                                                               ',
    '                                                         ',
    '                          &    &    ->                 ',
    '                        ^  ^ ^  ^   ()                             ',
    '=========================================     =============================',
],
[ 
'                                                          H',
'H                                                         H',
'H                                                         H',

'H                                                         H',
'H                                                         H',
'H                                                         H',
'H           ~@@@@@                                        H',
'H                                           s               H',
'H                                        s  s s             H',
'H                                     s  s  s s   s      -> H',
'H                          www     s  s  s  s s w s      () H',

'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz  z  z  z zzzzzzzzzzzzz',]
];
    

    const MOVE_SPEED = 240;
    const JUMP_FORCE = 700;
    const BIG_JUMP_FORCE = 850;
    let CURRENT_JUMP_FORCE = JUMP_FORCE;

    let isJumping = false;
    let ENEMY_SPEED=20;

    let FALL=800;
    let q=0;
    let counter = 0;
    
    let a=0;


    function big(){
        let timer =0;
        let isBig = false;
        return { update(){

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



        
        
        
        



    };



    const player = add([sprite("mario"),area(),solid(),
                    pos(100,0),body(),big(),origin('bot'),scale(2), layer('obj')
                ]);


    var k=0;
    const gameLevel = addLevel(maps[0],levelCfg);

    const scoreLabel= add([text("Score " +score,1), pos(30,40),scale(0.5), layer('ui'),
    {
        value:score,
    }]);

    add([text("level " + level,1),pos(30,6),scale(0.5), layer('ui')]);
   
    keyDown("q",()=>{
        if(q===0)
        {

         console.log("ok",q);
    
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

      {
            if(player.grounded()){
              
                isJumping =  true;
                player.jump(CURRENT_JUMP_FORCE);
             
            }

        }
    });

    keyPress("f", () => {
		fullscreen(!fullscreen());
	});
          
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
        

    });

    action("mushroom",(m)=>{
        m.move(40,0);
        
    })

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
        scoreLabel.value++;
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
    
    // action("blue-dangerous",(d)=>{
    //     d.collides("blue-steel",()=>{
            //  sign = sign +1;
            //  let a = Math.pow(-1,sign);
        
            //  console.log(a);
    //     })
       
    //     d.move( Math.pow(-1,sign)* ENEMY_SPEED,0);
    // });

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
            go("lose",{score:scoreLabel.value});


    })
    player.collides("turtle",(d)=>{
        play("hitHurt");

        if(isJumping)
            destroy(d);
        else
            go("lose",{score:scoreLabel.value});


    })

    player.action(()=>{

        if(player.grounded())
        {
            isJumping=false;


        }

    });

    player.action(()=>{

        
        // camIgnore(["ui"]);

        camPos(player.pos.x+500,300);

        if(player.pos.y >= FALL)
            go("lose",{score:scoreLabel.value});


    })

    player.collides("pipe",()=>{
        keyDown("down",()=>{
                play("portal");

                go("game",({level:(level + 1), score:scoreLabel.value}));

        });

    });
    shader();

});
 
function addButton(txt, p, f,size=4) {

    const btn = add([
        text(txt, size),
        pos(p),
        area({ cursor: "pointer", }),
        scale(1),
        origin("center"),
    ]);

    btn.clicks(f);

    btn.hovers(() => {
        const t = time() * 10;
        btn.color = rgb(
            wave(0, 255, t),
            wave(0, 255, t + 2),
            wave(0, 255, t + 4),
        );
        btn.scale = vec2(1.2);
    }, () => {
        btn.scale = vec2(1);
        btn.color = rgb();
    });

}


scene("start",()=>{

   

addButton("Start", vec2(width()/2,(height() - 200 )/2), () => go("game",{level:1,score:0}));


addButton("Score", vec2(width()/2,height()/2), () => debug.log("a"));
addButton("Level", vec2(width()/2,(height() + 100 )/2), () => debug.log("a"));

// addButton("Login", vec2(width()/2,(height() -100 )/2), () => fetch('/auth/google', {mode: 'cors'}));
addButton("Instructions", vec2(width()/2,(height() +200 )/2), () => debug.log("a"),1);
addButton("Rankings", vec2(width()/2,(height() + 350 )/2), () => debug.log("a"),1);


})

scene("lose",({score}) =>{

    add([text("Game Over",32),origin('center'),pos(width()/2,(height() - 150 )/2)]);

    add([text("Your Score:" + score,32),origin('center'),pos(width()/2,height()/2)]);
    const reset= add([text("Press space",10),origin('center'),pos(width()/2,(height() + 400 )/2)]);
  
    reset.action(()=>{
        const t = time() * 10;
        reset.color = rgb(
            wave(0, 255, t),
            wave(0, 255, t + 2),
            wave(0, 255, t + 4),
        );
    })



    keyPress("space", () => {
		go("game",{level:1,score:0});
	});

})






go("game",{level:1,score:0});

// start("game",{level:1,score:0});
