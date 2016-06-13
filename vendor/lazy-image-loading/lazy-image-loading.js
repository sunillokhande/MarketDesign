/**
 * Created by ravi on 12/12/15.
 */

angular.module('lazyImageLoading', []).service(
    'scrollAndResizeListener', function($window, $document, $timeout,CommonMethods) {
        var id = 0,
            listeners = {},
            scrollTimeoutId,
            resizeTimeoutId;

        function invokeListeners() {
            var clientHeight = $document[0].documentElement.clientHeight,
                clientWidth = $document[0].documentElement.clientWidth;

            for (var key in listeners) {
                if (listeners.hasOwnProperty(key)) {
                    listeners[key](clientHeight, clientWidth); // call listener with given arguments
                }
            }
        }

        //*****************************added by kiran(for custom scrollbar) **************************
         /*
            depending upon browser,which event to apply.
            For custom scrollbar,event is : wheel and mousewheel
            For default scrollbar,event is: scroll
         */

        var whichBrowser=CommonMethods.detectBrowser().browser;
        console.log(whichBrowser);

        if(whichBrowser.toLowerCase()=='firefox' || whichBrowser.toLowerCase()=='internet explorer' || whichBrowser.toLowerCase()=='safari') {
            var wheelEvent = ("onwheel" in document ? "wheel" : // Modern browsers support "wheel"
                document.onmousewheel !== undefined ? "mousewheel" : // Webkit and IE support at least "mousewheel"
                    "DOMMouseScroll");
        }
        else
            var wheelEvent='scroll';

        console.log(wheelEvent);
        //********************************************************************************************
        $window.addEventListener(wheelEvent, function() {
            // cancel previous timeout (simulates stop event)
            $timeout.cancel(scrollTimeoutId);

            // wait for 200ms and then invoke listeners (simulates stop event)
            scrollTimeoutId = $timeout(invokeListeners, 200);
        });

        $window.addEventListener('resize', function() {
            console.log('resize');
            $timeout.cancel(resizeTimeoutId);
            resizeTimeoutId = $timeout(invokeListeners, 200);
        });


        var findLast='';
        return {

            bindListener: function(listener) {
                var index = ++id;
                listeners[id] = listener;

                //sometimes all images within viewport are not loading,so when all necessary image loading completed,we are invoking listener
                $timeout.cancel(findLast);
                findLast=$timeout(function()
                {
                    $timeout.cancel(resizeTimeoutId);
                    resizeTimeoutId = $timeout(invokeListeners, 200);
                },1000);
                return function() {
                    delete listeners[index];
                }
            }
        };
    }
);

angular.module('lazyImageLoading').directive(
    'imageLazySrc', function ($document, scrollAndResizeListener) {
        return {
            restrict: 'A',
            link: function ($scope, $element, $attributes) {
                var listenerRemover;
                $element.ready(function(){                      //when element will be ready

                    //customization
                    $element.bind("error", function(){
                        if($attributes.cuBadImage=='group')
                            $element.attr('src','images/group1.png');
                        else if($attributes.cuBadImage=='attachment')
                            $element.attr('src','');
                        else
                            $element.attr('src','images/missing.png');

                    });

                    function isInView(clientHeight, clientWidth) {
                    //console.log(clientHeight+"  "+clientWidth);
                    // get element position

                        //console.log('element is ready');
                        var imageRect = $element[0].getBoundingClientRect();

                        //console.log(imageRect.top+"  "+imageRect.bottom);
                        if (
                            (imageRect.top >= 0 && imageRect.bottom <= clientHeight)
                            &&
                            (imageRect.left >= 0 && imageRect.right <= clientWidth)
                        )
                        {
                            $element[0].src = $attributes.imageLazySrc; // set src attribute on element (it will load image)
                            // unbind event listeners when image src has been set
                            listenerRemover();
                        }
                    }

                    // bind listener
                    listenerRemover = scrollAndResizeListener.bindListener(isInView);

                    // unbind event listeners if element was destroyed
                    // it happens when you change view, etc
                    $element.on('$destroy', function () {
                        listenerRemover();
                    });


                    // explicitly call scroll listener (because, some images are in viewport already and we haven't scrolled yet)
                    isInView(
                        $document[0].documentElement.clientHeight,
                        $document[0].documentElement.clientWidth
                    );
                });
            }
        };
    }
);

angular.module('lazyImageLoading').directive(
    'cuCanvas', function ($document, scrollAndResizeListener) {
        return {
            restrict: 'A',
            link: function ($scope, $element, $attributes) {

                $element.bind('load',function(){

                    var bounds=$element[0].getBoundingClientRect(),
                        maxWidth=bounds.width,
                        maxHeight=450,
                        canvas =document.createElement("canvas"),
                        ctx=canvas.getContext('2d'),
                        image=new Image();

                    console.log(bounds.width);
                    image.src=$attributes.imageLazySrc;
                    var imgHeight=image.height;
                    var imgWidth=image.width;

                    image.onload = function(){
                        canvas.height = imgHeight;
                        canvas.width =imgWidth;

                        console.log(canvas.width+"  "+canvas.height+"  "+maxWidth+"  "+maxHeight);
                        if(canvas.width>=maxWidth){
                            console.log('canvas width is greater than max width');
                            canvas.height=(canvas.height*maxWidth)/canvas.width;
                            canvas.width=maxWidth;
                            if(canvas.height<maxHeight){
                                console.log('canvas height is less than max height');

                                canvas.height=Math.min(canvas.height,maxHeight);
                                //var top=maxHeight-canvas.height;
                                //$element[0].parentNode.style.marginTop=top/2+"px";
                                //$element[0].parentNode.style.marginBottom=top/2+"px";
                            }
                            else
                            {
                                console.log('canvas height is greater than max height');
                                canvas.width=(canvas.width*maxHeight)/canvas.height;
                                canvas.height=maxHeight;

                            }
                        }
                        else if(canvas.height>=maxHeight)
                        {
                            console.log('canvas height is greater than max heiht');
                            canvas.width=(canvas.width*maxHeight)/canvas.height;
                            canvas.height=maxHeight;
                            if(canvas.width<maxWidth){
                                console.log('canvas width is less than max width');
                                canvas.width=Math.min(canvas.width,maxWidth);
                            }
                            else
                            {
                                console.log('canvas width is greater than max Width');
                                canvas.height=(canvas.height*maxWidth)/canvas.width;
                                canvas.width=maxWidth;

                            }
                        }

                        ctx.drawImage(image,0,0,canvas.width,canvas.height);
                        $element[0].parentNode.appendChild(canvas);
                        $element[0].remove();
                    };


                });
            }
        }

    }
);