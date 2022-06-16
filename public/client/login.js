// $(document).ready(function() {
//     $('form').submit(function() {
//         $.ajax({
//             url: '/login',
//             type: 'POST',
//             data: {email: $('input[name="email"]').val(), password: $('input[name="password"]').val()},
//             dataType: 'json',
//             success: function(data, textStatus, jqXHR){
//                 if (typeof data.redirect == 'string'){
//                     window.location = data.redirect
//                 }
//             }
//         });
//     });
// });

// $.post({
//     url: "/login",
//     data: {email: $('input[name="email"]').val(), password: $('input[name="password"]').val()},
//     dataType: 'json',
//     success: function (data) {
//         console.log("Success");
//     },
// })