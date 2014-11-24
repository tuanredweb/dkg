function authenticate ( db, knex )
{
	this.db 	= db;
	this.knex 	= knex;
        // console.log (db);
	// db.connection.connect();
};

module.exports = authenticate;