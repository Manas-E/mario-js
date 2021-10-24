
// button function for creating buttons 

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





function addGameLevel(txt, p,idx,size=4) {


    const level =  idx;
    const btn = add([
        text(txt, size),
        pos(p),
        area({ cursor: "pointer", }),
        scale(1),
        origin("center"),
    ]);

    btn.clicks(()=>{
       go("game",{level:level,score:0});
    })


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


export { addButton,addGameLevel }