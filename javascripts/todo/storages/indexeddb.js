/**
 * IndexedDB implementation
 *
 * IndexedDB is a new standard for client side storage in the browser. It is not a relational database, but instead stores JavaScript objects. The "Index" part of the name refers to the ability to select a data field as an "index" and then search the object store based on that data field.
 *
 * https://developer.mozilla.org/en-US/docs/IndexedDB/Basic_Concepts_Behind_IndexedDB
http://stackoverflow.com/questions/12084177/in-indexeddb-is-there-a-way-to-make-a-sorted-compound-query
http://dev.yathit.com/ydn-db/using/key-range-query.html
http://stackoverflow.com/questions/6405650/querying-in-indexeddb?rq=1
https://developer.mozilla.org/en-US/docs/IndexedDB/Using_IndexedDB#Using_an_index
http://stackoverflow.com/questions/8694941/conceptual-problems-with-indexeddb-relationships-etc
http://blog.oharagroup.net/post/16394604653/a-performance-comparison-websql-vs-indexeddb
http://java.dzone.com/articles/searching-array-elements
http://stackoverflow.com/questions/7086180/indexeddb-fuzzy-search/8961462#8961462
http://stackoverflow.com/questions/11217309/how-to-update-an-html5-indexeddb-record?rq=1
http://css.dzone.com/articles/blobs-and-more-storing-images
 *
 * @link http://www.html5rocks.com/en/tutorials/indexeddb/todo/
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