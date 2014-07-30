var elections = new Date('05/07/2015');
var today = new Date();
var diff =  Math.floor(( Date.parse(elections) - Date.parse(today) ) / 86400000);
$('.timer').html('<span class="emph">' + diff + ' days</span><br/>until the elections!');

function showCandidate(data) {
	var twitter = '@' + data.screen;
	var name = data.name;
	var party = data.party + ' Party';
	console.log(twitter);
	console.log(party);
	console.log(name);
}

setTimeout(function() {showCandidate({'screen': 'KarenPBuckMP', 'name': 'Karen Buck', 'party': 'Labour'})}, 2000);