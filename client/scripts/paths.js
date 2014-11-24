function paths( config )
{
	this.config = config;
};

paths.prototype.initialize = function ( start, end, time, numbPath, V0 ){
	this.start 		= start;
	this.end   		= end;
	this.time  		= time 		|| 1;
	this.numbPath 	= numbPath 	|| 20;
	this.V0			= V0 		|| 89;
};

paths.prototype.find = function ( fn ) {
	var L     	= this.getL( this.start, this.end ),
		H	  	= this.config.canvas.height,
		canvas  = this.config.canvas,
		V0    	= 0,
		time  	= 0,
		x 		= 0, 
		y 		= 0,
		paths 	= {};
		
	// V0 = 1;
	var start 	= this.start,
		end   	= this.end;
	
	var dx 		= end.x - start.x,
		dy 		= end.y - start.y;
	
	// V0 = 150;
	var angel 	= Math.atan2(dy, dx), i = 0;
	
	V0 = this.V0;
		
	while ( canvas.height - y <= canvas.height )
	{
		time = time + this.time;
		x = V0 * Math.cos(angel) * time;
		y = V0 * Math.sin(angel) * time - ( GRAVITY * time * time ) / 2;

		paths[i] = {x : x , y:  y };
		i++;
	};
	
	fn ( paths );
};

paths.prototype.getAlpha = function (){
	var from  = this.alphaStart,
		to    = this.alphaEnd;
	
	return Math.random() * ( to - from ) + from;
};

paths.prototype.getL = function ( start, end ){
	return Math.abs( start.x - end.x );
};

paths.prototype.getH = function () {
	var from = this.highStart,
		to   = this.highEnd;
	
	return Math.random() * ( to - from ) + from;
};

paths.prototype.getV0 = function ( a, L, H ) {
	return Math.sqrt( Math.abs( (L * GRAVITY)/(Math.sin(2 * a ))) );
};
