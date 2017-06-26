angular.module('app').directive('appSockets',[function(){
  return {
    restrict:'A',
    replace:true,
    templateUrl:'view/template/sockets.html'
  }
}])
