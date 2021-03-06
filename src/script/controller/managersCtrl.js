angular.module('app').controller('managersCtrl', ['$http', '$scope','locals', function($http, $scope,locals){
  var userInfo=locals.getObject('userInfo'),
      sid=userInfo.sid,
      uid=window.localStorage.getItem('uid');
      var agination_index = 0;
        // 调用获取用户列表接口 **********
        $http({
            method:"post",
            url:"../../db/user.php",
            data:{
                sid:sid,
                cmd:"get_list",
                manager:'1'
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            transformRequest: function (data) {return $.param(data);}
        }).success(function(data){
            console.log(data);
            $scope.user = data.managers;
            turnVendor();
            $scope.users = [];
            // 页数
            $scope.paginationsnum = [];
            var num =  Math.ceil($scope.user.length/18);
            for(var j=0;j<num;j++){
                var dom = {
                    name:j+1
                };
                $scope.paginationsnum.push(dom);
            }
            // 默认显示第一页的内容
            for(var i=0;i<$scope.user.length;i++){
                if(i<18){
                    $scope.users.push($scope.user[i]);
                }
            }
        });
        //分页
        $scope.pagination_page = function(index){
            agination_index = index;
            getPagination(agination_index);
        };
        //上一页
        $scope.toPreviouspage = function(){
            if(agination_index>0){
                agination_index--;
                getPagination(agination_index);
            }
        };
        //下一页
        $scope.toNextpage_user = function(){
            if(agination_index<$scope.paginationsnum.length-1){
                agination_index++;
                getPagination(agination_index);
            }
        };
        //分页函数
        function getPagination(agination_index){
            $http({
                method:"POST",
                url:"../../db/user.php",
                data:{
                    sid:sid,
                    cmd:"get_list",
                    manager:'1'
                },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                transformRequest: function (data) {return $.param(data);}
            }).success(function(data){
                $scope.user = data.managers;
                turnVendor();
                $scope.users = [];
                var	min = agination_index,
                    max = agination_index+1,
                    s_num = min*18,
                    e_num = max*18;
                for(var i=1;i<=$scope.user.length;i++){
                    if(i>s_num && i<=e_num){
                        $scope.users.push($scope.user[i-1]);
                    }
                }
                $($('.pagination li.Pagination')[agination_index]).addClass('active').siblings().removeClass('active');
            });
        }
        //修改****
        $scope.change = function(index){
            $scope.userItem = $scope.users[index];
            var s_pwd=$scope.userItem.password,
                s_status=$scope.userItem.status,
                s_type=$scope.userItem.type;
            $scope.change_sure=function () {
                if(s_pwd==$scope.userItem.password){
                  $http({
                      method:"post",
                      url:"../../db/user.php",
                      data:{
                          sid:sid,
                          cmd:"edit_manager",
                          id:$scope.users[index].id,
                          pwd:$scope.userItem.password,
                          status:$scope.userItem.status,
                          type:$scope.userItem.type
                      },
                      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                      transformRequest: function (data) {return $.param(data);}
                  }).success(function(data){
                      //分页
                      var big = Math.floor(($scope.user.length - 1) / 18);
                      var flag = ($scope.user.length - 1) - big * 18;
                      if (flag == 0) {
                          if(agination_index == ($scope.paginationsnum.length-1)){
                              agination_index--;
                          }
                          $scope.paginationsnum.length--;
                      }
                      getPagination(agination_index);
                      $('#changeModal').modal('hide');
                  });
                }else {
                  $http({
                      method:"post",
                      url:"../../db/user.php",
                      data:{
                          sid:sid,
                          cmd:"edit_manager",
                          id:$scope.users[index].id,
                          pwd:md5(md5($scope.userItem.password)),
                          status:$scope.userItem.status,
                          type:$scope.userItem.type
                      },
                      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                      transformRequest: function (data) {return $.param(data);}
                  }).success(function(data){
                      var big = Math.floor(($scope.user.length - 1) / 18);
                      var flag = ($scope.user.length - 1) - big * 18;
                      if (flag == 0) {
                          if(agination_index == ($scope.paginationsnum.length-1)){
                              agination_index--;
                          }
                          $scope.paginationsnum.length--;
                      }
                      getPagination(agination_index);
                      $('#changeModal').modal('hide');
                  });
                }

            };
            $scope.change_cancel=function () {
                $('#changeModal').modal('hide');
            };
        };
        //删除
        $scope.delete = function(index){
          $scope.userItem = $scope.users[index];
            $scope.delete_sure = function(){
                $http({
                    method:'post',
                    url:'../../db/user.php',
                    data:{
                        sid:sid,
                        cmd:'del',
                        id:$scope.users[index].id
                    },
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    transformRequest: function (data) {return $.param(data);}
                }).success(function(){
                    var big= Math.floor(($scope.user.length-1)/18);
                    var flag = ($scope.user.length-1) - big*18;
                    if(flag==0){
                        if(agination_index == ($scope.paginationsnum.length-1)){
                            agination_index--;
                        }
                        $scope.paginationsnum.length--;
                    }
                    getPagination(agination_index);
                    $('#deleteModal').modal('hide');
                })
            };
            $scope.delete_cancel=function () {
                $('#deleteModal').modal('hide');
            };
            $('#close').click(function(){
                $('#deleteModal').modal('hide');
            })
        };
        //修改密码*****
        $scope.changePwd=function (index) {
            var pwd=md5(md5($('#t_newPwd').val()));
            $scope.changePwd_sure=function () {
                $http({
                    method:'post',
                    url:'../../db/user.php',
                    data:{
                        sid:sid,
                        cmd:'edit',
                        manager:'1',
                        id:$scope.users[index].id,
                        pwd:pwd
                    },
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    transformRequest: function (data) {return $.param(data);}
                }).success(function (data) {
                    console.log(data)
                });
                $('#changePwd').modal('hide')
            };
            $scope.changePwd_cancel=function () {
                $('#changePwd').modal('hide');
                $('#t_newPwd').val('')
            }
        };
        //添加管理员**********
        $scope.addAdmin = function() {
            $scope.add_sure = function () {
                var pwd = md5(md5($scope.addItem.pwd)),
                    t_status=$("#t_status input[type='radio']:checked").val();
                $http({
                    method: "post",
                    url: "../../db/user.php",
                    data: {
                        sid: sid,
                        cmd: "add_manager",
                        mobile: $scope.addItem.mobile,
                        name: $scope.addItem.name,
                        pwd: pwd,
                        status:t_status,
                        gizwits_pwd:'',
                        type:"1",
                        vendor: $scope.addItem.vendor
                    },
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    transformRequest: function (data) {return $.param(data);}
                }).success(function (data) {
                    console.log(data);
                    $('#addAdmin').modal('hide').find('input').val('');
                    if(data.errno=="1"){
                      $scope.paginationsnum = [];
                      var num = Math.ceil(($scope.user.length + 1) / 18);
                      for (var j = 0; j < num; j++) {
                          var dom = {
                              name: j + 1
                          };
                          $scope.paginationsnum.push(dom);
                      }
                      getPagination(agination_index);
                    }else{
                        alert(data.errmsg);
                    }
                });
            };
            $scope.add_cancel = function () {
                $('#addAdmin').modal('hide').find('input').val('');
            }
        };
        function turnVendor(){
          for(var i=0;i<$scope.user.length;i++){
            var vendorid=$scope.user[i].vendorid;
            http(i,vendorid);
          }
        };
        function http(i,vendorid){
          $http({
              method:"post",
              url:"../../db/user.php",
              data:{
                  sid:sid,
                  cmd:"vendor_list",
                  id:vendorid
              },
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              transformRequest: function (data) {return $.param(data);}
          }).success(function(data){
            $scope.user[i].turnVendor=data.vendors[0].company;
          })
        }
}]);
