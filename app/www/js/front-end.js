var candidates = [{"screen": "KarenPBuckMP", "name": "Karen Buck", "party": "Labour"}, {"screen": "Lindsey4MP", "name": "Lindsey Hall", "party": "Conservative"}];

google.load("visualization", "1", {packages:["corechart"]});
google.setOnLoadCallback(drawChart);

function drawChart() {
	var data = google.visualization.arrayToDataTable([
		["Candidate", "Score", { role: "style" } ],
		["Karen P Buck", 15, 'opacity: 0.2'],
		["Lindsey Hall", -10, 'opacity: 0.2'],
		["Lindsey Hall", 5, 'opacity: 0.2']
		]);

	var view = new google.visualization.DataView(data);

	view.setColumns([
		0,
		1,
		{
			calc: "stringify",
			sourceColumn: 1,
			type: "string",
			role: "annotation"
		},
		2
	]);

	var options = {
		chartArea: {width: '100%', height: '100%'},
		bar: {groupWidth: "60%"},
        legend: { position: "none" },
		vAxis:{
			baselineColor: '#fff',
			gridlineColor: '#fff',
			textPosition: 'none'
		},
		hAxis:{
			baselineColor: 'transparent',
			gridlines:{count: -1}
		},
		annotations: {
			textStyle: {
				fontSize: 13,
				color: '#871b47',
				opacity: 0.8
			}
		},
		fontName: 'Lato Light',
		'tooltip' : {
			trigger: 'none'
		}
	};

	var chart = new google.visualization.BarChart(document.getElementById("barchart_values"));
	chart.draw(view, options);

	google.visualization.events.addListener(chart, 'select', selectHandler);

	function selectHandler() {
		showCandidate(candidates[chart.getSelection()[0].row]);
	}
}

function showCandidate(data) {
	var twitter = '@' + data.screen;
	var name = data.name;
	var party = data.party + ' Party';
	console.log(twitter);
	console.log(party);
	console.log(name);
}

var swipe = false;
var colours = ['a87edf', '89e18a', 'd26b4a', '7bd0c6', 'd4bc4e'];

$(function() {
	var usernames = ['KarenPBuckMP', 'Lindsey4WNorth'];
	
	if(!localStorage.stats) {
		var stats = new Object();
		$.each(usernames, function(index, value) {
			stats[value] = 0 
		});
		localStorage.stats = JSON.stringify(stats);
	}

	startGet(usernames, function(error, data) {
		if(!error) {
			$.each(data, function(index, value) {
				var url = 'http://identicon.org/?t=' + Math.random().toString(36).substr(2, 5) + '&s=30&c=' + colours[index % colours.length];
				if(index == 0) {
					var element = $('<li class="' + value.user.screen_name + '"><div class="tweet active"><div class="icon-outer"><div class="icon-middle"><img class="icon" src="' + url + '"/></div></div><div class="text">' + value.text + '</div></div><div class="tick"></div><div class="cross"></div></li>')
				}
				else {
					var element = $('<li class="' + value.user.screen_name + '"><div class="tweet"><div class="icon-outer"><div class="icon-middle"><img class="icon" src="' + url + '"/></div></div><div class="text">' + value.text + '</div></div></li>');
				}
				$('ul').append(element);
				element.linkify();
			});
		}
		else {
			console.log('Error fetching Twitter data!')
		}
	});

	$('html').swipe({
		swipe: function(event, direction, distance, duration, fingerCount, fingerData) {
			if(direction == 'down' && fingerCount == 0) {
				$('.tweets').animate({marginLeft: '-100%', marginRight: '100%'}, 400);
				$('.stats').animate({marginLeft: '0'}, 400);
			}
			else if((direction == 'left' || direction == 'right') && direction != swipe) {
				if(swipe) {
					$('.tweet.active').animate({marginRight: '0', marginLeft: '0'}, 100);
					swipe = false;
				}
				else {
					if(direction == 'right') {
						$('.tweet.active').animate({marginLeft: '80px', marginRight: '-80px'}, 100);
						swipe = 'right';
					}
					else {
						$('.tweet.active').animate({marginRight: '80px', marginLeft: '-80px'}, 100);
						swipe = 'left';	
					}
				}
			}
			else if(direction == 'up') {
				switch(swipe) {
					case 'left':
						var result = -1;
						break;
					case 'right':
						var result = 1;
						break;
					default:
						var result = 0;
				}

				var stats = JSON.parse(localStorage.stats);
				stats[$('.tweet.active').parent().attr('class')] += result;
				localStorage.stats = JSON.stringify(stats);

				$('.tweet.active').parent().animate({marginTop: '-131px'}, 200, function() {
					$(this).remove();
					swipe = false;
					$('.tweet').first().addClass('active').after('<div class="tick"></div><div class="cross"></div>');
				});
			}
		},
		threshhold: 0
	});
});