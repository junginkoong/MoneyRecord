$(document).ready(function(){
    $('#signup').submit(function (e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/signup',
            dataType: 'text',
            data: {
                email: $('input[name=email]').val(),
                password: $('input[name=password]').val(),
                first_name: $('input[name=first_name]').val(),
                last_name: $('input[name=last_name]').val()
            },
            success: function(data, textStatus, xhr){
                if(xhr.status == 200) {
                    window.location.href = '/signin';   
                }else{
                    // select error message and enable it.
                    console.log('failure');
                }
            },
        });
    });
});