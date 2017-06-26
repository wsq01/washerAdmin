angular.module('app').filter('orderStatus',function(){
  return function(input){
    var orderStatus='';
    if(input=="0"){
      orderStatus="未付款";
    }else if(input=="1"){
      orderStatus="已付款";
    }else if(input=="2"){
      orderStatus="已完成";
    }else {
      orderStatus="错误"
    }
    return orderStatus;
  }
})
