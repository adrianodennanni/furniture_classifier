$(document).ready(function() {
  tf = window.tf;

  async function loadMobilenet() {
    const modelWeigths = await tf.loadModel('model/model.json');

    // Return a model that outputs an internal activation.
    const layer = modelWeigths.getLayer('dense');
    model = await tf.model({inputs: modelWeigths.inputs, outputs: layer.output});
  };

  canvas = document.createElement('canvas');
  canvas.width  = 224;
  canvas.height = 224;
  ctx = canvas.getContext("2d");
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
    if (swiperSide.activeIndex == 12){
      if($("#imageFromUser")[0].src != ""){
        inferImage($("#imageFromUser")[0]);
      }
      else {
        $("#results_title").text("");
        $("#first_place").text("");
        $("#second_place").text("");
        $("#third_place").text("");
        $("#fourth_place").text("");
        $("#fifth_place").text("");
      }
    } else {
      inferImage($('.swiper-slide-active img')[0]);
    }
  });

  loadMN.then(function(){
    inferImage($('.swiper-slide-active img')[0]);
  });
});

async function startUserImage(imageFilePath) {
  $("#textInfoSendImage").remove();
  var imgDataURL = window.URL.createObjectURL(document.getElementById('userImageInput').files[0]);
  $("#imageFromUser")[0].src = imgDataURL;
  if(swiperProduct.activeIndex == 12){
    await new Promise(resolve => setTimeout(resolve, 10));
    inferImage($("#imageFromUser")[0]);
  } else{
    swiperProduct.slideTo(12);
  };
};

async function inferImage(image){
  // Set text as "Processing" and erase old results
  $("#results_title").text("Processing...");
  $("#first_place").text("");
  $("#second_place").text("");
  $("#third_place").text("");
  $("#fourth_place").text("");
  $("#fifth_place").text("");

  // Deep Learning Inference
  ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight, 0, 0, 224, 224);
  imageData = ctx.getImageData(0, 0, 224, 224);
  imagePixels = tf.fromPixels(imageData).expandDims(0).toFloat().div(tf.scalar(255));
  predictedArray = await model.predict(imagePixels).as1D().data();

  response = {}

  for (i = 0; i <= 127; i++) {
    if(Number.isFinite(response[labels[i][1]])){
      response[labels[i][1]] += predictedArray[i];
    }
    else {
      response[labels[i][1]] = predictedArray[i];
    }
  };

  response = Object.keys(response).map(item => [item, response[item]]);

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
  return response[index][0]+": "+response[index][1].toFixed(4);
}
