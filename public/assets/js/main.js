!function(a){skel.breakpoints({xlarge:"(max-width: 1680px)",large:"(max-width: 1280px)",medium:"(max-width: 980px)",small:"(max-width: 736px)",xsmall:"(max-width: 480px)"}),a(function(){var b=a(window),c=a("body");c.addClass("is-loading"),b.on("load",function(){window.setTimeout(function(){c.removeClass("is-loading")},100)}),a("form").placeholder(),skel.on("+medium -medium",function(){a.prioritize(".important\\28 medium\\29",skel.breakpoint("medium").active)})})}(jQuery);