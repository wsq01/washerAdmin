angular.module('app').directive('appDistricts',[function(){
  return {
    restrict:'A',
    replace:true,
    templateUrl:'view/template/districts.html'
  }
}])
