
kaboom({
	global: true,
	fullscreen: true,
	scale: 2,
	clearColor: [0, 0, 0, 1],
});

// load assets
loadSprite("guy", "http://127.0.0.1:5500//images//mario.png");
loadSprite("spike", "http://127.0.0.1:5500//images//mushroom.png");
loadSprite("steel", "http://127.0.0.1:5500//images//brick.png");
loadSprite("prize", "http://127.0.0.1:5500//images//surprise.png");
loadSprite("apple", "http://127.0.0.1:5500//images//mushroom.png");
loadSprite("coin", "http://127.0.0.1:5500//images//coin.png");

scene("main", () => {

	gravity(32);
	// define some constants
	const JUMP_FORCE = 320;
	const MOVE_SPEED = 120;
	const FALL_DEATH = 640;

	// define layers, draw "ui" on top, and "game" is the default layer
	
	// camera will ignore "ui" layer

	// add level to scene
 addLevel([
		"           $    ",
		"  %      ====   ",
		"                ",
		"                ",
		"       ^^       ",
		"=================",
	], {
		// TODO: derive grid size from sprite size instead of hardcode
		// grid size
		width: 20,
		height: 20,
		// define each object as a list of components
		"=": ()=> [
			sprite("steel"), solid(),
			 area(),
           
             origin("bot"), 
		],
		"$":()=> [
			sprite("coin"),
		 area(),solid(),origin("bot"),

		],
		"%":()=> [
			sprite("prize"),
			 area(),solid(),origin("bot"),

		],
		"^":()=> [
			sprite("spike"), 
			area(),origin("bot"),

		],
		"#":()=> [
			sprite("apple"),origin("bot"),
	 area()

		],
	})

	// add score counter obj
	// const score = add([
	// 	text("0"),
	// 	pos(6, 6),
	
	// 	{
	// 		value: 0,
	// 	}, 
	// ]);

	// define a custom component that handles player grow big logic
	function big() {
		let timer = 0;
		let isBig = false;
		return {
			update() {
				if (isBig) {
					timer -= dt();
					if (timer <= 0) {
						this.smallify();
					}
				}
			},
			isBig() {
				return isBig;
			},
			smallify() {
				this.scale = vec2(1);
				timer = 0;
				isBig = false;
			},
			biggify(time) {
				this.scale = vec2(2);
				timer = time;
				isBig = true;
			},
		};
	}

	// define player object
	const player = add([
		sprite("guy"),
		pos(0, 0),
		scale(1),
		// makes it fall to gravity and jumpable
		body(),
		// as we defined above
		big(),		 origin("bot"),

	]);

    player.action(() => {
		// center camera to player
		
    })

	// action() runs every frame
	// player.action(() => {
	// 	// center camera to player
	// 	camPos(player.pos);
	// 	// check fall death
	// 	if (player.pos.y >= FALL_DEATH) {
	// 		// go("lose", { score: score.value, });
	// 	}
	// });  

	// if player collides with any obj with "dangerous" tag, lose
	// collides(player,"dangerous", () => {
    //     console.log("hit")
	// 	// go("lose", { score: score.value, });
	// });

	// // grow an apple if player's head bumps into an obj with "prize" tag
	// player.on("headbump", (obj) => {
	// 	if (obj.is("prize")) {
	// 		level.spawn("#", obj.gridPos.sub(0, 1));
	// 	}
	// });

	// // player grows big collides with an "apple" obj
	// collides(player,"apple", (a) => {
	// 	destroy(a);
	// 	// as we defined in the big() component
	// 	player.biggify(3);
	// });

	// // increase score if meets coin
	// collides(player,"coin", (c) => {
	// 	destroy(c);
	// 	score.value++;
	// 	score.text = score.value;
	// });

	// jump with space
	keyPress("space", () => {
		// these 2 functions are provided by body() component
		if (player.grounded()) {
			player.jump(JUMP_FORCE);
		}
	});

	keyDown("left", () => {
		player.moveTo(-MOVE_SPEED, 0);
	});

	keyDown("right", () => {
		player.moveTo(MOVE_SPEED, 0);
	});
});


scene("lose", ({ score }) => {
	add([
		text(score, 32),
		origin("center"),
		pos(width() / 2, height() / 2),
	]);
});

go("main");
