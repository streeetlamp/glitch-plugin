// remap jQuery to $
(function($){

	"use strict";

	/* trigger when page is ready */
	$(document).ready(function (){

		// i think we need to wait for images to load? 
		// test this

		$('.glitch-btn').on("click", function(){
			$('.glitch').glitchr({
				intensity: 2
			});
		});

	});


	/* optional triggers
	
	$(window).load(function() {
		
	});
	
	$(window).resize(function() {
		
	});
	
	*/

})(window.jQuery);