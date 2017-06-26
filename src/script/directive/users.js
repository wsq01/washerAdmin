angular.module('app').directive('appUsers',[function(){
  return {
    restrict:'A',
    replace:true,
    templateUrl:'view/template/users.html'
  }
}])
