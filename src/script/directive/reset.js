angular.module('app').directive('appReset',[function(){
  return {
    restrict:'A',
    replace:true,
    templateUrl:'view/template/reset.html'
  }
}])
