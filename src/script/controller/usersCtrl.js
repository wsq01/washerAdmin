angular.module('app').controller('usersCtrl', ['$http', '$scope','locals', function($http, $scope,locals){
  var userInfo=locals.getObject('userInfo');
  var sid=userInfo.sid,
      uid=window.localStorage.getItem('uid');
  var agination_index = 0;
    // 调用获取用户列表接口 **********
    $http({
        method:"post",
        url:"../../db/user.php",
        data:{
            sid:sid,
            cmd:"get_list"
        },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        transformRequest: function (data) {return $.param(data);}
    }).success(function(data){
        console.log(data);
        $scope.user = data.users;
        $scope.users = [];
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
        $scope.fadeInto=false;
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
                cmd:"get_list"
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            transformRequest: function (data) {return $.param(data);}
        }).success(function(data){
            $scope.user = data.users;
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
        var s_mobile=$scope.userItem.mobile,
            s_name=$scope.userItem.username;
        $scope.change_sure=function () {
            $http({
                method:"post",
                url:"http://washer.mychaochao.cn/db/user.php",
                data:{
                    sid:sid,
                    cmd:"edit",
                    id:$scope.users[index].id,
                    mobile:$scope.userItem.mobile,
                    name:$scope.userItem.username
                },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                transformRequest: function (data) {return $.param(data);}
            }).success(function(data){
                console.log(data);
                $('#changeModal').modal('hide');
            });
        };
        $scope.change_cancel=function () {
            $scope.userItem.mobile=s_mobile;
            $scope.userItem.name=s_name;
            $('#changeModal').modal('hide')
        };
    };
    //删除
    // $scope.delete = function(index){
    //     $scope.userItem = $scope.users[index];
    //     $scope.delete_sure = function(){
    //         $http({
    //             method:'post',
    //             url:'http://washer.mychaochao.cn/db/user.php',
    //             data:{
    //                 sid:sid,
    //                 cmd:'del',
    //                 id:$scope.users[index].id
    //             },
    //             headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    //             transformRequest: function (data) {return $.param(data);}
    //         }).success(function(data){
    //           console.log(data);
    //             var big= Math.floor(($scope.user.length-1)/18);
    //             var flag = ($scope.user.length-1) - big*18;
    //             if(flag==0){
    //                 if(agination_index == ($scope.paginationsnum.length-1)){
    //                     agination_index--;
    //                 }
    //                 $scope.paginationsnum.length--;
    //             }
    //             getPagination(agination_index);
    //             $('#deleteModal').modal('hide');
    //         })
    //     };
    //     $scope.delete_cancel=function () {
    //         $('#deleteModal').modal('hide');
    //     };
    //     $('#close').click(function(){
    //         $('#deleteModal').modal('hide');
    //     })
    // };
}]);
