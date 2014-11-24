var socket     = io(),
    controller = {
		initialize : function () {
			$("#totalScore").text(localStorage.point);
		},
		saveGame : function (){
			$("#saveName").on("click", function(){
                                
				var username = $("#user_name"),
					name 	 = username.val(); 
                                        
                                if ( name === "" )
                                {
                                  alert("You should input your name");
                                  return ;
                                };
				username.attr("disabled", "disabled");
				
				$(this).attr("disabled", "disabled");
				
				// Add this user into cache
				var userList = controller.parseToJSON(localStorage.userList || "[]");
				
				userList.push({
					name : name,
					point: localStorage.point
				});
				
				// Update to cache
				controller.updateToCache("userList", controller.parseToString(userList));
				
                                controller.postComplete( {"name" : name} );
                                
                                // Disable all button 
                                $(".wrapBtn").find("a").each(function( e ){
                                    $(this).attr("disabled", "disabled");
                                });
                                
                                location.href = "/score";
			});
		},
                postComplete : function ( data ){
                    socket.emit("client.finishGame", {
                       'name' : data.name,
                       'point': localStorage.point,
                       'level': localStorage.level,
                       'status': "1",
                       'object': localStorage.objects
                    });
                },
                postNoCompleted : function (){
                    socket.emit("client.startGame", {
                       'status': "0",
                       'object': localStorage.objects,
                       'level': localStorage.level,
                       'point': "0",
                    });
                },
                noFinishedGame : function ( type )
                {
                    controller.postNoCompleted();
                    
                    location.href = "/" + type;
                },
		updateToCache : function (name, value)
		{
                    localStorage[name] = value;
		},
		parseToJSON : function (str){
			var str2 = str || "{}";
			return JSON.parse(str2);
		},
		parseToString : function(data){
			return JSON.stringify(data) || "";
		}
};         

jQuery(document).ready(function(){
	// Initialize on begin game
	controller.initialize();
	
	// Init save game
	controller.saveGame();
});