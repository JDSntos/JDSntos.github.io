$(document).ready(function () {
    $('.sidenav #navList > .nav-item').click(function (e) {
        $('.sidenav #navList > .nav-item').removeClass('active');
        $(this).addClass('active');
    });
});
