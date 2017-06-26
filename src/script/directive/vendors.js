angular.module('app').directive('appVendors',[function(){
  return {
    restrict:'A',
    replace:true,
    templateUrl:'view/template/vendors.html'
  }
}])
