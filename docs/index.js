// Layout stuff
$(document).ready(function() {
  swiperSide = new Swiper('.product-photos-side .swiper-container', {
    direction: 'horizontal',
    centeredSlides: true,
    spaceBetween: 30,
    slidesPerView: 'auto',
    touchRatio: 0.2,
    slideToClickedSlide: true,
  })
  swiperProduct = new Swiper('.product-photo-main .swiper-container', {
    direction: 'horizontal',
    pagination: '.swiper-pagination',
    paginationClickable: true,
  })

  swiperSide.params.control = swiperProduct;
  swiperProduct.params.control = swiperSide;
});

function startUserImage(imageFilePath) {
  $("#textInfoSendImage").remove();
  var imgDataURL = window.URL.createObjectURL(document.getElementById('userImageInput').files[0]);
  swiperProduct.slideTo(13);
  console.log(imgDataURL);
  $("#imageFromUser").attr("src", imgDataURL);
};

// REAL stuff
tf = window.tf;
const model = tf.loadModel('model/model.json');
