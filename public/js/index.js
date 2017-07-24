
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


	$registerBox.find('button').on('click', function(){
		$.ajax({
			type: 'post',
			url: '/api/user/register',
			data: {
				username: $registerBox.find('[name="username"]').val(),
				password: $registerBox.find('[name="password"]').val(),
				repassword: $registerBox.find('[name="repassword"]').val()
			},
			dataType: 'json',
			success: function(result){
				console.log(result)
			}
		});
	})
})