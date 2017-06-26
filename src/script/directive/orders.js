angular.module('app').directive('appOrders',[function(){
  return {
    restrict:'A',
    replace:true,
    templateUrl:'view/template/orders.html'
  }
}])
