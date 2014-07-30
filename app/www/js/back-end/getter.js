function getTweets (users, callback) {
	for (var i = 0; i < users.length; i++) {
		get (users[i], function(error, done) {
			callback(error, done);
		});
	}
}

function get (user, callback) {
	var url ="http://www.zakcutner.uk/whatcandidate/api.php?callback=?&name="+user;
	console.log(url);

	$.getJSON(url, function(data) {
		if (data.hasOwnProperty("errors")) {
			callback (true, null);//error
			return;
		}
		trim (data, function(error, done) {
			callback(error, done);
		});
	});
}

function trim (data, callabck) {

	var done = [];
	for (var i = 0; i < data.length; i++) {
		done[i] = {"text":data[i].text, "id":data[i].id, "user":{"screen_name":data[i].user.screen_name, "name":data[i].user.name}};
	}

	algo (done, function (error, done) {
		callback(error, done);
	});

}

function algo (data, callback) {

	var done = [];
	for (var i = 0; i < data.length; i++) {

		var search = new RegExp(data[i].user.name, "ig");
		data[i].text = data[i].text.replace(search, "----");

		var search = new RegExp(data[i].user.screen_name, "ig");
		data[i].text = data[i].text.replace(search, "----");

		done.push(data[i]);
	}

	callback (done, false);

}

