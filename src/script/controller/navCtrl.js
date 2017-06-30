angular.module('app').controller('navCtrl',['$scope','locals','$state','$http','$interval',function($scope,locals,$state,$http,$interval){
  var userInfo=locals.getObject('userInfo');
  $scope.userName=userInfo.name;
  $scope.userId=userInfo.uid;
  var sid=userInfo.sid,
      uid=userInfo.uid;
  $scope.exit=function(){
    locals.setObject('userInfo','');
    $state.go('login');
  };
  //修改密码********
  $scope.changePwd=function () {
      $scope.change_sure=function () {
          $http({
              method:'post',
              url:'../../db/user.php',
              data:{
                  sid:sid,
                  cmd:'edit_pass',
                  manager:'1',
                  oldPass:md5(md5($('#t_oldPass').val())),
                  newPass:md5(md5($('#t_newPass').val())),
                  rePass:md5(md5($('#t_rePass').val()))
              },
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              transformRequest: function (data) {return $.param(data);}
          }).success(function (data) {
              console.log(data);
              if(data.errno=="-6"){
                  alert(data.errmsg);
              }else if(data.errno=='-7'){
                alert(data.errmsg);
              }else if(data.errno=='1'){
                alert('修改密码成功');
              }
          });
          $('#changePwd').modal('hide')
      };
      $scope.change_cancel=function () {
          $('#changePwd').modal('hide');
          $('#t_newPwd').val('')
      }
  };
  // 修改个人信息 ******************
  $scope.changeInfo = function(){
    $scope.getCode=function(){
      var count=60;
      $http({
        method: "post",
        url: "../../db/sms.php",
        data: {
            cmd: 'send_captcha',
            mobile:$scope.myuser.mobile
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
    // 点击确认
    $scope.changeInfo_sure = function(){
        // 调用修改用户信息
        $http({
            method:"post",
            url:"../../db/user.php",
            data:{
                sid:sid,
                cmd:"edit_manager",
                manager:"1",
                mobile:$scope.myuser.mobile,
                captcha:$scope.myuser.captcha,
                id:uid
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            transformRequest: function (data) {return $.param(data);}
        }).success(function(data){
            console.log(data);
            if(data.errno=="1"){
              alert('修改成功！');
            }
        });
        $('#changeInfo').modal('hide')
    };
    $scope.changeInfo_cancel=function () {
        $('#changeInfo').modal('hide')
    }
  }
}])
