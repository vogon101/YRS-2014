function startGetIcons (usernames, callback) {
	var unames = usernames.length;
	var count = 0;
	var done = [];

	var donefunc = function (error, data) {
		count++;
		done.push(data);
		if (count == unames) {
			callback (error, done);
		}
	}

	getIcons (usernames, donefunc);
}


function getIcons (users, callbackfunc) {
	for (var i = 0; i < users.length; i++) {
		get (users[i], function(error, done) {
			callbackfunc(error, done);
		});
	}
}

function get (user, callbackfunc) {
	var url ="http://www.zakcutner.uk/whatcandidate/api-icons.php?callback=?&name="+user;
	console.log(url)
	$.getJSON(url, function(data) {
		if (data.hasOwnProperty("errors")) {
			callbackfunc (true, null);//error
			console.log(data);
			return;
		}
		trim (data, function(error, done) {
			callbackfunc(error, done);
		});
	});
}

function trim (data, callbackfunc) {

	var done = {"name":data.screen_name, "image":data.profile_image_url};
	callbackfunc(false, done)

}
