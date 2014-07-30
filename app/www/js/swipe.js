var swipe = false;
var colours = ['a87edf', '89e18a', 'd26b4a', '7bd0c6', 'd4bc4e'];

$(function() {
	if(!localStorage.stats) {
		localStorage.stats = '{"conservative": 0, "labour": 0}';	
	}

	var usernames = ['vogonjeltz101', 'CashClamber', 'KarenPBuckMP', 'WCandidate'];

	startGet(usernames, function(error, data) {
		if(!error) {
			$.each(data, function(index, value) {
				var url = 'http://identicon.org/?t=' + Math.random().toString(36).substr(2, 5) + '&s=30&c=' + colours[index % colours.length];
				if(index == 0) {
					var element = $('<li class="conservative"><div class="tweet active"><div class="icon-outer"><div class="icon-middle"><img class="icon" src="' + url + '"/></div></div><div class="text">' + value.text + '</div></div><div class="tick"></div><div class="cross"></div></li>')
				}
				else {
					var element = $('<li class="conservative"><div class="tweet"><div class="icon-outer"><div class="icon-middle"><img class="icon" src="' + url + '"/></div></div><div class="text">' + value.text + '</div></div></li>');
				}
				$('ul').append(element);
			});
		}
		else {
			console.log('Error fetching Twitter data!')
		}
	});

	$('html').swipe({
		swipe: function(event, direction, distance, duration, fingerCount, fingerData) {
			if((direction == 'left' || direction == 'right') && direction != swipe) {
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