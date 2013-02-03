/**
 * IndexedDB implementation
 */
var IndexedDBStore = function(render) {
	var onError = function(ex) {
		alert("There has been an error: " + ex);
	};

	var indexedDB      = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
	var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;
	var IDBKeyRange    = window.IDBKeyRange || window.webkitIDBKeyRange;

	var db      = null;
	var request = indexedDB.open("todo");
	request.onfailure = onError;
	request.onsuccess = function(e) {
		db = request.result;

		var v = "1.0";
		// We can only create Object stores in a setVersion transaction;
		if(v != db.version)
		{
			var verRequest       = db.setVersion(v);
			verRequest.onfailure = onError;
			verRequest.onsuccess = function(e) {
				// onsuccess is the only place we can create Object Stores
				var store = db.createObjectStore(
					"todo",
					{
						keyPath: "id", // unique field
						autoIncrement: true
					}
				);
				e.target.transaction.oncomplete = function() {
				};
			};
		}
	};

	return {
		/**
		 * Adds an item to the store.
		 *
		 * @param item
		 */
		add: function(item) {
			try
			{
				var trans   = db.transaction(["todo"], IDBTransaction.READ_WRITE);
				var store   = trans.objectStore("todo");
				var request = store.put({
					"todo": item.todo,
				});
			}
			catch(ex)
			{
				onError(ex);
			}
		},
		/**
		 * Removes an item by the given id from the store.
		 *
		 * @param id
		 */
		remove: function(id) {
			try
			{
				var trans   = db.transaction(["todo"], IDBTransaction.READ_WRITE);
				var store   = trans.objectStore("todo");
				var request = store.delete(id);
			}
			catch(ex)
			{
				onError(ex);
			}
		},
		/**
		 * Returns a list of todo objects from store.
		 */
		read: function() {
			try
			{
				var trans = db.transaction(["todo"], IDBTransaction.READ);
				var store = trans.objectStore("todo");

				// read everything from the store
				var keyRange      = IDBKeyRange.lowerBound(0);
				var cursorRequest = store.openCursor(keyRange);

				cursorRequest.onsuccess = function(e) {
					var result = e.target.result;
					if(!!result == false)
					{
						return;
					}

					render(result.value);
					result.continue();
				};
			}
			catch(ex)
			{
				onError(ex);
			}
		}
	};
};