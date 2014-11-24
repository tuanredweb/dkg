var socket     = io(), 
    controller = {
		initialize : function () {
			localStorage.point = "0";
			localStorage.canPlay = "1";
			localStorage.level = "1";
                        localStorage.objects = "0";
		},
		addPoint : function (point) {
			localStorage.point = ( parseInt ( localStorage.point ) + parseInt ( point ) ).toString();
                        
                        // Add number Objects
                        localStorage.objects = (parseInt(localStorage.objects) + 1).toString();
		},
		updatePoint : function (){
			$(".point").text(localStorage.point || 0);
			$("#finalpoint").text(localStorage.point || 0);
		},
		updateTime : function ( timeconfig){
			var time = createjs.Ticker.getTime(true),
                s    = Math.floor(time/1000)  - timeconfig,
                m    = Math.floor(s/60);
			
			if ( s > 59 )
			{
				s = Math.floor( s % 60 );
				
				if ( s < 10 )
				{
					s = "0" + s;
				}
			} 
			else 
			{
				if ( s < 10 )
				{
					s = "0" + s;
				}
			};
			
			$("#s").text(s);
			$("#m").text(m);
			// $("#startCount").text(s1);
		},
		showResult : function (){
			// $(".show-result").css("display", "block");
			// Redirect to score table
			controller.lockScreen("#gameoverbtn");
			setTimeout(function(){
				window.location.href = "/endgame";
			}, 3000);
		},
		updateLevel : function (){
			var point = localStorage.point,
				level = 1;
			
			if ( Math.floor( point / POINT_EACH_LEVEL ) <= 1 )
			{
				level = 1;
			}
			else
			{
				level = Math.floor( point / POINT_EACH_LEVEL );
			}
			
			localStorage.level = level;
			
			$(".niveau").text(level);
		},
		createHeart : function ( numbers, emptyes ) {
			// Remove heart
			$(".hearts").remove();
			
			// Create Heart
			for ( var i = 0; i < numbers; i++ )
			{
				$(".wrap-hearts").append(
					jQuery("<span>", {"class" : "hearts"}).append(
							jQuery("<img>").attr("src", "images/heart.png")
					)
				);
			};
			
			if ( emptyes > 3 ) { emptyes = 3; };
			
			for ( var i = 0; i < emptyes; i++ )
			{
				$(".wrap-hearts").append(
						jQuery("<span>", {"class" : "hearts lost-heat"}).append(
								jQuery("<img>").attr("src", "images/heart.png")
						)
				);
			};
		},
		initializePopup: function (){
			$('#countstartbtn, #gameoverbtn').magnificPopup({
				  type:'inline',
				  modal: true
			});
		},
		lockScreen : function ( id ){
			$(id).trigger("click");
		},
		unlockScreen : function (){
			$.magnificPopup.instance.close();
		},
		showCountTime : function ( time ){
            if ( time >= 0 )
            {
                $("#startCount").text(time);
            }
		},
		InitTotal: function ( total ){
			$("#bgIn").text(total);
		}
};         

jQuery(document).ready(function(){
	var wWidth = $(window).width(),
	    wHeight= $(window).height();
	
	// Initialize game
	controller.initialize();
	
	// Initialize popup
	controller.initializePopup();
	
	// Initialize heart
	controller.createHeart(HEART, HEART_EMPTY);
	
	Game.playGame ({
		canvas: {
			width : wWidth			,
			height: wHeight			,
			offsetCell 	: 3			,
			id: 'board-canvas'
		}
	});
});