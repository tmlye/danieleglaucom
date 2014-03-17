$(document).ready(function() {
    $(window).resize(); // TODO: remove this?
});

$(window).scroll(function() {
    // if ($(document).scrollTop() > 10) {
        // $(".conditional-top-nav").fadeIn(700);
    // } else {
        // $(".conditional-top-nav").fadeOut(700);
    // }
});

(function() {
    var gridWrapper = $('#grid-wrapper');

    var imagePreviewer = function() {
        var current = -1;
        var isAnimating = false;
        var $gridItems = gridWrapper.find('div.grid-item > a');
        var imgItemsCount = $gridItems.length;

        var init = function() {
            $gridItems.addClass('gridItem');
            $gridItems.bind('click.ibTemplate', function(ev) {
                openItem($(this));
                return false;
            });
        };

        var openItem = function($item) {
            if (isAnimating){
                return false;
            }

            current = $item.index('.gridItem');
            loadImgPreview($item, function() {
                isAnimating = false;
            });

        };

        var loadImgPreview = function($item, callback) {
            var largeSrc = $item.children('img').data('largesrc'),
                // description     = $item.children('span').text(),
                largeImageData = {
                    src : largeSrc,
                    // description : description
                };
            // preload large image
            $item.addClass('ib-loading');
            preloadImage(largeSrc, function(img) {
                // disable scrolling
                $('body').addClass('disable-scroll');
                $item.removeClass('ib-loading');
                var hasImgPreview   = ($('#ib-img-preview').length > 0);
                if (!hasImgPreview){
                    $('#previewTmpl').tmpl(largeImageData).insertAfter(gridWrapper);
                } else {
                    $('#ib-img-preview').children('img.ib-preview-img')
                                        .attr('src', largeSrc)
                                        .end();
                                        // .find('span.ib-preview-descr')
                                        // .text( description );
                }
                //get dimentions for the image, based on the windows size
                var dim = getImageDim(img);
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
        };

        var preloadImage = function(src, callback) {
            var img = new Image();
            img.src = src;

            img.onload = function() {
                callback(img);
            };
        };

        var initImgPreviewEvents = function() {
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
                var $largeImg   = $preview.children('.ib-preview-img');
                var dim         = getImageDim($largeImg);
                $largeImg.css({
                    width   : dim.width,
                    height  : dim.height,
                    left    : dim.left,
                    top     : dim.top
                })
            });
        };

        // navigate the image items in fullscreen mode
        var navigate = function(dir) {
            if(isAnimating) return false;
            isAnimating = true;
            var $preview = $('#ib-img-preview'),
                $loading = $preview.find('div.ib-loading-large');
            $loading.show();

            if (dir === 'next') {
                (current === imgItemsCount - 1) ? current = 0 : current++;
            } else if (dir === 'prev') {
                (current === 0) ? current = imgItemsCount - 1 : current--;
            }

            var $item       = $gridItems.eq(current),
                largeSrc    = $item.children('img').data('largesrc');
                // description = $item.children('span').text();

            preloadImage(largeSrc, function(img) {
                $loading.hide();
                //get dimentions for the image, based on the windows size
                var dim = getImageDim(img);
                $preview.children('img.ib-preview-img')
                        .attr('src', largeSrc)
                        .hide()
                        .css({
                            width   : dim.width,
                            height  : dim.height,
                            left    : dim.left,
                            top     : dim.top
                         }).fadeIn(400);
                        // .end()
                        // .find('span.ib-preview-descr')
                        // .text( description );

                isAnimating = false;
            });
        };

        var closeImgPreview = function() {
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
        };

        var getImageDim = function(img) {
            var w_w = $(window).width(),
                w_h = $(window).height(),
                r_w = w_h / w_w,
                i_w = img.naturalWidth,
                i_h = img.naturalHeight,
                r_i = i_h / i_w,
                new_w, new_h,
                new_left, new_top;

            if (i_w >= i_h) {
                new_w = Math.floor(w_w);
                // check if we're above max and reduce accordingly
                new_h = Math.floor((i_h * w_w) / i_w);
                // same here and below
            }
            else {
                new_w = Math.floor((i_w * w_h) / i_h);
                new_h = w_h;
            }

            return {
                width   : new_w,
                height  : new_h,
                left    : (w_w - new_w) / 2,
                top     : (w_h - new_h) / 2
            };
        };

        init();
    };

    $(window).load(function() {
        $(window).resize();

        loadGrid();
    });

    $(window).resize(function() {
        $('#grid-wrapper').css('margin-top', $('#bigimage').outerHeight());
        $('#ib-img-preview').css({
            width : $(window).width(),
            height : $(window).height()
        });

        setGridColumnWidth();
    });

    loadGrid = function() {
        gridWrapper.isotope({
            itemSelector: '.grid-item',
            layoutMode: 'masonry',
            masonry: {
                columnWidth: '.grid-column'
            }
        });

        var properties =
            [
                {description: "0", class: "width1"},
                {description: "1", class: "width2"},
                {description: "2", class: "width1 grid-column"},
                {description: "3", class: "width1"},
                {description: "4", class: "width1"},
                {description: "5", class: "width1"},
                {description: "6", class: "width1"},
                {description: "7", class: "width2"},
                {description: "8", class: "width1"},
                {description: "9", class: "width1"},
                {description: "10", class: "width1"},
                {description: "11", class: "width2"},
                {description: "12", class: "width2"},
                {description: "13", class: "width2"},
                {description: "14", class: "width1"},
                {description: "15", class: "width1"},
                {description: "16", class: "width1"},
                {description: "17", class: "width1"},
                {description: "18", class: "width1"},
                {description: "19", class: "width1"},
                {description: "20", class: "width1"},
                {description: "21", class: "width2"},
                {description: "22", class: "width2"},
                {description: "23", class: "width1"},
                {description: "24", class: "width1"},
                {description: "25", class: "width1"},
                {description: "26", class: "width1"},
                {description: "27", class: "width1"},
                {description: "28", class: "width1"},
                {description: "29", class: "width2"},
                {description: "30", class: "width2"}
            ];
        var appendElements = [];
        for(var i = 1; i <= 30; i++) {
            var itemToAppend = $('#gridItemTmpl').tmpl(
                    {
                        src: "images/large/" + i + ".jpg",
                        thumbSrc: "images/thumbs/" + i + ".jpg",
                        alt: "Image " + i,
                        description: properties[i].description,
                        classes: properties[i].class
                    });
            appendElements.push($(itemToAppend[0].outerHTML)[0]);
        }

        gridWrapper.isotope('insert', appendElements);
        // gridWrapper.isotope('layoutItems');
        // var evt = document.createEvent('UIEvents');
        // evt.initUIEvent('resize', true, false,window,0);
        // window.dispatchEvent(evt);
        // $(window).resize();
        imagePreviewer();
        $(window).resize();
    };

    /*
     * We're creating a grid with 4 columns
     * Each picture will take up 1, 2, 3 or 4 columns
     * This function calculates the column width
     * based on the grid wrapper width
    */
    calculateColumnWidth = function() {
        var width;
        if (gridWrapper.width() <= 320) {
            width = Math.floor(gridWrapper.width());
        } else if (gridWrapper.width() > 320 && gridWrapper.width() <= 640) {
            width = Math.floor(gridWrapper.width() / 2);
        } else if (gridWrapper.width() > 640 && gridWrapper.width() <= 960) {
            width = Math.floor(gridWrapper.width() / 3);
        } else {
            width = Math.floor(gridWrapper.width() / 4);
        }
        return width;
    };

    setGridColumnWidth = function() {
        var unitWidth = calculateColumnWidth() - 0;

        gridWrapper.children('.width1').css({
            width: unitWidth
        });

        gridWrapper.children('.width2').css({
            width: unitWidth * 2
        });

        gridWrapper.children('.width3').css({
            width: unitWidth * 3
        });

        gridWrapper.children('.width4').css({
            width: unitWidth * 4
        });

       // gridWrapper.isotope('layout');
    };
})();
