/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function sockets( db, conf, io, request )
{
    this.db         = db;
    this.conf       = conf;
    this.request    = request;
    this.io         = io;
    var client      = require('node-rest-client').Client;
    this.client     = new client();
};

sockets.prototype.initializes = function (){
    var io      = this.io,
        This    = this,
        IdTemp  = 0;

        io.sockets.on('connection', function ( socket ) {
            socket.on("client.startGame", function( data ){
                This.postBilie( data, function( res ){
                    console.log (res);
                });
            });

            socket.on("client.finishGame", function( data ){
                This.postBilie( data, function( res ){
                    console.log (res);
                });
            });
            
            socket.on("client.sendDataWarehouseFirst", function(data){
                This.postWareHouse( data, function( res ){
                	console.log (res);
                    if ( res > 0 )
                    {
                    	IdTemp = res;
                    }
                    else
                    {
                    	IdTemp = false;
                    }
                });
            });
            
            socket.on("client.sendDataWarehouseSecond", function(data){
            	
            	if ( IdTemp !== false )
            	{
            		data.id = IdTemp;
            		
            		This.postWareHouse( data, function( res ){
                        console.log (res);
                    });
            	};
            });
        });
};

sockets.prototype.getTokenkey = function (fn){
  var conf = this.conf,
      This = this;
      
      // direct way
      this.client.get( This.conf.website + "index.php?option=com_users&view=login&tag=1", function(data, response){
        fn(data, response);
      });
};

sockets.prototype.postBilie = function( data, fn ){
    var This = this;

        var request = require('request');
        // var data = { '': 'data:image/jpeg;base64,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' };
        //var data = { 'cform[number][objects]': '1080808080' };
        
        var data = this.filterData( data );
        
        request.post(
             This.conf.website + "index.php?option=com_reditembilka&task=stat.billie",
            { form: data },
            function (error, response, body) {
                fn(body);
            }
        );
};

sockets.prototype.postWareHouse = function( data, fn ){
    var This = this;

        var request = require('request');
        // var data = { '': 'data:image/jpeg;base64,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' };
        //var data = { 'cform[number][objects]': '1080808080' };

        var data = this.filterData( data );
        
        request.post(
             This.conf.website + "index.php?option=com_reditembilka&task=stat.warehouse",
            { form: data },
            function (error, response, body) {
                fn(body);
            }
        );
};

sockets.prototype.filterData = function ( data ){
    var d = {};
    
    for ( var i in data )
    {
        switch (i)
        {
            case "name":
                d["cform[textbox][user_name]"] = data[i];
                break;
            
            case "point":
                d["cform[number][score]"] = data[i];
                break;
            case "level":
                d["cform[number][level]"] = data[i];
                break;
            case "status":
                d["cform[radio][status]"] = data[i];
                break;
            case "object":
                d["cform[number][objects]"] = data[i];
                break;
                // part 2 warehouse
            case "comment":
                d["cform[textbox][review]"] = data[i];
                break;
            case "participate":
                d["cform[radio][participated]"] = data[i];
                break;
            case "participate2":
                d["data[participated]"] = data[i];
                break;
            case "dataImage":
                d["data[image]"] = data[i];
                break;
            case "rate":
                d["data[stars]"] = data[i];
                break;
            case "changeCostum":
            	d["cform[number][changes_costumes]"] = data[i];
            	break;
            case "id":
            	d["data[id]"] = data[i];
            	break;
            case "formData":
                var json = JSON.parse(data[i]);
                
                for( var j in json )
                {
                    switch ( j )
                    {
                        case "name":
                            d["data[first_name]"] = json[j];
                            break;
                        case "lastname":
                            d["data[last_name]"] = json[j];
                            break;
                        case "phone":
                            d["data[telephone]"] = json[j];
                            break;
                        case "email":
                            d["data[email]"] = json[j];
                            break;
                        case "address1":
                            d["data[address_1]"] = json[j];
                            break;
                        case "address2":
                            d["data[address_2]"] = json[j];
                            break;
                          
                    }
                };
                
                break;
        };
    }
    
    return d;
};

module.exports = sockets;

