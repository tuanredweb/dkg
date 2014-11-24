/*  
 * Copyright (c) 2014 redweb.dk
 */

function database(conf)
{
	this.conf = conf;
	this.mysql = require("mysql");
	this.connection = this.mysql.createConnection({
		  host     : conf.HOST,
		  user     : conf.USER,
		  password : conf.PASSWORD,
		  database : conf.DATABASE
	});
}

module.exports = database;