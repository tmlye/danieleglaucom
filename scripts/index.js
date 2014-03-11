$(document).ready(function() {
    $(window).resize();
});

$(window).resize(function() {
    $("#grid-wrapper").css("margin-top", $("#bigimage").outerHeight());
    $('#ib-img-preview').css({
        width : $(window).width(),
        height : $(window).height()
    })
});

$(window).scroll(function() {
    // if ($(document).scrollTop() > 10) {
        // $(".conditional-top-nav").fadeIn(700);
    // } else {
        // $(".conditional-top-nav").fadeOut(700);
    // }
});

$(function() {
    var $gridWrapper = $('#grid-wrapper');
    var $container = $('#grid-wrapper');

    $container.isotope({
        itemSelector: '.grid-item'
    });

    Template = (function() {
        current = -1,
        $gridItems = $gridWrapper.find('div.grid-item > a'),
        imgItemsCount = $gridItems.length,
        isAnimating = false,

        init = function() {
            $gridItems.addClass('gridItem');
            $gridItems.bind('click.ibTemplate', function(ev) {
                openItem($(this));
                return false;
            });
        },

        openItem = function($item) {
            if (isAnimating){
                return false;
            }

            current = $item.index('.gridItem');
            loadImgPreview($item, function() {
                isAnimating = false;
            });

        },

        loadImgPreview = function($item, callback) {
            var largeSrc = $item.children('img').data('largesrc'),
                // description     = $item.children('span').text(),
                largeImageData = {
                    src : largeSrc,
                    // description : description
                };
            // preload large image
            $item.addClass('ib-loading');
            preloadImage(largeSrc, function() {
                // disable scrolling
                $('body').addClass('disable-scroll');
                $item.removeClass('ib-loading');
                var hasImgPreview   = ($('#ib-img-preview').length > 0);
                if (!hasImgPreview){
                    $('#previewTmpl').tmpl(largeImageData).insertAfter($gridWrapper);
                } else {
                    $('#ib-img-preview').children('img.ib-preview-img')
                                        .attr('src', largeSrc)
                                        .end();
                                        // .find('span.ib-preview-descr')
                                        // .text( description );
                }
                //get dimentions for the image, based on the windows size
                var dim = getImageDim(largeSrc);
                $item.removeClass('ib-img-loading');
                //set the returned values and show/animate preview
                $('#ib-img-preview').css({
                    width   : $item.width(),
                    height  : $item.height(),
                    left    : $item.offset().left,
                    top     : $item.offset().top
                }).children('img.ib-preview-img').hide().css({
                    width   : dim.width,
                    height  : dim.height,
                    left    : dim.left,
                    top     : dim.top
                }).fadeIn(400).end().show().animate({
                    width   : $(window).width(),
                    left    : 0
                }, 500, 'easeOutExpo', function() {
                    $(this).animate({
                        height  : $(window).height(),
                        top     : $(document).scrollTop()
                    }, 400, function() {
                        var $this   = $(this);
                        $this.find('span.ib-close').show()
                        if (imgItemsCount > 1) {
                            $this.find('div.ib-nav').show();
                        }

                        if (callback) {
                            callback.call();
                        }
                    });
                });

                if (!hasImgPreview) {
                    initImgPreviewEvents();
                }
            });
    },

    preloadImage = function(src, callback) {
        $('<img/>').load(function() {
            if (callback) callback.call();
        }).attr('src', src);
    },

    initImgPreviewEvents = function() {
        var $preview = $('#ib-img-preview');
        $preview.find('span.ib-nav-prev').bind('click.ibTemplate', function( event ) {
            navigate('prev');
        }).end().find('span.ib-nav-next').bind('click.ibTemplate', function( event ) {
            navigate('next');
        }).end().find('span.ib-close').bind('click.ibTemplate', function( event ) {
            closeImgPreview();
        });
        //resizing the window resizes the preview image
        $(window).bind('resize.ibTemplate', function(event) {
            var $largeImg   = $preview.children('img.ib-preview-img'),
                dim         = getImageDim( $largeImg.attr('src') );
            $largeImg.css({
                width   : dim.width,
                height  : dim.height,
                left    : dim.left,
                top     : dim.top
            })
        });
    },

    // navigate the image items in fullscreen mode
    navigate = function(dir) {
        if(isAnimating) return false;
        isAnimating = true;
        var $preview = $('#ib-img-preview'),
            $loading = $preview.find('div.ib-loading-large');
        $loading.show();

        if (dir === 'next') {
            (current === imgItemsCount - 1) ? current = 0 : ++current;
        } else if (dir === 'prev') {
            (current === 0) ? current = imgItemsCount - 1 : --current;
        }

        var $item       = $gridItems.eq(current),
            largeSrc    = $item.children('img').data('largesrc');
            // description = $item.children('span').text();

        preloadImage(largeSrc, function() {
            $loading.hide();
            //get dimentions for the image, based on the windows size
            var dim = getImageDim( largeSrc );
            $preview.children('img.ib-preview-img')
                            .attr( 'src', largeSrc )
                            .css({
                width   : dim.width,
                height  : dim.height,
                left    : dim.left,
                top     : dim.top
                            })
                            .end();
                            // .find('span.ib-preview-descr')
                            // .text( description );

            // $gridWrapper.scrollTop($("#bigimage").outerHeight())
                      // .scrollLeft($item.offset().left);

            isAnimating = false;
        });
    },

    closeImgPreview = function() {
        if( isAnimating ) return false;
        isAnimating = true;

        var $item = $gridItems.eq(current);
        $('#ib-img-preview').find('div.ib-nav, span.ib-close')
                        .hide()
                        .end()
                        .animate({
                            height  : $item.height(),
                            top     : $item.offset().top
                            }, 500, 'easeOutExpo', function() {
                            $(this).animate({
                                width   : $item.width(),
                                left    : $item.offset().left
                                }, 400, function() {
                                    $(this).fadeOut(function() {isAnimating = false;});
                            } );
                        });
        $('body').removeClass('disable-scroll');
    },

    getImageDim = function(src) {
        var img = new Image();
        img.src = src;

        var w_w = $(window).width(),
            w_h = $(window).height(),
            r_w = w_h / w_w,
            i_w = img.width,
            i_h = img.height,
            r_i = i_h / i_w,
            new_w, new_h,
            new_left, new_top;

        if (r_w > r_i) {
            new_h   = w_h;
            new_w   = w_h / r_i;
        } else {
            new_h   = w_w * r_i;
            new_w   = w_w;
        }

        return {
            width   : new_w,
            height  : new_h,
            left    : (w_w - new_w) / 2,
            top     : (w_h - new_h) / 2
        };
    };

    return { init : init };
})();

    Template.init();
});

var grid = {
    init:function() {
    }
}

