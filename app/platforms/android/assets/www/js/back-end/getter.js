function start (users, callback) {
	for (var i = 0; i < users.length; i++) {
		get (users[i], function() {
			callback();
		});
	}
}

function get (user, callback) {
	var url ="http://www.zakcutner.uk/whatcandidate/api.php?callback=?&name="+user;
	console.log(url);

	$.getJSON("http://www.zakcutner.uk/whatcandidate/api.php?callback=?&name="+user, function(data) {
		trim (data, function() {
			console.log(data);
			callback();
		});
	});
}

function trim (data, callabck) {
	console.log(data);

	var done = [];
	for (var i = 0; i < data.length; i++) {
		done[i] = {"text":data[i].text, "id":data[i].id, "user":{"screen_name":data[i].user.screen_name, "name":data[i].user.name}};
	}

	algo (done, function () {
		callback();
	});

}

function algo (data, callback) {

	var done = [];
	for (var i = 0; i < data.length; i++) {
		console.log (data[i].text);

		var search = new RegExp(data[i].user.name, "ig");
		data[i].text = data[i].text.replace(search, "----");

		var search = new RegExp(data[i].user.screen_name, "ig");
		data[i].text = data[i].text.replace(search, "----");

		console.log (data[i].text);
		done.push(data[i]);
	}

	dbin(done, function () {
		callback();
	});

}

function dbin (data, callback) {
	
	done = data;

	console.log(data);

	callback();

}
