function fruit( config, renderer )
{
	this.data = {};
	
	this.config = $.extend({
		game : {
			start : {
				x : 50, // This is default value
				y : 100 // This is default value
			},
			end : {
				x: 55, // This is default value
				y: 180	// This is default value
			}
		}
	}, config );
	
	this.bitmap = new createjs.Bitmap();
	this.paths  = [];
	this.type	= {};
	this.renderer = renderer;
	this.isAlive = true;
};

fruit.prototype.set = function ( name, data )
{
	this.data[name] = data;
};

fruit.prototype.removeSet = function ( name )
{
	delete this.data[name];
};

fruit.prototype.removeTween = function (){
	createjs.Tween.removeTweens( this.tween );
};

fruit.prototype.removeBitmap = function ( name )
{
	var stage = this.bitmap.getStage () || null;
	
	if ( stage !== null )
	{
		stage.removeChild( this.bitmap );
	}
};

fruit.prototype.get = function ( name )
{
	return this.data[name] || null;
};

fruit.prototype.initBitmap = function ( )
{
	var image = this.get("image");
	this.bitmap.image = image;
};

fruit.prototype.start = function ( paths, start, end, speed )
{
	var tween 		= createjs.Tween.get(this.bitmap),
	//var tween     = createjs.Tween.get(this.bitmap),
		stage 		= this.config.stage,
		direction 	= this.renderer.getRandomDirection(),
		This	  	= this;
	
	x    =  start.x,
	y    =  start.y;

	this.bitmap.x = x;
	this.bitmap.y = y;
	
	var bounds = this.bitmap.getBounds();
	
	this.bitmap.regX = bounds.width / 2;
	this.bitmap.regY = bounds.height / 2;
	
	tween.to({x:x, y:y},speed);
	
	for ( var i in paths )
	{
		var path = paths[i],
			x    = 0,
			y    = 0;
		
		switch ( direction )
		{
			case DIRECTION_LEFT :
				x    = start.x - path.x;
				y    = start.y - path.y; 
			break;
			case DIRECTION_RIGHT :
				x    = start.x + path.x;
				y    = start.y - path.y;
			break;
		};
		
		tween.to({x:x, y:y},speed);
		
		if ( i >= Object.keys( paths ).length - 1 )
		{
			tween.call(function (){
				
				if ( This.isAlive == true )
				{
					// Remove 1 heart
					HEART--;
					if ( HEART < 0 )
					{
						localStorage.canPlay = "0";
					};
					
					controller.createHeart(HEART);
				};
				
				This.removeTween();
				This.removeBitmap();
			});
		}
	};
	
	stage.addChild(this.bitmap);
	
	this.tween = tween;
	
	createjs.Ticker.addEventListener("tick", stage);
};