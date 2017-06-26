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
  function check(){
    $('#defaultForm').bootstrapValidator({
        message: 'This value is not valid',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            username: {
                message: '用户名无效',
                validators: {
                    notEmpty: {
                        message: '用户名不能为空'
                    },
                    stringLength: {
                        min: 3,
                        max: 16,
                        message: '用户名长度应为3~16个字符'
                    },
                    regexp: {
                        regexp: /^[a-zA-Z0-9_\.]+$/,
                        message: '用户名只能由字母、数字、点和下划线组成'
                    }
                }
            },
            password: {
                validators: {
                    notEmpty: {
                        message: '密码不能为空'
                    },
                    stringLength:{
                      min:3,
                      max:16,
                      message:'密码长度应为3~16个字符'
                    }
                }
            }
        }
    });
  }

}]);
