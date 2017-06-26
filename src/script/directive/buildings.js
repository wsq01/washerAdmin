angular.module('app').directive('appBuildings',[function(){
  return {
    restrict:'A',
    replace:true,
    templateUrl:'view/template/buildings.html'
  }
}])
