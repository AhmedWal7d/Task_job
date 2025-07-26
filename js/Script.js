
  $(document).ready(function(){
    $(".owl-carousel").owlCarousel({
      rtl: true,
      loop: true,
      margin: 10,
      dots: true,
      autoplay: true,
      autoplayTimeout: 4000,
      responsive: {
        0: {
          items: 1 
        },
        576: {
          items: 1 
        },
        768: {
          items: 2 
        },
        992: {
          items: 3 
        },
        1200: {
          items: 3 
        }
      }
    });

    console.log("Owl Carousel Initialized");
  });
