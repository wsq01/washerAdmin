angular.module('app').controller('loginCtrl', ['$http', '$scope','$state','locals', function($http, $scope,$state,locals){
  $scope.submit=function(){
    var pwd=md5(md5($("#t_password").val())),
        mobile=$("#t_username").val();
      $http({
        method: "post",
        url: "http://washer.mychaochao.cn/db/user.php",
        data: {
          cmd:"login",
          mobile:mobile,
          pwd:pwd,
          manager:'1'
        },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        transformRequest: function(data) {return $.param(data);}
      }).success(function(data){
        // data = JSON.parse(data);
        console.log(data);
        if(data.errno=="1"){
            locals.setObject('userInfo',data);
            $state.go('users');
        }else{
            alert(data.errmsg)
        }
      })
  };
}]);
