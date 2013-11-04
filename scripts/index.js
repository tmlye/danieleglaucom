$(document).ready(function() {
    $(window).resize();
});

$(window).resize(function() {
    $("#ib-main-wrapper").css("padding-top", $("#bigimage").outerHeight());
});

$(window).scroll(function() {
    // if ($(document).scrollTop() > 10) {
        // $(".conditional-top-nav").fadeIn(700);
    // } else {
        // $(".conditional-top-nav").fadeOut(700);
    // }
});


