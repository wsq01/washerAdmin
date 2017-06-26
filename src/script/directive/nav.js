angular.module('app').directive('appNav',[function(){
  return {
    restrict:'A',
    replace:true,
    scope:{},
    templateUrl:'view/template/nav.html',
    controller:'navCtrl'
  }
}])
