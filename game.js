

kaboom({
    global:true,
    fullscreen:true,
    scale:1,
    debug:true,
    clearColor:[0,0,0,1],
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




// sprites for level 2

loadSprite("blue-brick","http://127.0.0.1:5500//images//blue-brick.png");
loadSprite("blue-shroom","http://127.0.0.1:5500//images//blue-shroom.png");
loadSprite("blue-steel","http://127.0.0.1:5500//images//blue-steel.png");
loadSprite("blue-surprise","http://127.0.0.1:5500//images//blue-surprise.png");
loadSprite("blue-block","http://127.0.0.1:5500//images//blue-block.png");


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
    '                                      ->                 ',
    '                        ^ ^ ^ ^   ^   ()                             ',
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
    const JUMP_FORCE = 500;
    const BIG_JUMP_FORCE = 650;
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
        '=': [sprite("block"),solid(),scale(2)],
        '%': [sprite("surprise"),solid(),"coin-surprise",scale(2)],
        '$': [sprite("coin"),"coin",scale(2)],
        '*': [sprite("surprise"),solid(),"mushroom-surprise",scale(2)],
        '}': [sprite("unbox"),solid(),scale(2)],
        '(': [sprite("pipe-bottom-left"),solid(),scale(1.5)],
        ')': [sprite("pipe-bottom-right"),solid(),scale(1)],
        '-': [sprite("pipe-top-left"),solid(),scale(1),"pipe"],
        '>': [sprite("pipe-top-right"),solid(),scale(1),"pipe"],
        '^': [sprite("evil-shroom"),solid(),"dangerous",big(),scale(2)],
        '#' : [sprite("mushroom"),solid(),"mushroom",body(),scale(2)],
        'w': [sprite("blue-shroom"),solid(),"dangerous",big(),scale(1)],
        'H' : [sprite("blue-brick"),solid(),"blue-brick",scale(1.5)],
        's' : [sprite("blue-steel"),solid(),"blue-steel",scale(1.5)],
        '@' : [sprite("blue-surprise"),solid(),"coin-surprise",scale(1)],
        '~' : [sprite("blue-surprise"),solid(),"mushroom-surprise",scale(1)],
       
        'z' : [sprite("blue-block"),solid(),scale(1)],



        
        
        
        



    };



    const player = add([sprite("mario"),solid(),
                    pos(30,0),body(),big(),origin('bot'),scale(2)
                ]);


    var k=0;
    const gameLevel = addLevel(maps[level],levelCfg);

    const scoreLabel= add([text(score), pos(30,25),scale(2), layer('ui'),
    {
        value:score,
    }]);

    add([text("level " + level),pos(30,6),scale(2), layer('ui')]);


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

          

    player.on("headbump", (obj) => {
        if(obj.is("coin-surprise")){
            gameLevel.spawn("$",obj.gridPos.sub(0,1));
            destroy(obj);
            gameLevel.spawn("}",obj.gridPos.sub(0,0));
        }

        if(obj.is("mushroom-surprise")){
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

    })

    player.collides("coin",(m)=>{

        destroy(m);
        scoreLabel.value++;
        scoreLabel.text = scoreLabel.value;

    })


    action("dangerous",(d)=>{
        d.move(-ENEMY_SPEED,0);
    });
    action("blue-dangerous",(d)=>{
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

    collides("dangerous","blue-steel",(d,steel)=>{
        sign = sign +1;
        let a = Math.pow(-1,sign);
   
        console.log(a);
        if(a>0)
            d.move(ENEMY_SPEED*50,0);
   
   
    });


    player.collides("dangerous",(d)=>{

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

        
        camIgnore(["ui"]);

        camPos(player.pos.x+500,300);

        if(player.pos.y >= FALL)
            go("lose",{score:scoreLabel.value});


    })

    player.collides("pipe",()=>{
        keyDown("down",()=>{
                go("game",({level:(level + 1), score:scoreLabel.value}));

        });

    });

});


scene("lose",({score}) =>{

    add([text("Game Over",32),origin('center'),pos(width()/2,(height() - 100 )/2)]);

    add([text("Your Score :" + score,32),origin('center'),pos(width()/2,height()/2)]);
    add([text("Game Over",32),origin('center'),pos(width()/2,(height() - 100 )/2)]);

})

scene("win",)


start("game",{level:1,score:0});