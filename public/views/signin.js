$(document).ready(function(){

    $('#signin').submit(function (e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/signin',
            dataType: 'text',
            data: {
                email: $('input[name=email]').val(),
                password: $('input[name=password]').val()
            },
            success: function(data, textStatus, xhr){
                if(xhr.status == 200) {
                    window.location.href = '/';   
                }else{
                    $("#error_notif").show();
                }
            },
            
        });
    });

    var forms = document.querySelectorAll('.needs-validation');
    Array.prototype.slice.call(forms)
		.forEach(function (form) {
			form.addEventListener('submit', function (event) {
				if (!form.checkValidity()) {
					event.preventDefault()
					event.stopPropagation()
				}

				form.classList.add('was-validated')
			}, false);
		});
});