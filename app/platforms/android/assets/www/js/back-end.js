var search;

function startGet (usernames, callback) {
	var unames = usernames.length;
	var count = 0;
	var done = [];

	var donefunc = function (error, data) {
		if (error) {
			//There is an error
			//no data is returned
			callback (error, null);
			return;
		} else {
			//run as normal
			count ++;
			//adding arrays together
			for (var i = 0; i < data.length; i++)  {
				done.push(data[i]);		
			}
			if (count == unames) {
				//Now sort
				done.sort(compare);
				callback (false, done);
			}

			
		}
	}

	getTweets (usernames, donefunc);
}

//Function to compare tweets for sorting
function compare(a,b) {
  if (a.id < b.id)
     return 1;
  if (a.id > b.id)
    return -1;
  return 0;
}


function getTweets (users, callbackfunc) {
	for (var i = 0; i < users.length; i++) {
		get (users[i], function(error, done) {
			callbackfunc(error, done);
		});
	}
}

function get (user, callbackfunc) {
	var url ="http://www.zakcutner.uk/whatcandidate/api-tweets.php?callback=?&name="+user;

	$.getJSON(url, function(data) {
		if (data.hasOwnProperty("errors")) {
			callbackfunc (true, null);//error
			return;
		}
		trim (data, function(error, done) {
			callbackfunc(error, done);
		});
	});
}

function trim (data, callbackfunc) {

	var done = [];
	for (var i = 0; i < data.length; i++) {
		done[i] = {"text":data[i].text, "id":data[i].id, "user":{"screen_name":data[i].user.screen_name, "name":data[i].user.name}};
	}

	algo (done, function (error, done) {
		callbackfunc(error, done);
	});

}

function algo (data, callback) {

	var names =["labour", "conservative", "tory", "liberal democrat", "libdem", "bnp", "ukip", "green party"]; 
	var done = [];
	for (var i = 0; i < data.length; i++) {
		var replace = "<span class='hide'>CENSORED</span>";

		data[i].text = data[i].text.replace(data[i].user.screen_name, replace);
		data[i].text = data[i].text.replace(data[i].user.name, replace);

		$.each(names, function (index, value) {
			exp = new RegExp (names[index]+"s?", "ig");
			data[i].text = data[i].text.replace(exp, replace);			
		});


  

		done.push(data[i]);
	}

	callback (false, done);

}

