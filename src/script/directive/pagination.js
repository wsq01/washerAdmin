angular.module('app').directive('appPage',[function(){
  return {
    restrict:'A',
    replace:true,
    templateUrl:'view/template/pagination.html',
    link:function($scope){
      
    }
  }
}])
