angular.module('app').directive('appSchools',[function(){
  return {
    restrict:'A',
    replace:true,
    templateUrl:'view/template/schools.html'
  }
}])
