angular.module('app').controller('resetCtrl', ['$http', '$scope','$interval','$state', function($http, $scope,$interval,$state){
  $scope.submit=function(){
    $http({
      method: "post",
      url: "../../db/user.php",
      data: {
          cmd: 'reset',
          mobile:$scope.user.mobile,
          pwd:md5(md5($scope.user.passward)),
          captcha:$scope.user.captcha,
          manager:"1"
      },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      transformRequest: function(data) {return $.param(data);}
    }).success(function(data){
      console.log(data);
      if(data.errno=="1"){
        alert('修改成功！');
        $state.go('login');
      }
    })
  }
  $scope.getCode=function(){
    console.log($scope.user);
    var count=60;
    $http({
      method: "post",
      url: "../../db/sms.php",
      data: {
          cmd: 'send_captcha',
          mobile:$scope.user.mobile
      },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      transformRequest: function(data) {return $.param(data);}
    }).success(function(data){
      console.log(data);
      count = 60;
      $scope.time = '60s';
      var interval = $interval(function() {
        if(count<=0) {
          $interval.cancel(interval);
          $scope.time = '';
        } else {
          count--;
          $scope.time = count + 's';
        }
      }, 1000);
    })
  }
}]);
