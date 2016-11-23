//->REM
~function(){
	var desW=640,winW=document.documentElement.clientWidth||document.body.clientWidth;
	if(winW>desW){
		document.getElementById('main').style.width=desW+'px';
		document.getElementById('main').style.margin='0 auto';
		return;
	}
	document.documentElement.style.fontSize=winW/desW*100+"px";	
}();

//获取报名页，除了头部的页面高度
//var winH=$(window).height();
//var headerH=$('.header').height();
//
//
//var mq=window.matchMedia('(min-width: 639px)');
//if(mq.matches){
//	$('.form-menu').css('height','100%');
//}else{
//	$('.form-menu').css('height',parseFloat(winH-headerH));
//}
