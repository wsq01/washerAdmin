angular.module('app').directive('validator',[function(){
  return {
    restrict:'A',
    link:function(scope, element, attrs){
      $(function(){
        element.bootstrapValidator({
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
                },
                reOption: {
                    validators: {
                        notEmpty: {
                            message: '必填选项'
                        }
                    }
                }
            }
        });
      })
    }
  }
}])
