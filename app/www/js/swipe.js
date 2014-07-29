$('.content').hammer().on("swipe", function(ev) {
	$('li').animate({height: '500px'}, 5000);
});