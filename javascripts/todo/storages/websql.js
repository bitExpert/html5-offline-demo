/**
 * Web SQL Database implementation
 */
var WebSQLDatabase = function(render) {
	var onError = function(tx, ex) {
		alert("There has been an error: " + ex.message);
	};
	var onSuccess = function(tx, results) {
		var len = results.rows.length;
		for(var i = 0; i < len; i++)
		{
			// render found todo item
			render(results.rows.item(i));
		}
	};

	// initalize the database connection (5MB database)
	var db = openDatabase('todo', '1.0', 'Todo Database', 5 * 1024 * 1024);
	db.transaction(function (tx) {
		tx.executeSql(
			'CREATE TABLE IF NOT EXISTS todo (id INTEGER PRIMARY KEY ASC, todo TEXT)',
			[],
			onSuccess,
			onError
		);
	});

	return {
		/**
		 * Adds an item to the store.
		 *
		 * @param item
		 */
		add: function(item) {
			db.transaction(function(tx) {
				tx.executeSql('INSERT INTO todo (todo) VALUES (?)',
					[item.todo],
					onSuccess,
					onError
				);
			});
		},
		/**
		 * Removes an item by the given id from the store.
		 *
		 * @param id
		 */
		remove: function(id) {
			db.transaction(function (tx) {
				tx.executeSql(
					'DELETE FROM todo WHERE id=?',
					[id],
					onSuccess,
					onError
				);
			});
		},
		/**
		 * Returns a list of todo objects from store.
		 */
		read: function() {
			db.transaction(function (tx) {
				tx.executeSql(
					'SELECT * FROM todo',
					[],
					onSuccess,
					onError
				);
			});
		}
	};
};