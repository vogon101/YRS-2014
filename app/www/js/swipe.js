var swipe = false;

$(function() {
	//$('div.tweet:odd').addClass('odd');

	$('body').swipe({
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
				alert(swipe);
			}
		},
		threshhold: 0
	});
});