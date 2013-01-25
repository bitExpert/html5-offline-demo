/**
 * Web Storage implementation
 */
var WebStorage = function(render) {
	/**
	 * Private helper function to return the last used index.
	 *
	 * @returns Number
	 */
	function get_lastIndex() {
		var idx = localStorage.getItem('lastIndex');
		if((typeof idx === "undefined") || (null == idx) || (NaN == idx))
		{
			idx = 0;
		}

		return parseInt(idx);
	};
	/**
	 * Private helper function to set the last used index.
	 *
	 * @param idx
	 */
	function set_lastIndex(idx) {
		localStorage.setItem('lastIndex', idx);
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
				// for a new item set id
				if((typeof item.id === "undefined") || (null == item.id) || ("" == item.id))
				{
					item.id = get_lastIndex() + 1;
				}

				// store object as string
				localStorage.setItem(item.id, JSON.stringify(item));

				// update the index
				set_lastIndex(item.id);
			}
			catch(ex)
			{
				console.log(ex);
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
				localStorage.removeItem(id);
			}
			catch(ex)
			{
				console.log(ex);
			}
		},
		/**
		 * Returns a list of todo objects from store.
		 */
		read: function() {
			try
			{
				var lastIdx = get_lastIndex();

				for(var i = 1; i <= lastIdx; i++)
				{
					if(null !== localStorage.getItem(i))
					{
						// render found todo item
						render(
							JSON.parse(localStorage.getItem(i))
						);
					}
				}
			}
			catch(ex)
			{
				console.log(ex);
			}
		}
	};
};