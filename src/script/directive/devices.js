angular.module('app').directive('appDevices',[function(){
  return {
    restrict:'A',
    replace:true,
    templateUrl:'view/template/devices.html'
  }
}])
