$('.content').hammer().on("swipe", function(data) {
	$('li').animate({height: '500px'}, 500);
});