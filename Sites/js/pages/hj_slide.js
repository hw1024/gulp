define(function(require,exports,module){function hjSlide(){this.init()}require("animateNumber.min");var utility=new(utility=require("util"));hjSlide.prototype.init=function(){},hjSlide.prototype.bdSlide=function(obj,eff){for(var liIndex=$(".bd-slide ul li").size(),dot=$(".hd ul"),i=0;i<liIndex;i++)dot.append("<li></li>");$(".hd ul li").eq(0).addClass("on"),1==liIndex&&dot.html("");var hdWidth=$(".hd").width();$(".hd").css({"margin-left":-hdWidth/2+"px"}),$(obj).slide({mainCell:".bd-slide ul",trigger:"click",effect:eff,autoPlay:!0})},hjSlide.prototype.animateNumber=function(obj,num){$(obj).each(function(){var numList=parseInt($(this).text());$(this).animateNumber({number:numList},num)})},hjSlide.prototype.txtScroll=function(obj,num){$(obj).slide({mainCell:".bd2 ul",effect:"topLoop",autoPlay:!0,vis:num})},hjSlide.prototype.textSlideFn=function(list,time){utility.textSlide(list,time)},hjSlide.prototype.picScroll=function(obj,num){$(obj).slide({titCell:".hd ul",mainCell:".bd ul",autoPage:!0,effect:"leftLoop",autoPlay:!0,vis:num,trigger:"click"})},hjSlide.prototype.tapCell=function(obj1,obj2,eff){$(obj1).slide({titCell:"h3",targetCell:"ul",defaultIndex:0,trigger:"click",effect:"slideDown",delayTime:300,defaultPlay:!1}),$(obj2).slide({effect:eff,trigger:"click"})},module.exports=new hjSlide});