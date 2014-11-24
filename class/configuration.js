/*  
 * Copyright (c) 2014 redweb.dk
 */
var configuration = function ()
{
	this.SERVER 	= "billy.redhost.dk";
	this.PORT       = 3000;
	this.USER	= "billy";
	this.PASSWORD	= "BikSen81XnButik3aD";
	this.DATABASE	= "billy2014-10-20";
	this.UUIDExist  = 3; // It mean cookie UUID will be live on 3 day;
	this.prefix	= "x1og3_";
	this.website	= "http://billy.redhost.dk/";
//	this.urlLogout  = "index.php?option=com_users&task=user.logout";
//	this.folderImage= "images/bt_socialconnect/avatar/";
//	this.imageUrl   = this.website + this.folderImage;
};

configuration.prototype.getUUID = function (  )
{
	var UUID        	= require('node-uuid');
	return UUID();
};

configuration.prototype.getDate = function ()
{
	var d 		= new Date();
	return d.getTime();
};

configuration.prototype.DEBUG = function ()
{
	var md5 		  = require("./md5.js");
	var string 		  = "123456";
	console.log (md5.md5(string));
};

module.exports = configuration;

