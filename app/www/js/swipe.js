var swipe = false;

$(document).ready(function() {
	$('div.tweet:odd').addClass('odd');
});

$('body').hammer().on('swipe', function(data) {
	console.log(data.gesture.direction);
	if(data.gesture.direction != swipe) {
		if(swipe) {
			$('.tweet.active').animate({marginRight: '0', marginLeft: '0'}, 100);
			swipe = false;
		}
		else {
			if(data.gesture.direction == 4) {
				$('.tweet.active').animate({marginLeft: '80px', marginRight: '-80px'}, 100);
				swipe = 4;
			}
			else {
				$('.tweet.active').animate({marginRight: '80px', marginLeft: '-80px'}, 100);
				swipe = 2;	
			}
		}
	}
});

$('body').hammer().on('swipeup', function(data) {
	alert('hi');
});