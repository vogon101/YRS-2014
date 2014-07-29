var swipe = false;
var colours = ['A87EDF', '89E18A', 'D26B4A', '7BD0C6'];

for(var i = 0; i < 40; i++) {
	$('li:nth-child(2)').after('<li><div class="tweet"><div class="icon-outer"><div class="icon-middle"><img class="icon"/></div></div><div class="text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer eu felis eget enim iaculis bibendum eget id felis. Integer risus cras amet.</div></div></li>');
}

$('img.icon').each(function(index) {
	var url = 'http://identicon.org/?t=' + Math.random().toString(36).substr(2, 5) + '&s=50&c=' + colours[index % colours.length];
	$(this).attr('src', url);
	console.log();
});

$(function() {
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
				$('.tweet.active').parent().animate({marginTop: '-131px'}, 200, function() {
					$(this).remove();
					$('.tweet').first().addClass('active').after('<div class="tick"></div><div class="cross"></div>');
				});
			}
		},
		threshhold: 0
	});
});