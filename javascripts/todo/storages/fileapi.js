/**
 * File API implementation
 */
var FileAPI = function(render) {
	var onError = function(e) {
		var msg = '';

		switch(e.code)
		{
			case FileError.QUOTA_EXCEEDED_ERR:
				msg = 'QUOTA_EXCEEDED_ERR';
				break;
			case FileError.NOT_FOUND_ERR:
				msg = 'NOT_FOUND_ERR';
				break;
			case FileError.SECURITY_ERR:
				msg = 'SECURITY_ERR';
				break;
			case FileError.INVALID_MODIFICATION_ERR:
				msg = 'INVALID_MODIFICATION_ERR';
				break;
			case FileError.INVALID_STATE_ERR:
				msg = 'INVALID_STATE_ERR';
				break;
			default:
				msg = 'Unknown Error';
				break;
		};

		alert("There has been an error: " + msg);
	};

	// The file system has been prefixed as of Google Chrome 12:
	window.storageInfo  = window.storageInfo || window.webkitStorageInfo;
	window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
	window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder;

	var size = 5 * 1024*1024; // 5MB

	return {
		/**
		 * Adds an item to the store.
		 *
		 * @param item
		 */
		add: function(item) {
			// request quota for persistent store
			window.storageInfo.requestQuota(
				PERSISTENT,
				size,
				function(grantedBytes) {
					window.requestFileSystem(
						PERSISTENT,
						grantedBytes,
						function(fs){
							fs.root.getFile(
								'todo.txt',
								{
									create: true
								},
								function(fileEntry) {
									fileEntry.createWriter(
										function(fileWriter) {
											var bb = new window.BlobBuilder();
											bb.append(JSON.stringify(item)+"\n");

											fileWriter.seek(fileWriter.length);
											fileWriter.write(bb.getBlob('text/plain'));
										},
										onError
									);
								},
								onError
							);
						},
						onError
					);
				},
				function(e) {
					onError(e);
				}
			);
		},
		/**
		 * Removes an item by the given id from the store.
		 *
		 * @param id
		 */
		remove: function(id) {
		},
		/**
		 * Returns a list of todo objects from store.
		 */
		read: function(renderer) {
			// request quota for persistent store
			window.storageInfo.requestQuota(
				PERSISTENT,
				size,
				function(grantedBytes) {
					window.requestFileSystem(
						PERSISTENT,
						grantedBytes,
						function(fs){
							fs.root.getFile(
								'todo.txt',
								{
									create: true
								},
								function(fileEntry) {
									fileEntry.file(function(file){
										var reader       = new FileReader();
										reader.onloadend = function(e) {
											if (evt.target.readyState == FileReader.DONE) {
												var items = this.result.split("\n");
												var idCnt = 1;
												$.each(items, function(idx, item) {
													// ignore empty lines
													if(item.indexOf("}") > 0)
													{
														// render found todo item
														var obj = JSON.parse(item);
														obj.id  = idCnt++;
														render(obj);
													}
												});
											}
										};

										reader.readAsText(file);
									});
								},
								onError
							);
						},
						onError
					);
				},
				function(e) {
					onError(e);
				}
			);
		}
	};
};