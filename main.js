// 創造 img HTML 元素，並放入變數中
var bgImg = document.createElement("img");
// 設定這個元素的要顯示的圖片
bgImg.src = "images/map2.png";


// 創造 img HTML 元素，並放入變數中
var heroImg = document.createElement("img");
// 設定這個元素的要顯示的圖片
heroImg.src = "images/jason.gif";

// 創造 img HTML 元素，並放入變數中
var towerBtn = document.createElement("img");
// 設定這個元素的要顯示的圖片
towerBtn.src = "images/tower-btn.png";

// 創造 img HTML 元素，並放入變數中
var towerImg = document.createElement("img");
// 設定這個元素的要顯示的圖片
towerImg.src = "images/tower.png";

// 找出網頁中的 canvas 元素
var canvas = document.getElementById("game-canvas");
// 取得 2D繪圖用的物件
var ctx = canvas.getContext("2d");

var hero = {
	x:100,
	y:0
}

var FPS = 60;


var cursor = {x:0, y:0}; 
var isBuilding = false;
towerPos={x:0,y:0};

var cannonballImage = document.createElement("img");
cannonballImage.src = "images/cannon-ball.png";


function getUnitVector (srcX, srcY, targetX, targetY) {
    var offsetX = targetX - srcX;
    var offsetY = targetY - srcY;
    var distance = Math.sqrt( Math.pow(offsetX,2) + Math.pow(offsetY,2) );
    var unitVector = {
        x: offsetX/distance,
        y: offsetY/distance
    };
    return unitVector;
}

function Cannonball(tower){
	this.speed = 320;
	this.damage = 5 ;
	this.hitted = false;

	var aimedEnemy = enemies[tower.aimingEnemyId];

    this.x = tower.x+16;
    this.y = tower.y;
    this.direction = getUnitVector(this.x, this.y, aimedEnemy.x, aimedEnemy.y);
    this.move = function(){
		this.x += this.direction.x*this.speed/FPS;
		this.y += this.direction.y*this.speed/FPS;
		for(var i=0; i<enemies.length; i++){
			if( isCollided(
				enemies[i].x, 
				enemies[i].y, 
				this.x, this.y, 
				32,32
			)){
				this.hitted = true;
				enemies[i].hp -= this.damage;
				break;
			}
		}
	} 

	this.touchEnemy = function(){
		for(var i=0; i<enemies.length; i++){
			if( isCollided(
				enemies[i].x, 
				enemies[i].y, 
				this.x, this.y, 
				this.speed/FPS, this.speed/FPS
			)){
				this.hitted = true;
				enemies[i].hp -= this.damage;
			}
		}
	};
}
// 初始化：
var crosshairImg = document.createElement("img");
crosshairImg.src = "images/crosshair.png";

var cannonballs = [];

function isCollided ( pointX, pointY, targetX, targetY, targetWidth, targetHeight ) {
	if(     pointX >= targetX
	        &&  pointX <= targetX + targetWidth
	        &&  pointY >= targetY
	        &&  pointY <= targetY + targetHeight
	){
	        return true;
	} else {
	        return false;
	}
}

function tower(towerX,towerY){
	this.x = towerX;
	this.y = towerY;
	this.fireRate = 2;
	this.readyToShootTime = 1; // 還有幾秒就發射
	this.range = 96;
	this.aimingEnemyId = null;
	
	this.shoot = function(){
        var newCannonball = new Cannonball(this);
        cannonballs.push( newCannonball );
    };

	this.searchEnemy = function(){
		this.readyToShootTime -= 1/FPS;
		for(var i=0; i<enemies.length; i++){
			var distance = Math.sqrt( 
				Math.pow(this.x-enemies[i].x,2) + Math.pow(this.y-enemies[i].y,2) 
			);
			if (distance<=this.range) {
				this.aimingEnemyId = i;
				if (this.readyToShootTime<=0) {
                    this.shoot();
                    this.readyToShootTime = this.fireRate;
                }
				return;
			}
		}
		// 如果都沒找到，會進到這行，清除鎖定的目標
		this.aimingEnemyId = null;
	};
}

var towers = [];
var enemyPath = [
	{x:2 * 32,y:13 * 32},
	{x:2 * 32,y:9 * 32},
	{x:4 * 32,y:9 * 32},
	{x:4 * 32,y:12 * 32},
	{x:10 * 32,y:12 * 32},
	{x:10 * 32,y:13 * 32},
	{x:18 * 32,y:13 * 32},
	{x:18 * 32,y:9 * 32},
	{x:15 * 32,y:9 * 32},
	{x:15 * 32,y:10 * 32},
	{x:7 * 32,y:10 * 32},
	{x:7 * 32,y:7 * 32},
	{x:0 * 32,y:7 * 32}
]

function Enemy(){
	this.x = 0; 
	this.y = 480-64;
	this.speed = 64;
	this.direction = {x : 1,y : 0};
	this.pathDes = 0;
	this.isLive = true;
	this.hp = 10;
	this.move = function(){
		if( isCollided(
			enemyPath[this.pathDes].x, 
			enemyPath[this.pathDes].y, 
			this.x, this.y, 
			this.speed/FPS, this.speed/FPS
		)){
			this.goNextPath();
		}else{
			this.x += this.direction.x*this.speed/FPS;
			this.y += this.direction.y*this.speed/FPS;
		}
	};

	this.goNextPath = function(){
		this.x = enemyPath[this.pathDes].x;
		this.y = enemyPath[this.pathDes].y;
		this.pathDes+=1;
		if(this.pathDes >= enemyPath.length){
			this.hp = 0;
			window.HP -= 10;
		}else{
			this.direction = getUnitVector(
					this.x,
					this.y,
					enemyPath[this.pathDes].x,
					enemyPath[this.pathDes].y
				);
		}
	};
}

var point = 10;
var clock = 0 ;
var enemies = [];
enemies.push( new Enemy() );



var slimeImg = document.createElement("img");
slimeImg.src = "images/slime.gif";
var HP = 100;
function draw(){
	// 將背景圖片畫在 canvas 上的 (0,0) 位置
	ctx.drawImage(bgImg,0,0);
	ctx.drawImage(towerBtn, 590, 430, 50, 50 );
	ctx.drawImage(heroImg, hero.x, hero.y);


	if(isBuilding == true){
		towerPos.x = cursor.x - cursor.x % 32;
		towerPos.y = cursor.y - cursor.y % 32;
		ctx.drawImage(towerImg, towerPos.x, towerPos.y);
	}

	ctx.font = "24px Arial";
	ctx.fillStyle = "white";
	ctx.fillText( "HP:" + HP, 0 , 20 );
	ctx.fillText( "分數:" + point, 0 , 50 );

	for(var i = 0; i<enemies.length ; i++){
		if(enemies[i].hp <= 0){
			enemies.splice(i,1);
			point += 10;
			i-=1;
		}else{
			ctx.drawImage(slimeImg, enemies[i].x, enemies[i].y);
			enemies[i].move();
		}
	}

	for(var i = 0; i<towers.length ; i++){
		towers[i].searchEnemy();
		ctx.drawImage(towerImg, towers[i].x, towers[i].y);
		if ( towers[i].aimingEnemyId!=null ) {
		    var id = towers[i].aimingEnemyId;
		    ctx.drawImage( crosshairImg, enemies[id].x, enemies[id].y );
		}
	}

	for(var i = cannonballs.length-1;i>=0;i--){
		cannonballs[i].move();
		if(cannonballs[i].hitted == true){
			cannonballs.splice(i,1);
		}else{
			ctx.drawImage( 
				cannonballImage,cannonballs[i].x,cannonballs[i].y 
			);
		}
		
	}

	if( HP == 0){
		clearInterval(intervalID);
		ctx.font = "100px Arial";
		ctx.fillStyle = "RED";
		ctx.fillText( "U Lose", 150 , 300 );
	}
	if(clock % 80 == 0){
		var newEnemy = new Enemy();
		enemies.push(newEnemy);
	}
	clock++;

}

$( "#game-canvas" ).mousemove( function( event ) {
	cursor.x = event.offsetX;
	cursor.y = event.offsetY;
});

$( "#game-canvas" ).click( function( event ) {
	if(cursor.x >= 590 &&  cursor.y>= 430){
		if(isBuilding == true){
			isBuilding = false;
		}else{
			isBuilding = true;
		}
	}else if(isBuilding == true){
		isBuilding = false;
		newTower = new tower(towerPos.x,towerPos.y);
		towers.push(newTower);
	}
});

// 執行 draw 函式
setTimeout( draw, 1000);
var intervalID = setInterval(draw, 1000/FPS );




