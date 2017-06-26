angular.module('app').directive('appTypes',[function(){
  return {
    restrict:'A',
    replace:true,
    templateUrl:'view/template/types.html'
  }
}])
