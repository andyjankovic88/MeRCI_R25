effects_class = function () {
  // Cache any reusable jQuery selectors
  this.$viewport = $('html, body');
  this.$window = $(window);
  this.winWidth = this.$window.width();
  this.winHeight = this.$window.height();

  this.maxWidth = this.winWidth > this.winHeight ? this.winWidth : this.winHeight;
  this.dotScale = 50 / this.maxWidth * 1000;
};

effects_class.prototype.initPageEvents = function() {


};

// Create splash effect at desired location with options
effects_class.prototype.splash = function(x, y, scale, opacity, bRandomColor) {
  var self = this;

  var $dot = $("<div class='dot'/>");

  // Initial setup
  $dot.css({
    left: x,
    top: y
  });

  // throw down the dot
  $("body").append($dot);

  // Now explode it
  setTimeout(function() {
    $dot.addClass("down");
    $dot.css({
      transform : "scale(" + self.dotScale +")"
    });
  }, 50);

  if(bRandomColor) {
    $dot.css("background", getRandomColor());
  }
};

$(document).ready(function () {
    Effects = new effects_class();
    Effects.initPageEvents();
});
