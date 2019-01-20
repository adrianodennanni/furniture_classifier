$(document).ready(function() {
  tf = window.tf;

  async function loadMobilenet() {
    const modelWeigths = await tf.loadModel('model/model.json');

    // Return a model that outputs an internal activation.
    const layer = modelWeigths.getLayer('dense');
    model = await tf.model({inputs: modelWeigths.inputs, outputs: layer.output});
  };

  loadMN = loadMobilenet();

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

  swiperSide.on('transitionEnd', function () {
    inferImage($('.swiper-slide-active img')[0]);
  });

  loadMN.then(function(){
    inferImage($('.swiper-slide-active img')[0])
  });
});

function startUserImage(imageFilePath) {
  $("#textInfoSendImage").remove();
  var imgDataURL = window.URL.createObjectURL(document.getElementById('userImageInput').files[0]);
  swiperProduct.slideTo(12);
  $("#imageFromUser").attr("src", imgDataURL);
};

async function inferImage(image){
  console.log($('.swiper-slide-active img')[0].src);
  // Set text as "Processing" and erase old results
  $("#results_title").text("Processing...");
  $("#first_place").text("");
  $("#second_place").text("");
  $("#third_place").text("");
  $("#fourth_place").text("");
  $("#fifth_place").text("");

  // Deep Learning Inference
  imagePixels = tf.fromPixels(image).expandDims(0).toFloat().div(tf.scalar(255));
  imagePixels = tf.image.resizeBilinear(imagePixels, [224, 224])
  predictedArray = await model.predict(imagePixels).as1D().data();

  response = []

  for (i = 1; i <= 128; i++) {
    response.push([i, predictedArray[i-1]])
  }

  response.sort(function(a, b) {
      return a[1] < b[1] ? 1 : -1;
  });

  // Print top 5 on html elements
  $("#results_title").text("Results");
  $("#first_place").text(buldLabel(response,  0));
  $("#second_place").text(buldLabel(response, 1));
  $("#third_place").text(buldLabel(response,  2));
  $("#fourth_place").text(buldLabel(response, 3));
  $("#fifth_place").text(buldLabel(response,  4));

}

function buldLabel(response, index){
  return labels[response[index][0]-1][1]+": "+response[index][1].toFixed(4)
}
