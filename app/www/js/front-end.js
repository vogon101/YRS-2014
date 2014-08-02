var activeTweet = false;
var swipe = false;
var colours = ['a87edf', '89e18a', 'd26b4a', '7bd0c6', 'd4bc4e'];
var darkColours = ['8c6bb8', '74ba74', 'ae5c41', '69aca4', 'af9c45'];
var candidates = {
	'screen': ['KarenPBuckMP', 'Lindsey4WNorth'],
	'name': ['Karen Buck', 'Lindsey Hall'],
	'party': ['Labour Party', 'Conservative Party']
};

Date.prototype.sameDateAs = function(pDate){
	return ((this.getFullYear()==pDate.getFullYear())&&(this.getMonth()==pDate.getMonth())&&(this.getDate()==pDate.getDate()));
}

function setStats() {
	$.each(['screen', 'name', 'party'], function(i, valueA) {
		$.each(candidates[valueA], function(j, valueB) {
			if(valueA == 'screen') {
				valueB = '@' + valueB;
			}
			$('span.' + valueA + ':eq(' + j + ')').html(valueB);
		});
	});
	updateStats();
}

function updateStats() {
	var getStats = JSON.parse(localStorage.stats);
	$.each(candidates.screen, function(index, value) {
		$('span.direction:eq(' + index + ')').html(getStats[value]['direction']);
		$('span.dislike:eq(' + index + ')').html(getStats[value]['all-dislikes']);
		$('span.score:eq(' + index + ')').html(getStats[value]['score']);
		$('span.likes:eq(' + index + ')').html(getStats[value]['all-likes']);
	});
}

function updateDirection() {
	var stats = JSON.parse(localStorage.stats);

	$.each(candidates.screen, function(index, value) {
		if(stats[value]['today-score'] < stats[value]['yesterday-score']) {
			stats[value]['direction'] = '&#x25BC;';
		}
		else {
			stats[value]['direction'] = '&#x25B2;';
		}
	});
	localStorage.stats = JSON.stringify(stats);
}

function checkDate() {
	var today = new Date();
	var date = new Date(localStorage.date);
	var stats = JSON.parse(localStorage.stats);
	
	if(today.sameDateAs(date) == false) {
		$.each(candidates.screen, function(index, value) {
			stats[value]['yesterday-score'] = stats[value]['today-score'];
			stats[value]['today-score'] = 0;
		});
		localStorage.date = today;
		localStorage.stats = JSON.stringify(stats);
	}
}

$(function() {
	if(!localStorage.stats) {
		var stats = new Object();
		$.each(candidates.screen, function(index, value) {
			stats[value] = {
				'score': 0,
				'all-likes': 0,
				'all-dislikes': 0,
				'today-score': 0,
				'yesterday-score': 0,
				'direction': '&#x25B2'
			}; 
		});
		localStorage.stats = JSON.stringify(stats);
	}

	if(!localStorage.date) {
		var yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);
		localStorage.date = yesterday;
	}

	$.each(candidates.screen, function(index, value) {
		var term = index % colours.length;
		var lightColour = colours[term];
		var darkColour = darkColours[term];
		$('ul').append('<li class="candidate-entry"><div class="candidate" style="background-color: #' + lightColour + '"><div class="info"><span style="font-size: 15px" class="name">Karen Buck MP</span><br/><span style="font-size: 14px" class="screen">@KarenPBuckMP</span><br/><span style="font-style: italic; font-size: 14px" class="party">Labour Party</span><br/></div><div class="stats"><p style="margin: 0 0 -2px 0;"><span class="direction"></span>&nbsp;<span class="score" style="background-color: #ffffff; color: #' + darkColour + '; padding-left: 4px; padding-right: 4px; font-size: 25px"></span></p><span style="font-size: 14px; line-height: 5px"><p><span class="likes"></span> Likes</p><p><span class="dislike"></span> Disklikes</p></span></div></div></li>');
	});

	checkDate();
	setStats();
	updateDirection();

	startGet(candidates.screen, function(error, data) {
		if(!error) {
			$.each(data, function(index, value) {
				var url = 'http://identicon.org/?t=' + Math.random().toString(36).substr(2, 5) + '&s=30&c=' + colours[index % colours.length];
				if(index == 0) {
					var element = $('<li class="' + value.user.screen_name + '"><div class="tweet active"><div class="icon-outer"><div class="icon-middle"><img class="icon" src="' + url + '"/></div></div><div class="text">' + value.text + '</div></div><div class="tick"></div><div class="cross"></div></li>');
				}
				else {
					var element = $('<li class="' + value.user.screen_name + '"><div class="tweet"><div class="icon-outer"><div class="icon-middle"><img class="icon" src="' + url + '"/></div></div><div class="text">' + value.text + '</div></div></li>');
				}
				$('ul').append(element);
				element.linkify();
			});
		}
		else {
			console.log('Error fetching Twitter data!');
		}
	});

	$('html').swipe({
		swipe: function(event, direction, distance, duration, fingerCount, fingerData) {
			if(direction == 'down') {
				activeTweet = $('.active');
				activeTweet.removeClass('active');
				$('li.candidate-entry').animate({marginTop: '0'}, 400);
			}
			else if((direction == 'left' || direction == 'right') && direction != swipe) {
				if(swipe) {
					$('.active').animate({marginRight: '0', marginLeft: '0'}, 100);
					swipe = false;
				}
				else {
					if(direction == 'right') {
						$('.active').animate({marginLeft: '80px', marginRight: '-80px'}, 100);
						swipe = 'right';
					}
					else {
						$('.active').animate({marginRight: '80px', marginLeft: '-80px'}, 100);
						swipe = 'left';	
					}
				}
			}
			else if(direction == 'up') {
				if(activeTweet) {
					$('li.candidate-entry').animate({marginTop: '-130px'}, 400);
					activeTweet.addClass('active');
					activeTweet = false;
				}
				else {
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

					checkDate();

					var stats = JSON.parse(localStorage.stats);

					stats[$('.active').parent().attr('class')]['score'] += result;
					stats[$('.active').parent().attr('class')]['today-score'] += result;


					if(stats[$('.active').parent().attr('class')]['today-score'] < stats[$('.active').parent().attr('class')]['yesterday-score']) {
						stats[$('.active').parent().attr('class')]['direction'] = '&#x25BC;';
					}
					else {
						stats[$('.active').parent().attr('class')]['direction'] = '&#x25B2;';
					}

					if (result == 1) {
						stats[$('.active').parent().attr('class')]['all-likes'] += 1;
					}
					else if (result == -1) {
						stats[$('.active').parent().attr('class')]['all-dislikes'] += 1;
					}

					localStorage.stats = JSON.stringify(stats);

					$('.active').parent().animate({marginTop: '-131px'}, 200, function() {
						$(this).remove();
						swipe = false;
						$('.tweet').first().addClass('active').after('<div class="tick"></div><div class="cross"></div>');
					});
				}
			}
			updateStats();
		},
		threshhold: 0
	});
});