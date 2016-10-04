"use strict";
/*global ajaxify*/

$(document).ready(function(){
	$(window).on('action:ajaxify.end', function(ev, data) {
		if (data.tpl_url === 'categories') {
			if (ajaxify.data.splashRecentPosts.enableCarousel) {
				$('.recent-cards').bxSlider({
					slideWidth: 292,
					minSlides: 1,
					maxSlides: 4,
					pager: ajaxify.data.splashRecentPosts.enableCarouselPagination ? true: false
				});
			} else {
				$('.recent-cards').removeClass('carousel-mode');
			}
		}
	});
});