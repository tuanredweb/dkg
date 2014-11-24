//TODO: Announce player had no possible moves to the player does not play on the wrong turn (flash something?)

Game = (function () {
	// Constructor
	function playGame ( config ) {
		// Initialize variable
		var open 	= false,
                    close 	= false,
                    ready	= false,
                    queue		,
                    otherObjects,
                    manifest= [], type = {};
		
		this.config = $.extend({
			// Default config here
			canvas: {
				width 		: 1000	,
				height		: 700 	,
				cell  		: 100	,
				offsetCell 	: 10	,
				id			: 'board-canvas'
			},
			pointEachLevel : {
				"1" : {
					point : 1000
				},
				"2" : {
					point : 2000
				},
				"3" : {
					point : 3000
				},
				"4" : {
					point : 4000
				},
				"5" : {
					point : 5000
				}
			},
                        rect            : 50,
			timeEachFruit 	: 3, // Calculate by second
			timeStart   	: 4,	
			resize          : 1
			
		}, config);
		
		// Add graphic for game
		queue 		= new createjs.LoadQueue();
		otherObjects	= new createjs.LoadQueue();
		
		// Load object hand
		otherObjects.loadManifest([
		    {id: "openlefthand"	, src:"images/hands/left-hand-open.png"},
                    {id: "openlefthand"	, src:"images/hands/left-hand-open.png"},
		    {id: "closelefthand", src:"images/hands/left-hand-closed.png"},
                    {id: "openrighthand", src:"images/hands/right-hand-open.png"},
		    {id: "closerighthand", src:"images/hands/right-hand-closed.png"}
		]);
		
		manifest = [
            types[TYPE_1],
            types[TYPE_2],
            types[TYPE_3],
            types[TYPE_4],
            types[TYPE_5],
            types[TYPE_6],
            types[TYPE_7],
            types[TYPE_8],
            types[TYPE_9]
		];
		
		queue.loadManifest(manifest);
		
		this.canvas = document.getElementById( this.config.canvas.id );
		var width 	= this.config.canvas.width ,
                    height 	= this.config.canvas.height;
		
		// Stage
		this.canvas.width 	= width;
		this.canvas.height 	= height;
		this.stage              = new createjs.Stage( this.canvas );
		
		// Add stage
		this.config.stage = this.stage;
		
		// Add queue
		this.config.queue = queue;
		
		// Get time
		var time 	 = createjs.Ticker.getTime(),
                    realTime     = 0,
                    oldTime      = 0;
		
		createjs.Ticker.useRAF = true;
		
		createjs.Ticker.setFPS(100);
		
		var ticker = createjs.Ticker.addEventListener("tick", tick),
                    start  = false,
                    This   = this,
                    total  = parseInt( This.config.timeStart ) + parseInt( This.config.timeEachFruit );

		// Init total
		controller.InitTotal( total );
                
                var peoples = {},
                    lock    = null,
                    lockPeople = null,
                    checkNull = 0;
                
		// Init hand (#1#)
                otherObjects.on("complete", function(){
                    // ### Init bitmap for six people can play same time
                    InitBitmapForSixPeople( function (){
                        socket.on('server.onPeopleMoveHandTip', function( data ){
                                for( var i in data )
                                {
                                    if (data[i] === null)
                                    {
                                        checkNull++;
                                    }
                                    else
                                    {
                                        if ( lock === null )
                                        {
                                            var people;
                                            switch (i)
                                            {
                                                case "p0":
                                                    people = peoples[0];
                                                    break;
                                                case "p1":
                                                    people = peoples[1];
                                                    break;   
                                                case "p2":
                                                    people = peoples[2];
                                                    break;
                                                case "p3":
                                                    people = peoples[3];
                                                    break;
                                                case "p4":
                                                    people = peoples[4];
                                                    break;
                                                case "p5":
                                                    people = peoples[5];
                                                    break;
                                            };
                                            
                                            lock        = i;
                                            lockPeople  = people;
                                            break;
                                        }
                                    }
                                };
                                
                                // Use lock
                                if ( lock !== null )
                                {
                                    initHand(lock, data[lock]);
                                };
                                
                                if ( checkNull >= 5 )
                                {
                                        // set lock null
                                        lock = null;
                                        lockPeople = null;
                                }
                        }); 
                    });
                });
                
                var timeStart = This.config.timeStart;
                
                controller.showCountTime( This.config.timeStart );
                
		function tick ( event )
		{
			time = createjs.Ticker.getTime(true);
			realTime = Math.floor(time/1000);
			
			// Lock screen
			controller.lockScreen("#countstartbtn");
			
                        
	        if ( realTime - oldTime >= 1 )
	        {
	            timeStart = timeStart - 1;
	            controller.showCountTime( timeStart );
	            oldTime = realTime;
	        }
                        
            var inter = setInterval(function(){
                if ( start === false )
                {
					// Unlock screen
					controller.unlockScreen();
                     // Check time will start
                    createjs.Ticker.off("tick", ticker);
                    start = true;

                    // Show count down time
                    // controller.showCountTime( realTime );
                    // Begin fruit
                    // fruit = new fruits( This.config );
                    startRender ();
                };
                
                clearInterval(inter);
            }, This.config.timeStart * 1000);
			// Begin count time
		}
		
                var render = null;
		function startRender()
		{
			// (#2#)
			render = new renderer( This.config );
			
			// (#3#)
			render.start();
		};
		
        function getRender(){
            return render ;
        };

        function InitBitmapForSixPeople(fn)
        {
            for ( var i = 0; i <= 5; i++ )
            {
                peoples[i] = {};
                
                var openLeftHand 		= otherObjects.getResult( "openlefthand" ),
                    closeLeftHand		= otherObjects.getResult( "closelefthand" ),
                    openRightHand 		= otherObjects.getResult( "openrighthand" ),
                    closeRightHand		= otherObjects.getResult( "closerighthand" ),
                    // Init Bitmap for right hand
                    bitmapRightOpenHand 	= new createjs.Bitmap(openLeftHand),
                    bitmapRightCloseHand        = new createjs.Bitmap(closeLeftHand),

                    // Init Bitmap for left hand
                    bitmapLeftOpenHand      = new createjs.Bitmap(openRightHand),
                    bitmapLeftCloseHand     = new createjs.Bitmap(closeRightHand);

                    // Add name for right hand
                    bitmapRightOpenHand.name  = "openrighthand";
                    bitmapRightCloseHand.name = "closedrighthand";

                    // Add name for left hand
                    bitmapLeftOpenHand.name  = "openlefthand";
                    bitmapLeftCloseHand.name = "closedlefthand";

                    // Set scale for right hand
                    bitmapRightOpenHand.scaleX = bitmapRightOpenHand.scaleY = This.config.resize;
                    bitmapRightCloseHand.scaleX = bitmapRightCloseHand.scaleY = This.config.resize ;

                    // Set scale for left hand
                    bitmapLeftOpenHand.scaleX = bitmapLeftOpenHand.scaleY = This.config.resize;
                    bitmapLeftCloseHand.scaleX = bitmapLeftCloseHand.scaleY = This.config.resize ;

                    var sizeOpen = bitmapRightOpenHand.getBounds(),
                        sizeClose= bitmapRightCloseHand.getBounds(),
                        realSizeOpen = {"width" : sizeOpen.width * This.config.resize, "height" : sizeOpen.height * This.config.resize},
                        realSizeClose = {"width" : sizeClose.width * This.config.resize, "height" : sizeClose.height * This.config.resize};

                    // Set register position  right hand
                    bitmapRightOpenHand.regX    = realSizeOpen.width / 2;
                    bitmapRightOpenHand.regY    = realSizeOpen.height / 2;
                    bitmapRightCloseHand.regX   = realSizeClose.width / 2;
                    bitmapRightCloseHand.regY   = realSizeClose.height / 2;

                     // Set register position  left hand
                    bitmapLeftOpenHand.regX    = realSizeOpen.width / 2;
                    bitmapLeftOpenHand.regY    = realSizeOpen.height / 2;
                    bitmapLeftCloseHand.regX   = realSizeClose.width / 2;
                    bitmapLeftCloseHand.regY   = realSizeClose.height / 2;

                    bitmapRightOpenHand.visible= false;
                    bitmapRightCloseHand.visible= false;
                    bitmapLeftOpenHand.visible = false;
                    bitmapLeftCloseHand.visible= false;

                    This.stage.addChild(bitmapRightOpenHand);
                    This.stage.addChild(bitmapRightCloseHand);
                    This.stage.addChild(bitmapLeftOpenHand);
                    This.stage.addChild(bitmapLeftCloseHand);

                    This.stage.update();

                    var openRight = 1, closeRight = 0,
                        openLeft = 1, closeLeft = 0;
                
                    peoples[i] = {
                        realSizeOpen : realSizeOpen,
                        realSizeClose: realSizeClose,
                        rightOpen    : bitmapRightOpenHand,
                        rightClose   : bitmapRightCloseHand,
                        leftOpen     : bitmapLeftOpenHand,
                        leftClose    : bitmapLeftCloseHand,
                        isOpenRight  : openRight,
                        isClosedRight: closeRight,
                        isOpenLeft   : openLeft,
                        isClosedLeft : closeLeft
                    };
            };
            
            fn ();
        };
                
		function initHand ( index, data )
                {
                    if ( render === null ) return;
                    
                    var people = null;
                        data = JSON.parse(data),
                        isLockedIndex = index;
                    
                    switch (index)
                    {
                        case "p0":
                            people = peoples[0];
                            break;
                        case "p1":
                            people = peoples[1];
                            break;   
                        case "p2":
                            people = peoples[2];
                            break;
                        case "p3":
                            people = peoples[3];
                            break;
                        case "p4":
                            people = peoples[4];
                            break;
                        case "p5":
                            people = peoples[5];
                            break;
                    };
                    
                    for ( var i in peoples )
                    {
                        if ( i !== isLockedIndex )
                        {
                            peoples[i].rightOpen.visible = false;
                            peoples[i].rightClose.visible = false;
                            peoples[i].leftOpen.visible = false;
                            peoples[i].leftClose.visible = false;
                              
                        };
                    };
                    
                    var leng = This.config.stage.children.length;

                        This.config.stage.setChildIndex ( people.rightOpen, leng - 1 );
                        This.config.stage.setChildIndex ( people.rightClose, leng - 1 );
                        This.config.stage.setChildIndex ( people.leftOpen, leng - 1 );
                        This.config.stage.setChildIndex ( people.leftClose, leng - 1 );

                        if ( data.stateLeft === STATE_CLOSED )
                        {
                            people.isClosedLeft = 1;
                            people.isOpenLeft = 0;
                        }
                        else
                        {
                            people.isClosedLeft = 0;
                            people.isOpenLeft   = 1;
                        };

                        if ( data.stateRight === STATE_CLOSED )
                        {
                            people.isClosedRight = 1;
                            people.isOpenRight   = 0;
                        }
                        else
                        {
                            people.isClosedRight = 0;
                            people.isOpenRight   = 1;
                        };

                        if ( people.isOpenRight === 1 && people.isClosedRight === 0 )
                        {
                            people.rightOpen.visible = true;
                            people.rightClose.visible = false;
                            var right = JSON.parse(data.right);
                            people.rightOpen.x = parseInt(right.x);
                            people.rightOpen.y = parseInt(right.y);
                        };

                        if ( people.isOpenRight === 0 && people.isClosedRight === 1 )
                        {
                            var right = JSON.parse(data.right);
                            people.rightOpen.visible = false;
                            people.rightClose.visible = true;
                            people.rightClose.x = parseInt(right.x);
                            people.rightClose.y = parseInt(right.y);

                            var _render = getRender();

                            _render.detectObjectFruit({x: right.x, y:right.y});
                        };

                        if ( people.isOpenLeft === 1 && people.isClosedLeft === 0 )
                        {
                            var left = JSON.parse(data.left);
                            people.leftOpen.visible = true;
                            people.leftClose.visible = false;
                            people.leftOpen.x = parseInt(left.x);
                            people.leftOpen.y = parseInt(left.y);
                        };

                        if ( people.isOpenLeft === 0 && people.isClosedLeft === 1 )
                        {
                            var left = JSON.parse(data.left);
                            people.leftOpen.visible = false;
                            people.leftClose.visible = true;
                            people.leftClose.x = parseInt(left.x);
                            people.leftClose.y = parseInt(left.y);

                            var _render = getRender();

                            _render.detectObjectFruit({x: left.x, y:left.y});
                        };

                        This.config.stage.update();
		};
	};
	
	return {
		playGame : playGame
	};
})();
