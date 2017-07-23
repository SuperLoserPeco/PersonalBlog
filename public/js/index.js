
$(function(){
	var $loginBox = $('#loginBox');
	var $registerBox = $('#registerBox');

	$loginBox.find('a').on('click', function(){
		$registerBox.show();
		$loginBox.hide();
	});

	$registerBox.find('a').on('click', function(){
		$loginBox.show();
		$registerBox.hide();
	});


})