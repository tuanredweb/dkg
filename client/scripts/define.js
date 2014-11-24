/*## Math ##*/
var GRAVITY 		= 9.8,
    ALPHA_START 	= 50,
    ALPHA_END  		= 70,
    TIME			= 0.5,
    FRUIT_V			= 70;

/*## Game ##*/
var MOUSE_ENTER 	= 0,
    MOUSE_CLICK 	= 1,
    MOUSE_DOWN  	= 2,
    MOUSE_OUT   	= 3,
    BEGIN       	= 1,
    NOT_BEGIN		= 0,
    DIRECTION_RIGHT     = 0,
    DIRECTION_LEFT 	= 1,
    DISTANCE_X		= {from : 2, to : 12},
    DISTANCE_Y		= {from : 60, to : 10},
    DIRECTION_RANDOM    = {min: 0, max: 2},
    HEART		= 3,
    HEART_EMPTY		= 0,
    POINT_EACH_LEVEL    = 100,
    DISTANCE_START      = 300,
    DISTANCE_LEFT		= 200,
    DISTANCE_RIGHT		= 200,
    TIMELOOSE			= 60;

/* TYPE FRUIT */
var TYPE_1              = 1,
    TYPE_2 		= 2,
    TYPE_3 		= 3,
    TYPE_4 		= 4,
    TYPE_5 		= 5,
    TYPE_6 		= 6,
    TYPE_7 		= 7,
    TYPE_8 		= 8,
    TYPE_9 		= 9,
    TYPE_10             = 10,
    TYPE_11 		= 11,
    TYPE_12 		= 12,
    TYPE_13 		= 13;

/* State Hand*/
var STATE_CLOSED        = "Closed",
    STATE_UNKNOW        = "Unknown",
    STATE_NOTTRACKED    = "NotTracked",
    STATE_OPEN          = "Open";
    
var types = {};

	types[TYPE_1] = {
		id: "apple"	, 
		src:"images/fruits/apple.png", 
		width: "100px",
		point: 10
	};
	types[TYPE_2] = {
		id: "cherry", 
		src:"images/fruits/cherry.png", 
		width: "100px",
		point: 10
	};
	types[TYPE_3] = {
		id: "grape", 
		src:"images/fruits/grape.png", 
		width: "100px",
		point: 10
	};
	types[TYPE_4] = {
		id: "lemon", 
		src:"images/fruits/lemon.png", 
		width: "100px",
		point: 10
	};
	types[TYPE_5] = {
		id: "orange", 
		src:"images/fruits/orange.png", 
		width: "100px",
		point: 10
	};
	types[TYPE_6] = {
		id: "pear", 
		src:"images/fruits/pear.png", 
		width: "100px",
		point: 10
	};
	types[TYPE_7] = {
		id: "strawberry", 
		src:"images/fruits/strawberry.png", 
		width: "100px",
		point: 10
	};
	types[TYPE_8] = {
		id: "watermellon", 
		src:"images/fruits/watermellon.png", 
		width: "100px",
		point: 10
	};