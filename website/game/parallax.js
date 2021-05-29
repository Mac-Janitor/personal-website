// Aliases
var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    Texture = PIXI.Texture,
    Sprite = PIXI.Sprite,
    TilingSprite = PIXI.extras.TilingSprite;

var canvasWidth = document.getElementById("game-canvas").width;
var canvasHeight = document.getElementById("game-canvas").height;

var stage = new Container();

var renderer = new autoDetectRenderer(canvasWidth, canvasHeight, {view:document.getElementById("game-canvas")});

var farTexture = Texture.fromImage("bg-far.png");
farSprite = new TilingSprite(farTexture, 512, 256);
//farSprite = new Sprite(farTexture);
farSprite.position.x = 0;
farSprite.position.y = 0;
farSprite.tilePosition.x = 0;
farSprite.tilePosition.y = 0;
stage.addChild(farSprite);

var midTexture = Texture.fromImage("bg-mid.png");
midSprite = new TilingSprite(midTexture, 512, 256);
//midSprite = new Sprite(midTexture);
midSprite.x = 0;
midSprite.y = 128;
midSprite.tilePosition.x = 0;
midSprite.tilePosition.y = 0;
stage.addChild(midSprite);

update();
//requestAnimationFrame(update);

function update() {
  farSprite.tilePosition.x -= 0.128;
  midSprite.tilePosition.x -= 0.64;

  renderer.render(stage);

  requestAnimationFrame(update);
}