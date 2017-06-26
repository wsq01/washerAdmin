angular.module('app').controller('vendorsCtrl', ['$http', '$scope','locals', function($http, $scope,locals){
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
            cmd:"vendor_list"
        },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        transformRequest: function (data) {return $.param(data);}
    }).success(function(data){
        console.log(data);
        $scope.user = data.vendors;
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
                cmd:"vendor_list"
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            transformRequest: function (data) {return $.param(data);}
        }).success(function(data){
            $scope.user = data.vendors;
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
    //查看详细**********
    $scope.checkUser = function(index){
        $scope.userItem = $scope.users[index];
        //点击确定
        $scope.sure_user=function () {
            // 调用获取用户信息接口
            $http({
                method:"post",
                url:"../../db/user.php",
                data:{
                    sid:sid,
                    cmd:"edit_vendor",
                    id:$scope.userItem.id,
                    company:$scope.userItem.company,
                    level:$scope.userItem.level,
                    status:$scope.userItem.status
                },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                transformRequest: function (data) {return $.param(data);}
            }).success(function(data){
                console.log(data);
                //分页   判断删除时，地区条数是否正好是18的倍数，如果是则agination_index要减一
                var big = Math.floor(($scope.user.length - 1) / 18);
                var flag = ($scope.user.length - 1) - big * 18;
                if (flag == 0) {
                    if(agination_index == ($scope.paginationsnum.length-1)){
                        agination_index--;
                    }
                    $scope.paginationsnum.length--;
                }
                getPagination(agination_index);
            });
            $('#checkUser').modal('hide')
        };
        //点击取消
        $scope.cancel_check=function () {
            $('#checkUser').modal('hide')
        };
    };
    //添加代理商**********
    $scope.addVendor = function() {
        $scope.add_sure = function () {
            // 调用新增管理员用户
            $http({
                method: "post",
                url: "../../db/user.php",
                data: {
                    sid: sid,
                    cmd: "add_vendor",
                    company: $scope.addItem.company
                },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function (data) {return $.param(data);}
            }).success(function (data) {
                console.log(data);
                // 页数
                $scope.paginationsnum = [];
                var num = Math.ceil(($scope.user.length + 1) / 18);
                for (var j = 0; j < num; j++) {
                    var dom = {
                        name: j + 1
                    };
                    $scope.paginationsnum.push(dom);
                }
                getPagination(agination_index);
                $('#addVendor').modal('hide').find('input').val('');
            });
        };
        //点击取消
        $scope.add_cancel = function () {
            $('#addVendor').modal('hide');
        }
    };
}]);
