angular.module('app').directive('appFloors',[function(){
  return {
    restrict:'A',
    replace:true,
    templateUrl:'view/template/floors.html'
  }
}])
