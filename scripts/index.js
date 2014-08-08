(function(window) {
    var gridWrapper = $('#grid-wrapper');

    window.onload = function() {
        $(window).resize();

        loadGrid();
        imagePreviewer();
        gridWrapper.isotope('layout');

        // nudge if user doesn't scroll

    };

    // function scrollNudge() {
        // if (userscrolled past 5%) return;
    // }

    window.onresize = function() {
        $('#grid-wrapper').css('margin-top', $('#bigimage').outerHeight());
        $('#ib-img-preview').css({
            width : $(window).width(),
            height : $(window).height()
        });
    };

    function imagePreviewer() {
        var current = -1;
        var isAnimating = false;
        var $gridItems = gridWrapper.find('div.grid-item > a');
        var imgItemsCount = $gridItems.length;

        function init() {
            $gridItems.addClass('gridItem');
            $gridItems.bind('click.ibTemplate', function(ev) {
                openItem($(this));
                return false;
            });
        }

        function openItem($item) {
            if (isAnimating){
                return false;
            }

            current = $item.index('.gridItem');
            loadImgPreview($item, function() {
                isAnimating = false;
            });

        }

        function loadImgPreview($item, callback) {
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
                    $(Handlebars.templates.imageViewer(largeImageData)).insertAfter(gridWrapper);
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
        }

        function preloadImage(src, callback) {
            var img = new Image();
            img.src = src;

            img.onload = function() {
                callback(img);
            };
        }

        function initImgPreviewEvents() {
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
        }

        // navigate the image items in fullscreen mode
        function navigate(dir) {
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
        }

        function closeImgPreview() {
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
        }

        function getImageDim(img) {
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
                // TODO: check if we're above max and reduce accordingly
                new_h = Math.floor((i_h * w_w) / i_w);
                // TODO: same here and below
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
        }

        init();
    }

    function loadGrid() {
        // initialize isotope
        gridWrapper.isotope({
            itemSelector: '.grid-item',
            layoutMode: 'masonry',
            masonry: {
                columnWidth: '.width1'
            },
            // sort by number
            sortBy: 'sort-id',
            getSortData: {
              'sort-id': '.sort-id parseInt'
            }
        });

        var properties =
            [
                {description: "0", class: "width1", sortId: "0"},
                {description: "1", class: "width1", sortId: "1"},
                {description: "2", class: "width1", sortId: "2"},
                {description: "3", class: "width1", sortId: "3"},
                {description: "4", class: "width1", sortId: "4"},
                {description: "5", class: "width1", sortId: "5"},
                {description: "6", class: "width1", sortId: "6"},
                {description: "7", class: "width1", sortId: "7"},
                {description: "8", class: "width1", sortId: "8"},
                {description: "9", class: "width1", sortId: "9"},
                {description: "10", class: "width1", sortId: "10"},
                {description: "11", class: "width1", sortId: "11"},
                {description: "12", class: "width1", sortId: "12"},
                {description: "13", class: "width1", sortId: "13"},
                {description: "14", class: "width1", sortId: "14"},
                {description: "15", class: "width1", sortId: "15"},
                {description: "16", class: "width1", sortId: "16"},
                {description: "17", class: "width1", sortId: "17"},
                {description: "18", class: "width1", sortId: "18"},
                {description: "19", class: "width1", sortId: "19"},
                {description: "20", class: "width1", sortId: "20"},
                {description: "21", class: "width1", sortId: "21"},
                {description: "22", class: "width1", sortId: "22"},
                {description: "23", class: "width1", sortId: "23"},
                {description: "24", class: "width1", sortId: "24"},
                {description: "25", class: "width1", sortId: "25"},
                {description: "26", class: "width1", sortId: "26"},
                {description: "27", class: "width1", sortId: "27"}
            ];

        for(var i = 0; i <= 27; i++) {
            var context = {
                id: "gridItem" + i,
                sortId: properties[i].sortId,
                src: "images/large/" + i + ".jpg",
                thumbSrc: "images/thumbs/" + i + ".jpg",
                alt: "Image " + i,
                description: properties[i].description,
                classes: properties[i].class
            };
            var lastTemplateGenerated = Handlebars.templates.gridItem(context);
            gridWrapper.append(lastTemplateGenerated);
            // subscribe to thumbnail load events
            var imgLoad = imagesLoaded("#gridItem" + i);
            imgLoad.on('progress', function(instance, image) {
                // add the new item to isotope once the thumb is loaded
                var gridItem = image.img.parentNode.parentNode;
                gridWrapper.isotope('insert', gridItem);
            });
        }
    }
})(window);
