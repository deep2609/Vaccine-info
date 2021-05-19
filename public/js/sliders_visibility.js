// window.onload = (event) => {
//     console.log('The page has fully loaded');
// };
// $(document).addEventListener("load",(event)=>{
//   console.log('The page has fully loaded');
// });
if($(window).width()>1200){
  $('.ipad-size').hide();
  $('.mobile-size').hide();
  $('.tab-size').hide();
  $('.small-size').hide();
}
else if($(window).width()>1000){
  $('.mobile-size').hide();
  $('.tab-size').hide();
  $('.desktop-size').hide();
  $('.small-size').hide();
}
else if($(window).width()>800){
  $('.mobile-size').hide();
  $('.desktop-size').hide();
  $('.ipad-size').hide();
  $('.small-size').hide();
}
else if($(window).width()>600){
  $('.tab-size').hide();
  $('.desktop-size').hide();
  $('.ipad-size').hide();
  $('.small-size').hide();
}
else{
  $('.tab-size').hide();
  $('.desktop-size').hide();
  $('.ipad-size').hide();
  $('.mobile-size').hide();
  
}


var myFunc = function(arg){
  console.log(arg);
    if(arg===1){
      $('.desktop-size').show();
      $('.tab-size').hide();
      $('.mobile-size').hide();
      $('.ipad-size').hide();
      $('.small-size').hide();
    }else if(arg===2){
      $('.ipad-size').show();
      $('.mobile-size').hide();
      $('.tab-size').hide();
      $('.desktop-size').hide();
      $('.small-size').hide();
    }else if(arg===3){
      $('.tab-size').show();
      $('.mobile-size').hide();
      $('.desktop-size').hide();
      $('.ipad-size').hide();
      $('.small-size').hide();
    }else if(arg===4){
      $('.mobile-size').show();
      $('.ipad-size').hide();
      $('.desktop-size').hide();
      $('.tab-size').hide();
      $('.small-size').hide();
    }else if(arg===5){
      $('.small-size').show();
      $('.mobile-size').hide();
      $('.ipad-size').hide();
      $('.desktop-size').hide();
      $('.tab-size').hide();
    }

};

$(window).resize(function(){
    var w = $(window).width();

    if (w > 1200) myFunc(1);
    else if(w>1000 && w<1200)myFunc(2);
    else if(w>800 && w<1000)myFunc(3);
    else if(w>600 && w < 800) myFunc(4);
    else if(w<600)myFunc(5);


});
