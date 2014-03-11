/*  Isotope utility GetUnitWidth
    ========================================================================== */
function getUnitWidth() {
    var width;
    if ($container.width() <= 320) {
        // console.log("320");
        width = Math.floor($container.width() / 1);
    } else if ($container.width() >= 321 && $container.width() <= 480) {
        //console.log("321 - 480");
        width = Math.floor($container.width() / 2);
    } else if ($container.width() >= 481 && $container.width() <= 768) {
        //console.log("481 - 768");
        width = Math.floor($container.width() / 4);
    } else if ($container.width() >= 769 && $container.width() <= 979) {
        //console.log("769 - 979");
        width = Math.floor($container.width() / 6);
    } else if ($container.width() >= 980 && $container.width() <= 1200) {
        //console.log("980 - 1200");
        width = Math.floor($container.width() / 6);
    } else if ($container.width() >= 1201 && $container.width() <= 1600) {
        //console.log("1201 - 1600");
        width = Math.floor($container.width() / 8);
    } else if ($container.width() >= 1601 && $container.width() <= 1824) {
        //console.log("1601 - 1824");
        width = Math.floor($container.width() / 10);
    } else if ($container.width() >= 1825) {
        //console.log("1825");
        width = Math.floor($container.width() / 12);
    }
    return width;
}


/*  Isotope utility SetWidths
    ========================================================================== */
function setWidths() {
    var unitWidth = getUnitWidth() - 0;
    $container.children(":not(.width2)").css({
        width: unitWidth
    });
    
    if ($container.width() <= 320) { 
        $container.children(".width2").css({
            width: unitWidth
        });
    }
    if ($container.width() >= 321 && $container.width() <= 480) {
        // console.log("eccoci 321");
        $container.children(".width2").css({
            width: unitWidth * 1
        });
        $container.children(".width4").css({
            width: unitWidth * 2
        });
        $container.children(".width6").css({
            width: unitWidth * 2
        });
    }
    if ($container.width() >= 481 && $container.width() <= 768) {
        // console.log("480");
        $container.children(".width6").css({
            width: unitWidth * 4
        });
        $container.children(".width4").css({
            width: unitWidth * 4
        });
        $container.children(".width2").css({
            width: unitWidth * 2
        });
    } 
    if ($container.width() >= 769) {
        // console.log("480");
        $container.children(".width6").css({
            width: unitWidth * 6
        });
        $container.children(".width4").css({
            width: unitWidth * 4
        });
        $container.children(".width2").css({
            width: unitWidth * 2
        });
    } 
}

function loadItems($class) {

    var index = 0;
    var delay;
    var time;
    var elements = $class;
    
    jQuery(elements).each(function (index) {
        if (jQuery(this).is('#background')) {
            time = 400;
            delay = 0;
        } else {
            time = speedLoad;
            delay = index * (speedLoad / 4) + 200;
        }
        jQuery(this).delay(delay).animate({opacity: 1}, { delay:400, duration: time, easing: 'easeInCubic', complete: function () {
            if (jQuery(this).hasClass('isotope-item.no-transition')) jQuery(this).removeClass('isotope-item.no-transition').addClass('isotope-item');
        }});
    }) 
    index++;
    
}

function hideTips(event) {  
    if (event.type == 'mouseenter') {
        if (!jQuery.data(this,'title')) jQuery.data(this,'title', jQuery(this).attr('title'));
        if (!jQuery.data(this,'alt')) jQuery.data(this,'alt', jQuery(this).attr('alt'));
        jQuery(this).attr('title','');
        jQuery(this).attr('alt','');
    }

    if (event.type == 'mouseleave'){
        jQuery(this).attr('alt',jQuery.data(this,'alt'));
        jQuery(this).attr('title',jQuery.data(this,'title'));
    }
}

var isoengine = (/Firefox|Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) ? 'jquery' : 'css';

jQuery(document).ready(function() {
    $container = jQuery('#isotope');
    setWidths();
});

jQuery(document).ready(function() {
    /*  Isotope
    ========================================================================== */
    $allcontainer = jQuery('.container-fluid.main');
    $container = jQuery('#isotope');
    // set the widths on page load
    setWidths();
//  $allcontainer.imagesLoaded(function() {
        // initialize Isotope
        $container.isotope({
            animationEngine : isoengine,
            resizable: false,
            // disable normal resizing
            //transformsEnabled: false,
            // set columnWidth to a percentage of container width
            masonry: {
                columnWidth: getUnitWidth()
            },
        });
        jQuery('#blocklayer').hide();
        jQuery('.fr-loading').fadeOut(300, function () {
            jQuery(this).css('top','50%');
        });
        var items = Array();
        jQuery('.progressive').each(function() {
            
            if (jQuery(this).css('opacity') == '0') {
                if (jQuery(this).hasClass('isotope-item')) jQuery(this).removeClass('isotope-item').addClass('isotope-item.no-transition');
                items.push(jQuery(this));
            } 
             
        });
        items.push(jQuery('#background'));
        items.push(jQuery('.flex-direction-nav'));
        setTimeout(function() {
            loadItems(items);
        }, 500);
        
    // filter items when filter link is clicked
    jQuery('#filters a').click(function() {
        jQuery('#filters li').removeClass('active');
        jQuery(this).parent().addClass('active');
        var selector = jQuery(this).attr('data-filter');
        $container.isotope({
            filter: selector
        });
        return false;
    });
    // update columnWidth on window resize
    jQuery(window).smartresize(function() {
        //setGMapHeight();
        //getUnitW();
        // set the widths on resize
        setWidths();
        // reinit isotop
        $container.isotope({
            //animationEngine : 'jquery',
            //transformsEnabled: false,
            // update columnWidth to a percentage of container width
            masonry: {
                columnWidth: getUnitWidth()
            }
        });
        
    }).resize();
