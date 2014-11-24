function fruits( config )
{
//	var wCanvas = config.canvas.width,
//		hCanvas = config.canvas.height;
//	
	this.data = {};
	
	this.config = $.extend({
		game : {
			start : {
//				x : wCanvas / 2,
//				y : hCanvas + 100
				x : 50,
				y : 100
			}
		}
	}, config );
};

fruits.prototype.start = function ( )
{
	var game 	= this.config.game,
		canvas	= this.config.canvas,
		stage 	= this.config.stage,
		queue   = this.config.queue;
	
	var ball = new createjs.Shape();
	    ball.graphics.setStrokeStyle(5, 'round', 'round');
	    ball.graphics.beginStroke(('#000000'));
	    ball.graphics.beginFill("#FF0000").drawCircle(0,0,50);
	    ball.graphics.endStroke();
	    ball.graphics.endFill();
	    ball.graphics.setStrokeStyle(1, 'round', 'round');
	    ball.graphics.beginStroke(('#000000'));
	    ball.graphics.moveTo(0,0);
	    ball.graphics.lineTo(0,50);
	
	    ball.graphics.endStroke();
	    ball.x = 200;
	    ball.y = -50;

//	    var tween = createjs.Tween.get(ball, {loop:true})
//	    .to({x:ball.x, y:canvas.height - 55, rotation:-360}, 1500, createjs.Ease.bounceOut)
//	    .wait(1000)
//	    .to({x:canvas.width-55, rotation:360}, 2500, createjs.Ease.bounceOut)
//	    .wait(1000)
//	    .to({scaleX:2, scaleY:2, x:canvas.width - 110, y:canvas.height-110}, 2500, createjs.Ease.bounceOut)
//	    .wait(1000)
//	    .to({scaleX:.5, scaleY:.5, x:30, rotation:-360, y:canvas.height-30}, 2500, createjs.Ease.bounceOut);
    // var tween = createjs.Tween.get(ball, {loop:true}).to({x:700}, 1500, Ease.getPowOut(3));
                

    stage.addChild(ball);

	createjs.Ticker.addEventListener("tick", stage);
	
	var This = this;

	var image = queue.getResult("apple"),
		fruit = new createjs.Bitmap(image);
	
		fruit.x = 200;
		fruit.y = 200;

		This.set("fruit", fruit);
		This.set("stage", stage);
		
		this.paths( this.config );
		
		this.beginTween( fruit );
		
		// This.update();
};

fruits.prototype.paths = function ( config ) {
	var path = new paths( config ),
		canvas = this.config.canvas;
	
	var start = { x: canvas.width / 2, y: canvas.height - 80},
		end   = { x: canvas.width / 2 + 5, y: canvas.height  }; 
	path.initialize( start, end, 8 );
	
	var allpaths = path.find();
	
	this.allpaths = allpaths;
	this.drawPaths ( allpaths, start, end  );
	this.run(start, end);
	console.log (allpaths);
};

fruits.prototype.run = function ( start, end ){
	var allpaths = this.allpaths,
		fruit	 = this.data["fruit"],
		stage    = this.config.stage,
		canvas   = this.config.canvas;
	
	
	var tween = createjs.Tween.get(fruit, {loop:true});
	
	x    =  start.x ,
	y    =  start.y;

	tween.to({x:x, y:y},150);
	for ( var i in allpaths )
	{
		var path = allpaths[i],
			x    =  start.x + path.x,
			y    =  start.y - path.y ;
		
		console.log (path);
		tween.to({x:x, y:y},150);
	};


	 stage.addChild(fruit);
	
	 createjs.Ticker.addEventListener("tick", stage);
};

fruits.prototype.drawPaths = function ( paths, start, end ){
	var stage = this.config.stage;
	
	var tempX, tempY,
		g 	 = new createjs.Graphics();
	
	x    = start.x,
	y    = start.y - 4; 

	console.log ("x: %s - y: %s", x, y);
	g.setStrokeStyle(1); 
	g.beginStroke(createjs.Graphics.getRGB(0,0,0)); 
	g.beginFill(createjs.Graphics.getRGB(255,0,0)); 
	g.drawCircle(x, y, 3);
	
	var s = new createjs.Shape(g);
	//s.x = x;
	//s.y = y;
	
	stage.addChild(s);

	for (var i in paths)
	{
		var path = paths[i],
			g 	 = new createjs.Graphics(),
			x    = start.x + path.x,
			y    = start.y - path.y ; 
		
		console.log ("x: %s - y: %s", x, y);
		g.setStrokeStyle(1); 
		g.beginStroke(createjs.Graphics.getRGB(0,0,0)); 
		g.beginFill(createjs.Graphics.getRGB(255,0,0)); 
		g.drawCircle(x, y, 3);
		
		var s = new createjs.Shape(g);
//        s.x = x;
//        s.y = y;

        stage.addChild(s);
        stage.update();
	}
};

fruits.prototype.beginTween = function ( fruit ){
	var canvas	= this.config.canvas,
		stage 	= this.config.stage;
};

fruits.prototype.update = function ()
{
	var fruit = this.data["fruit"],
		stage = this.data["stage"];
	
	this.config.stage = stage;
	
	this.config.stage.addChild(fruit);
	this.config.stage.update();
};

fruits.prototype.set = function ( name, data )
{
	this.data[name] = data;
};
