/* 
Copyright 2013 Damien Barrère http://www.crac-design.com

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
(function( $ ) {
  
    var options =  {
        'indexStart'        : 100,
        'rotation'          : 80,
        'easing'            : function(x, t, b, c, d){return c*t/d + b;}, //See http://dzone.com/snippets/robert-penner-easing-equations
        'overflowparents'   : true,
        'autostart'         : true,
        'animationdelay'    : 1500
    };

    var _animate = false;
    var _interval;

    var $heapshot;

    var methods = {
        init : function( o ) { 
            $heapshot = $(this);
            
            $heapshot.imagesLoaded(function(){
                $.extend(options,o);

                if(options.overflowparents===true){
                    $heapshot.parents().css('overflow','visible');
                }

                var width=0, height=0;
                $heapshot.find('li').each(function(index,elem){
                    $(elem).css('z-index',options.indexStart+$heapshot.find('li').length-index);
                    t = Math.floor((Math.random()*10));
                    $(elem).css('top',t*10);
                    a = Math.floor((Math.random()*15)+3);
                    s=Math.floor((Math.random()*2));
                    if(s==0){
                        a=-a;
                    }
                    $(elem).data('rotation',a);
                    $(elem).rotate({
                        angle : a
                    });
                    if($(elem).width() > width){
                        width = $(elem).width();
                    }
                    if($(elem).height() > height){
                        height = $(elem).height();
                    }
                 });
                 $heapshot.css('width',width);
                 $heapshot.css('height',height);
                 bindFirst();
            });
        },
        next : function(){
            next();
        },
        previous : function(){
            previous();
        }
    };

    next = function(){
        $heapshot.find('li img').trigger('click');
    };

    previous = function(){
        
    };

    bindFirst = function(){
        if(_animate === true ){
            return;
        }
        bindto = null;
        nbli = $heapshot.find('li').length;
        $heapshot.find('li').each(function(index,elem){
            if(parseInt($(elem).css('z-index')) === options.indexStart+nbli){
                bindto = elem;
            }
        });
        $heapshot.find('li').removeClass('current');
        $(bindto).addClass('current');
        if(options.autostart===true){
            clearInterval(_interval);
            _interval = setInterval(next, options.animationdelay);
            $heapshot.hover(function(){
               clearInterval(_interval);
            });
            $heapshot.on('mouseleave',function(){
                _interval = setInterval(next, options.animationdelay);
            });
        }
        $(bindto).find('img').click(function(event){            
            if(_animate === true ){
                event.stopPropagation();
                return;
            }
            _animate = true;
            $e = $(this).parent();
            from = $e.data('rotation');
            to = parseInt(from + options.rotation);
            $e.animate({
                left : $(this).position().left+$(this).width()+20
            }, 1500, function() {
                //animation finished
                $e.css('z-index',options.indexStart);
                $heapshot.find('li').each(function(index,elem){
                    $(elem).css('z-index',parseInt($(elem).css('z-index'))+1);
                });
                rfrom = parseInt($(this).getRotateAngle());
                rto = parseInt(rfrom - options.rotation);
                $e.animate({
                    left : 0,
                }, 1500, function(){
                    $heapshot.find('li img').unbind();
                    _animate = false;
                    bindFirst();
                });
                $e.rotate({
                    angle: rfrom, 
                    animateTo : rto,
                    easing: options.easing,
                    duration:1500
                });
            });
            $e.rotate({
                angle: from, 
                animateTo : to,
                easing: options.easing,
                duration:1500
            });

        });  
    };

    $.fn.heapshot = function( method ) {
        // Method calling logic
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            //error
        }    
  };
})( jQuery );