
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
