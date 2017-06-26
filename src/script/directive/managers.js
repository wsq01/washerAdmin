angular.module('app').directive('appManagers',[function(){
  return {
    restrict:'A',
    replace:true,
    templateUrl:'view/template/managers.html'
  }
}])
