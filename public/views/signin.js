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
                    console.log('failure');
                }
            },
            
        }).done(function(data) {
            console.log('plz work');
        });
    });
});