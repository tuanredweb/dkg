"use strict";

// Class Graphic that draw board and disk on game
function renderer ( config ) 
{
	this.config = $.extend({
		
	}, config);
	
	this.begin 	= "0";
	this.data  	= {};
	this.index 	= 1;
	this.fruits = {};
	this.canPlay= "1";
}

renderer.prototype.start = function (){
	// Start function
	this.begin = "1";
	
	// Add event for hand
	
	// Create time for ticker
	this.data["militime"] 	= Math.floor(createjs.Ticker.getTime());
	this.data["time"] 		= 0;
	
	this.ticker = createjs.Ticker.addEventListener("tick", tick);
	
	// Show start popup
	controller.lockScreen();
	
	var This            = this,
        currentTime     = createjs.Ticker.getTime(true)/1000,
        countDownTime   = createjs.Ticker.getTime()/1000 - this.config.timeStart;
	
	function tick(){
		var _self = This.getThis(),
			tempTime;

		if ( _self.begin === "1" )
		{
			var data 		= _self.data,
                time 		= _self.data["time"] || 0;
			
			// Update time
			controller.updateTime( This.config.timeStart );
			
			// Update level
			controller.updateLevel();
			
			tempTime = createjs.Ticker.getTime()/1000;
			
			// Begin create fruit
			controller.showCountTime( countDownTime );
			
			if ( ( time - currentTime >= This.config.timeEachFruit  || time === 0) && HEART > 0 )
			{				
				// Change cursor
				// $("*").css("cursor", "none");
				
				// Create fruit
				var f 			= new fruit( This.config, _self ),
                                    objImage 	= This.getRandomImageFromQueue(),
                                    path  		= new paths( This.config ),
                                    start 		= This.getRandomPosStart(),
                                    end	  		= This.getRandomPosNext( start ),
                                    speed   	= Math.floor( Math.random() * 52 + 85 );

				
				path.initialize(start, end, 0.7, 300, speed );

				f.set("image", objImage.image);
				f.set("paths", path);
				f.set("type", objImage.type);
				f.set("index", _self.index);
				f.bitmap.parentIndex = _self.index;
                                
				_self.fruits[_self.index] = f;
				_self.update("fruits", _self.fruits);
				
				// Set fruit with type image
				f.initBitmap();
				
				// Random direction
				This.getRandomDirection();
				
				path.find( function ( paths ){

					// f.start( allPaths, start, end, speed );
					This.startFruits( _self.index, paths, start, end, speed + 50 );
					
					This.addEventForFruit( _self.index );
					
//					This.drawPaths ( paths, start, end, function (){
//						//This.clearPaths();
//					} );
					
					_self.index++;
					
					This.update("index", _self.index);
					
					// fruit.startFruit();
					time = Math.floor(createjs.Ticker.getTime()/1000);
					countDownTime = Math.floor(createjs.Ticker.getTime()/1000) - This.config.timeStart;
					
					if ( countDownTime >= TIMELOOSE )
					{
						HEART = 0;
						HEART_EMPTY = 3;
						
						if ( HEART <= 0 )
						{
							localStorage.canPlay = "0";
						};
						
						controller.createHeart(HEART, HEART_EMPTY);
					};
					
					currentTime = time;
				});
                                // This.update("config",{"stage" : This.config.stage});
			};
			
			_self.updateTime();
		};
		
		// Update finish game
		if ( localStorage.canPlay == "0" && _self.canPlay == "1" ) {
			
			// Stop create fruit
			_self.begin = "0";
			
			// Create popup and show result;
			controller.showResult();
			
			// Change cursor
			$("*").css("cursor", "auto");
			
			_self.canPlay = "0";
			This.update("canPlay", _self.canPlay);
			This.update("begin", _self.begin);
		};
	};
};

renderer.prototype.startFruits = function ( index, paths, start, end, speed ){
	var f           = this.fruits[index], 
            tween 	= createjs.Tween.get(f.bitmap),
            stage       = this.config.stage,
            direction   = this.getRandomDirection(),
            length      = Object.keys(paths).length - 1;
	
        // Change direction if x out size canvas
        switch ( direction )
        {
                case DIRECTION_LEFT :
                        x    = start.x - paths[length].x;
                        
                        if ( x < DISTANCE_LEFT )
                        {
                          direction = DIRECTION_RIGHT;
                        };
                break;
                case DIRECTION_RIGHT :
                        x    = start.x + paths[length].x;
                        
                        if ( x > this.config.canvas.width - DISTANCE_RIGHT )
                        {
                          direction = DIRECTION_LEFT;  
                        };
                break;
        };
        
	x    =  start.x,
	y    =  start.y;

	f.bitmap.x = x;
	f.bitmap.y = y;
	
	var bounds = f.bitmap.getBounds();
	
	f.bitmap.regX = bounds.width / 2;
	f.bitmap.regY = bounds.height / 2;
	
	tween.to({x:x, y:y},speed);
	
        var rotation = 1;
        
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
                
		tween.to({x: x, y: y, rotation: rotation},speed);
		
                switch ( direction )
		{
			case DIRECTION_LEFT :
                                rotation -= 10;
			break;
			case DIRECTION_RIGHT :
                                rotation += 10
			break;
		};

		if ( i >= Object.keys( paths ).length - 1 )
		{
			tween.call(function (){
				
				if ( f.isAlive === true )
				{
					// Remove 1 heart
					 HEART--;
					// Add 1 heart empty
					 HEART_EMPTY++;
					
					if ( HEART <= 0 )
					{
						localStorage.canPlay = "0";
					};
					
					controller.createHeart(HEART, HEART_EMPTY);
				};
				
				f.removeTween();
				f.removeBitmap();
			});
		}
	};
	
	stage.addChild(f.bitmap);
	
	f.tween = tween;
	
	this.fruits[index] = f;
	this.config.stage = stage;
	createjs.Ticker.addEventListener("tick", stage);
};

renderer.prototype.detectObjectFruit = function ( position ){
    var stage = this.config.stage,
        config= this.config,
        positions = null,
        fruit = null;
        //fruit = stage.getObjectsUnderPoint( position.x , position.y );
        
        // Get Position
        positions = this.getAllPositionWith( position, config.rect );
        
        for ( var i in positions )
        {
            fruit = stage.getObjectsUnderPoint( positions[i].x , positions[i].y );
            
             // If not null 
            if ( fruit.length !== 0 )
            {
                // Remove object fruit
                this.removeFruit(fruit);
            };
        };
};

renderer.prototype.getAllPositionWith = function ( position, rect ){
    return {
        "0" : {x: position.x - rect, y: position.y - rect},
        "1" : {x: position.x - rect, y: position.y},
        "2" : {x: position.x - rect, y: position.y + rect},
        "3" : {x: position.x, y: position.y + rect},
        "4" : {x: position.x + rect, y: position.y + rect},
        "5" : {x: position.x + rect, y:position.y},
        "6" : {x: position.x + rect, y: position.y - rect},
        "7" : {x: position.x, y: position.y -rect}
    };
};

renderer.prototype.removeFruit = function ( arrObject ){
    var fruit = arrObject[0],
        index = fruit.parentIndex,
        f     = this.fruits[index];
    
        f.isAlive = false;
        f.removeTween();
        f.removeBitmap();

        // Update point
        var point = f.get("type").point;

        controller.addPoint( point );
        controller.updatePoint();

        this.fruits[index] = f;
        this.config.stage.removeChild(fruit);
};

renderer.prototype.addEventForFruit = function ( index ){
	var This = this,
		f    = this.fruits[index];
	
	f.bitmap.on("mousedown", function ( evt ){
		f.isAlive = false;
		f.removeTween();
		f.removeBitmap();
		
		// Remove object fruit here
//		var index = f.get("index");
		
		// Update point
		var point = f.get("type").point;
			controller.addPoint( point );
			controller.updatePoint();
	} );
	
	this.fruits[index] = f;
};

renderer.prototype.getRandomDirection = function (){
	this.direction = Math.floor( Math.random() * ( DIRECTION_RANDOM.max - DIRECTION_RANDOM.min) ); 
	return this.direction;
};

renderer.prototype.clearPaths = function (){
	var stage           = this.config.stage,
            containerPaths  = stage.getChildByName("paths");
	
	// Delete container
	this.config.stage.removeChild(containerPaths);
};

renderer.prototype.drawPaths = function ( paths, start, end, fn )
{
	var stage 	= this.config.stage,
            container 	= new createjs.Container();
	
	container.name = "paths";
	
	var tempX, tempY,
            g 	 = new createjs.Graphics(),
            x    = start.x,
            y    = start.y - 4;

	g.setStrokeStyle(1); 
	g.beginStroke(createjs.Graphics.getRGB(0,0,0)); 
	g.beginFill(createjs.Graphics.getRGB(255,0,0)); 
	g.drawCircle(x, y, 3);
	
	var s = new createjs.Shape(g);
        
	container.addChild(s);

	for (var i in paths)
	{
		var path    = paths[i],
                    g       = new createjs.Graphics(),
                    x       = 0,
                    y       = 0,
                    length  = Object.keys(paths) - 1; 
		
		switch ( this.direction )
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

		g.setStrokeStyle(1); 
		g.beginStroke(createjs.Graphics.getRGB(0,0,0)); 
		g.beginFill(createjs.Graphics.getRGB(255,0,0)); 
		g.drawCircle(x, y, 3);
		
		var s = new createjs.Shape(g);
		
		container.addChild(s);
	}
	

    stage.addChild(container);
    stage.update();
    
    this.config.stage = stage;
    // Call back function
    fn ();
};

renderer.prototype.getThis = function (){
    return this;
};

renderer.prototype.updateTime = function (){
	this.data["militime"] 	= Math.floor(createjs.Ticker.getTime());
	this.data["time"] 		= Math.floor(createjs.Ticker.getTime()/1000);
};

renderer.prototype.update = function ( name, data )
{
	this[name] = data;
};

renderer.prototype.getRandomImageFromQueue = function ()
{
	var queue = this.config.queue,
            length= Object.keys(types).length,
            number= Math.floor( Math.random() * length + 1 ),
            image = queue.getResult( types[number].id );

	// Random between from 1 to length of fruit
	return {image: image, type: types[number]} ;
};

renderer.prototype.getRandomPosStart = function (){
	// Random between middle of map
	var pos 	= {},
            canvas 	= this.config.canvas,
            randomX = Math.floor( Math.random() * (canvas.width - DISTANCE_START) ) + DISTANCE_START,
            randomY = Math.floor( Math.random() * DISTANCE_Y.to  + DISTANCE_Y.from) + ( canvas.height );

            pos.x = randomX;
            pos.y = randomY;
		
	return pos;
};

renderer.prototype.getRandomPosNext  = function ( start ){
	var ranX = Math.floor( Math.random() * DISTANCE_X.to + DISTANCE_X.from),
            ranY = Math.floor( Math.random() * DISTANCE_Y.to + DISTANCE_Y.from);
	
	return {x : start.x + ranX, y: start.y + ranY};
};

renderer.prototype.stopGame = function (){
	this.begin = "0";
};