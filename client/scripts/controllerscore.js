var controller = {
		initialize : function () {
			var userList = controller.parseToJSON(localStorage.userList);
			
			userList = controller.sortDESC(userList, "point");
			
			var countLeft = 0,
				countRight= 0;
			
			for ( var i in userList )
			{
				var data = {};
					data.name = userList[i].name;
					data.score = userList[i].point;
					
				if ( countLeft < 10 )
				{
					var template = controller.getTemplate("row_score", data);
					// Append left
					$(".left-score").append(template);
					countLeft++;
				}
//				
//				if ( countLeft >= 5 && countRight <= 4 )
//				{
//					var template = controller.getTemplate("row_score", data);
//					$(".right-score").append(template);
//					countRight++;
//				}
				
			};
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
		},
		sortDESC: function ( data, key ){
			    return data.sort(function(a, b) {
			        var x = parseInt( a[key] ); var y = parseInt( b[key] );
			        return ((x > y) ? -1 : ((x < y) ? 1 : 0));
			    });
		},
		getTemplate: function ( type, data ){
			switch (type){
				case "row_score" :
					var p = jQuery("<p>").append(
								jQuery("<span>",{"class" : "col-md-6 left"}).text(data.name),
								jQuery("<span>", {"class" : "col-md-6 right"}).text(data.score)
							);
					
					return p;
				break;
			}
		}
};         

jQuery(document).ready(function(){
	// Initialize on begin game
	controller.initialize();
});