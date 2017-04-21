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
var tower = document.createElement("img");
// 設定這個元素的要顯示的圖片
tower.src = "images/tower.png";

// 找出網頁中的 canvas 元素
var canvas = document.getElementById("game-canvas");
// 取得 2D繪圖用的物件
var ctx = canvas.getContext("2d");

var hero = {
	x:0,
	y:0
}

var cursor = {x:0, y:0}; 
var isBuilding = false;
towerPos={x:0,y:0}

function draw(){
	// 將背景圖片畫在 canvas 上的 (0,0) 位置
	ctx.drawImage(bgImg,0,0);
	ctx.drawImage(towerBtn, 590, 430, 50, 50 );
	ctx.drawImage(heroImg, hero.x, hero.y);
	if(isBuilding == true){
		towerPos.x = cursor.x - cursor.x%32;
		towerPos.y = cursor.y - cursor.y%32;
		ctx.drawImage(tower, towerPos.x, towerPos.y);
	}
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
	}
});

// 執行 draw 函式
setTimeout( draw, 1000);
setInterval(draw, 16 );




