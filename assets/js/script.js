$(document).ready(function(){

  $('.carousel.carousel-slider').carousel(
  {
    dist: 0,
    padding: 0,
    fullWidth: true,
    indicators: true,
    duration: 100,
  }
  );
  $('.collapsible').collapsible();
});
// autoplay()
// function autoplay() {
//     $('.carousel.carousel-slider').carousel('next');
//     setTimeout(autoplay, 4500);
// }
