//Aliases
var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite,
    Graphics = PIXI.Graphics,
    Text = PIXI.Text;
//Create a Pixi stage and renderer and add the
//renderer.view to the DOM
var canvasWidth = document.getElementById("game-canvas").width;
var canvasHeight = document.getElementById("game-canvas").height;

var stage = new Container();

var renderer = new autoDetectRenderer(canvasWidth, canvasHeight, { view: document.getElementById("game-canvas") });
//renderer.backgroundColor = 0x007DA2;

var diameter = 20,
    fly,
    frog,
    tongue,
    lilypad,
    menu,
    count = 0,
    text,
    startClock = false,
    state,
    countdown,
    requestID,
    destX,
    destY,
    eat = false,
    menuText,
    menuScore,
    menuButton,
    buttonText,
    ribbit,
    lickSound;

PIXI.loader
  .add(["images/tongue.png", "images/frog.png", "images/lilypad.png", "images/flyone.png", "images/flytwo.png", "images/pond.png", "images/background.png"])
  .load(setup);
//setup();
/*
function loadSounds() {
    sounds.load(["frogRibbit.wav"]);
    sounds.whenLoaded = setup;
}
*/
function setup() {
    /*
    frog = new Graphics();
    frog.beginFill(0x009900);
    frog.drawRect(0, 0, 30, 30);
    frog.endFill();
    background = new Graphics();
    background.beginFill(0x007DA2);
    background.drawRect(0, 0, 375, 164);
    */

    //ribbit = sounds["sounds/frogRibbit.wav"];
    //console.log(ribbit);
    ribbit = document.getElementById("ribbit");
    lickSound = document.getElementById("lickSound");

    menu = new Graphics();
    menu.beginFill(0x1D6616, 0.7);
    menu.drawRoundedRect(0, 0, 275, 459, 15);
    menu.endFill();
    menu.x = 50;
    menu.y = 50;

    menuButton = new Graphics();
    menuButton.beginFill(0xFFFFFF, 0.7);
    menuButton.drawRoundedRect(0, 0, 131, 60, 15);
    menuButton.endFill();
    menuButton.x = 122;
    menuButton.y = 420;

    buttonText = new Text("Play!", { fontFamily: 'Roboto', fontSize: 20, fill: 0x1D6616, align: 'center' });
    buttonText.anchor.x = 0.5;
    buttonText.x = 187.5;
    buttonText.y = 437;

    background = new Sprite(resources["images/background.png"].texture);
    background.x = 0;
    background.y = 450;

    pond = new Sprite(resources["images/pond.png"].texture);
    pond.x = 0;
    pond.y = 0;

    frog = new Sprite(resources["images/frog.png"].texture);
    frog.scale.x = 0.10;
    frog.scale.y = 0.10;
    frog.anchor.x = 0.5;
    frog.x = 187.5;
    frog.y = 450;
    //x=172.5, y=616
    
    lilypad = new Sprite(resources["images/lilypad.png"].texture);
    lilypad.scale.x = 0.10;
    lilypad.scale.y = 0.10;
    lilypad.anchor.x = 0.5;
    lilypad.x = 187.5;
    lilypad.y = 450;
    /*
    fly = new Graphics();
    fly.beginFill(0xFFFFFF);
    fly.drawCircle(0, 0, diameter/2);
    fly.endFill();

    */
    var flyImages = ["images/flyone.png", "images/flytwo.png"];
    var textureArray = [];

    for (var i = 0; i < 2; i++) {
        var texture = PIXI.Texture.fromImage(flyImages[i]);
        textureArray.push(texture);
    }
    fly = new PIXI.extras.MovieClip(textureArray);
    fly.animationSpeed = 0.15;
    fly.play();

    //fly = new Sprite(resources["flyone.png"].texture);
    fly.scale.x = 0.3;
    fly.scale.y = 0.3;

    resetFly();

    fly.interactive = true;
    fly.on("mouseup", eatFly, false);
    fly.on("touchend", eatFly, false);

    stage.hitArea = new PIXI.Rectangle(0, 0, document.getElementById("game-canvas").width, document.getElementById("game-canvas").height);
    stage.interactive = true;

    //document.getElementById("game-canvas").addEventListener("click", tongueRotation, false);
    //document.getElementById("game-canvas").addEventListener("touchstart", tongueRotation, false);
    stage.on("mouseup", tongueRotation, false);
    stage.on("touchend", tongueRotation, false);

    menuButton.interactive = true;
    menuButton.on("mousedown", animateButton, false);
    menuButton.on("touchstart", animateButton, false);
    menuButton.on("mouseup", resetGame, false);
    menuButton.on("touchend", resetGame, false);

    frog.interactive = true;
    frog.on("mouseup", playRibbitSound, false);
    frog.on("touchend", playRibbitSound, false);

    tongue = new Sprite(resources["images/tongue.png"].texture);
    tongue.scale.x = 0.80;
    tongue.scale.y = 0.80;
    tongue.anchor.x = 0.025;
    tongue.anchor.y = 0.5;
    resetTongue();
    //tongue.scale.x = 0.2;
    //tongue.scale.y = 0.2;
    //tongueRotation();

    state = pause;

    text = new Text("Flies Caught: 0", { fontFamily: 'Roboto', fontSize: 20, fill: 0x1D6616, align: 'center' });
    timeText = new Text("30:00", { fontFamily: 'Roboto', fontSize: 20, fill: 0x1D6616, align: 'center' });
    text.x = 220;
    text.y = 12;
    //text.setText("Touch to begin!");
    timeText.x = 6;
    timeText.y = 12;

    menuText = new Text("Little Mads' Lily Pad", { fontFamily: 'Roboto', fontSize: 24, fill: 0xFFFFFF, align: 'center' });
    menuText.anchor.x = 0.5;
    menuText.x = 187.5;
    menuText.y = 100;

    menuScore = new Text("Touch the fly to eat it!\n\n Catch as many flies as you\n can in thirty seconds!", { fontFamily: 'Roboto', fontSize: 20, fill: 0xFFFFFF, align: 'center' });
    menuScore.anchor.x = 0.5;
    menuScore.x = 187.5;
    menuScore.y = 150;
    //displayMenu();

    stage.addChild(pond, tongue, background, lilypad, fly, frog, text, timeText, menu, menuText, menuScore, menuButton, buttonText);
    gameLoop();
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function eatFly() {
    if (tongue.vx === 0 && tongue.vy === 0) {
        eat = true;
    }

    //tongueRotation();
    //frog.height += 50;
}

function gameLoop() {
    requestID = requestAnimationFrame(gameLoop);

    state();

    renderer.render(stage);
}

function setTimer() {
    countdown =  Date.now() + 29999;
    //console.log(countdown);
}

function pause() {
    ;
}

function timer() {
    var currentTime = countdown - Date.now();

    //if (printCurrentTime === "00:00") {
    if (currentTime < 0) {
        timeText.setText("00:00");
        gameOver();
        //cancelAnimationFrame(requestID);
        return;
    }

    var sec = Math.floor(currentTime / 1000) + "";
    var msec = Math.floor((currentTime % 1000)/10) + "";

    if (sec.length === 1) 
        sec = "0" + sec;

    if (msec.length === 1) 
        msec = "0" + msec;

    var printCurrentTime = sec + ":" + msec;
    timeText.setText(printCurrentTime);
}

function play() {
    timer();

    tongue.x += tongue.vx;
    tongue.y += tongue.vy;
    fly.x += fly.vx;
    fly.y += fly.vy;

    if (tongue.y < destY) {
        if (eat) {
            fly.vx = -tongue.vx;
            fly.vy = -tongue.vy;
        }
        tongue.vx = -tongue.vx;
        tongue.vy = -tongue.vy;
    }
    else if (tongue.y > frog.y) {
        if (eat) {
            //fly.x = randomInt(diameter, canvasWidth - diameter);
            //fly.y = randomInt(diameter, frog.y - diameter);
            count++;
            text.setText("Flies Caught: " + count);
            resetFly();
        }
        //sounds["sounds/frogRibbit.wav"].play();
        resetTongue();
    }
}

function gameOver() {
    state = pause;
    menuText.setText("Game Over!");
    menuScore.setText("Score: " + count);
    buttonText.setText("Play Again!");
    displayMenu();
    //alert("GAME OVER!");
}

function tongueRotation(event) {
    var tempY = event.data.global.y;
    if (tongue.vx === 0 && tongue.vy === 0 && tempY < 420) {
        destX = event.data.global.x;
        destY = tempY;
        if (startClock) {
            setTimer();
            state = play;
            startClock = false;
        }

        var opp, adj;
        opp = tongue.y - destY;

        if (tongue.x > destX) {
            adj = tongue.x - destX;
            tongue.rotation = Math.atan(opp / adj);
            tongue.vx = -adj * 0.05;
        }
        else if (tongue.x < destX) {
            adj = destX - tongue.x;
            tongue.rotation = Math.PI - Math.atan(opp / adj);
            tongue.vx = adj * 0.05;
        }
        else {
            tongue.rotation = Math.PI / 2;
            tongue.vx = 0;
        }

        tongue.vy = -opp * 0.05;
        tongue.visible = true;
        playLickSound();
    }
}

function resetFly() {
    fly.x = randomInt(diameter, canvasWidth - diameter);
    fly.y = randomInt(diameter, frog.y - 70);
    fly.vx = 0;
    fly.vy = 0;
    eat = false;
}

function resetTongue() {
    //tongue.rotation = Math.PI / 2;
    tongue.x = 186;
    tongue.y = 449;
    //x =186 y= 615
    tongue.vx = 0;
    tongue.vy = 0;
    tongue.visible = false;
}

function displayMenu() {
    menu.visible = !menu.visible;
    menuText.visible = !menuText.visible;
    menuScore.visible = !menuScore.visible;
    menuButton.visible = !menuButton.visible;
    buttonText.visible = !buttonText.visible;
}

function resetGame() {
    menuButton.clear();
    menuButton.beginFill(0xFFFFFF, 0.7);
    menuButton.drawRoundedRect(0, 0, 131, 60, 15);
    menuButton.endFill();
    buttonText.y = buttonText.y - 2;
    menuButton.y = menuButton.y - 2;
    count = 0;
    resetFly();
    resetTongue();
    displayMenu();
    text.setText("Flies Caught: 0");
    timeText.setText("30:00");
    startClock = true;
    state = pause;
}

function playLickSound() {
    lickSound.play();
}

function playRibbitSound() {
    ribbit.play();
}

function animateButton() {
    menuButton.clear();
    menuButton.beginFill(0x000000, 0.7);
    menuButton.drawRoundedRect(0, 0, 131, 60, 15);
    menuButton.endFill();
    buttonText.y = buttonText.y + 2;
    menuButton.y = menuButton.y + 2;
}
/*
function timer() {

    if (time == 0) {
        gameOver();
    }
    else {
        time--;
        timeText.setText(time);
    }
    setTimeout(timer, 1);
}



loader.add("cat.png").load(setup);

function setup() {
  cat = new Sprite(resources["cat.png"].texture);
  cat.vx = 0;
  cat.vy = 0;
  stage.addChild(cat);

  var left = keyboard(37),
      up = keyboard(38),
      right = keyboard(39),
      down = keyboard(40);

  left.press = function() {
    cat.vx = -5;
  }

  left.release = function() {
    cat.vx = 0;
  }

  up.press = function() {
    cat.vy = -5;
  }

  up.release = function() {
    cat.vy = 0;
  }

  right.press = function() {
    cat.vx = 5;
  }

  right.release = function() {
    cat.vx = 0;
  }

  down.press = function() {
    cat.vy = 5;
  }

  down.release = function() {
    cat.vy = 0;
  }

  state = play;
  gameLoop();

}

function gameLoop() {
  requestAnimationFrame(gameLoop);

  state();

  renderer.render(stage);
}

function play() {
  
  cat.x += cat.vx;
  cat.y += cat.vy;
  
}

//My keyboard class

function keyboard(keyCode) {
  var key = {};
  key.code = keyCode;
  key.down = false;
  key.press = undefined;
  key.release = undefined;

  key.downEvent = function(event) {
    if (event.keyCode === keyCode) {
      if (!key.down) {
        key.press();
      }
      key.down = true;
    }
    event.preventDefault();
  }

  key.upEvent = function(event) {
    if (event.keyCode === keyCode) {
      if (key.down) {
        key.release();
      }
      key.down = false;
    }
    event.preventDefault;
  }

  window.addEventListener("keydown", key.downEvent.bind(key), false);
  window.addEventListener("keyup", key.upEvent.bind(key), false);

  return key;
}

function keyboard(keyCode) {
  var key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };

  //The `upHandler`
  key.upHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };

  //Attach event listeners
  window.addEventListener(
    "keydown", key.downHandler.bind(key), false
  );
  window.addEventListener(
    "keyup", key.upHandler.bind(key), false
  );
  return key;
}
*/
