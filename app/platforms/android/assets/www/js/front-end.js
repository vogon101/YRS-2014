var activeTweet = false;
var swipe = false;
var colours = ['a87edf', '89e18a', 'd26b4a', '7bd0c6', 'd4bc4e'];
var usernames = ['KarenPBuckMP', 'Lindsey4WNorth'];

function updateStats() {
	var getStats = JSON.parse(localStorage.stats);
	$.each(usernames, function(index, value) {
		$('span.direction:eq(' + index + ')').html(getStats[value]['direction']);
		$('span.score:eq(' + index + ')').html(getStats[value]['score']);
		$('span.likes:eq(' + index + ')').html(getStats[value]['all-likes']);
		$('span.dislike:eq(' + index + ')').html(getStats[value]['all-dislikes']);
	});
}

$(function() {
	if(!localStorage.stats) {
		var stats = new Object();
		$.each(usernames, function(index, value) {
			stats[value] = {"score":0, "all-likes":0, "all-dislikes":0, "today-score":0, "yesterday-score":0, "direction": "&#x25B2"}; 
		});
		localStorage.stats = JSON.stringify(stats);
	}

	var getStats = JSON.parse(localStorage.stats);
	$('div.stats:eq(0)').append('<p style="margin: 0 0 -2px 0;"><span class="direction">' + getStats.KarenPBuckMP['direction'] + '</span>&nbsp;<span class="score">' + getStats.KarenPBuckMP['score'] + '</span></p><span style="font-size: 14px; line-height: 5px"><p><span class="likes">' + getStats.KarenPBuckMP['all-likes'] + '</span> Likes</p><p><span class="dislike">' + getStats.KarenPBuckMP['all-dislikes'] + '</span> Disklikes</p></span>');
	$('div.stats:eq(1)').append('<p style="margin: 0 0 -2px 0;"><span class="direction">' + getStats.Lindsey4WNorth['direction'] + '</span>&nbsp;<span class="score">' + getStats.Lindsey4WNorth['score'] + '</span></p><span style="font-size: 14px; line-height: 5px"><p><span class="likes">' + getStats.Lindsey4WNorth['all-likes'] + '</span> Likes</p><p><span class="dislike">' + getStats.Lindsey4WNorth['all-dislikes'] + '</span> Disklikes</p></span>');

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
			if(direction == 'down') {

				activeTweet = $('.tweet.active');
				activeTweet.removeClass('active');
				$('li.candidate-entry').animate({marginTop: '0'}, 400);
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

					var stats = JSON.parse(localStorage.stats);
					stats[$('.tweet.active').parent().attr('class')]['score'] += result;
					stats[$('.tweet.active').parent().attr('class')]['today-score'] += result;

					if(stats[$('.tweet.active').parent().attr('class')]['today-score'] > stats[$('.tweet.active').parent().attr('class')]['yesterday-score']) {
						stats[$('.tweet.active').parent().attr('class')]['direction'] = '&#x25B2;';
					}
					else {
						stats[$('.tweet.active').parent().attr('class')]['direction'] = '&#x25BC;';
					}

					if (result == 1) {
						stats[$('.tweet.active').parent().attr('class')]['all-likes'] += 1;
					}
					if (result == -1) {
						stats[$('.tweet.active').parent().attr('class')]['all-dislikes'] += 1;
					}
					//stats[$('.tweet.active').parent().attr('class')]['score'] += result;
					localStorage.stats = JSON.stringify(stats);

					$('.tweet.active').parent().animate({marginTop: '-131px'}, 200, function() {
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