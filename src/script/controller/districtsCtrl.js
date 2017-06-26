angular.module('app').controller('districtsCtrl', ['$http', '$scope','locals', function($http, $scope,locals){
  var userInfo=locals.getObject('userInfo'),
      sid=userInfo.sid,
      uid=window.localStorage.getItem('uid');
  var agination_index = 0;  //分页的核心变量
    //调用获取地区信息接口
    $http({
        method: "post",
        url: "../../db/district.php",
        data: {
            sid: sid,
            cmd: 'get'
        },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        transformRequest: function(data) {return $.param(data);}
    }).success(function(data) {
        console.log(data);
        $scope.district = data.districts;
        $scope.districts = [];
        // 页数
        $scope.paginationsnum = [];
        var num = Math.ceil($scope.district.length / 18);
        for (var j = 0; j < num; j++) {
            var dom = {
                name: j + 1
            };
            $scope.paginationsnum.push(dom);
        }
        // 默认显示第一页的内容
        for (var i = 0; i < $scope.district.length; i++) {
            if (i < 18) {
                $scope.districts.push($scope.district[i])
            }
        }
    });
    // 添加地区**********
    $scope.add = function() {
        $scope.add_sure = function() {
            // 调用添加地区信息接口
            $http({
                method: "post",
                url: "../../db/district.php",
                data: {
                    sid: sid,
                    cmd: "add",
                    name:$scope.addItem.name
                },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function(data) {return $.param(data);}
            }).success(function(data) {
                console.log(data);
                // 页数
                $scope.paginationsnum = [];
                var num = Math.ceil(($scope.district.length + 1) / 18);
                for (var j = 0; j < num; j++) {
                    var dom = {
                        name: j + 1
                    };
                    $scope.paginationsnum.push(dom);
                }
                getPagination(agination_index);
            });
            $('#add').modal('hide');
        };
        //点击取消
        $scope.add_cancel=function () {
            $('#add').modal('hide')
        }
    };
    // 查看详细**********
    $scope.check = function(index) {
        $scope.districtItem = $scope.districts[index];
        // 保存初始的信息值
        var s_name = $scope.districtItem.name;
        // 查看详细的删除
        $scope.check_del= function() {
            $scope.del_sure = function() {
                // 调用删除地区信息接口
                $http({
                    method: "post",
                    url: "../../db/district.php",
                    data: {
                        sid: sid,
                        cmd: "del",
                        id:$scope.districtItem.id
                    },
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    transformRequest: function(data) {return $.param(data);}
                }).success(function(data) {
                    console.log(data);
                    //分页   判断删除时，地区条数是否正好是18的倍数，如果是则agination_index要减一
                    var big = Math.floor(($scope.district.length - 1) / 18);
                    var flag = ($scope.district.length - 1) - big * 18;
                    if (flag == 0) {
                        if(agination_index == ($scope.paginationsnum.length-1)){
                            agination_index--;
                        }
                        $scope.paginationsnum.length--;
                    }
                    getPagination(agination_index);
                });
                $('#del').modal('hide');
                $('#checkModel').modal('hide');
            };
            // 点击取消
            $scope.del_cancel=function () {
                $('#del').modal('hide')
            };
            // 点击叉号
            $('#close').click(function(){
                $('#del').modal('hide')
            })
        };
        //查看详细的确定
        $scope.check_sure= function() {
            // 调用修改地区信息接口
            $http({
                method: "post",
                url: "../../db/district.php",
                data: {
                    sid: sid,
                    cmd: "edit",
                    id: $scope.districtItem.id,
                    name: $scope.districtItem.name
                },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                transformRequest: function(data) {return $.param(data);}
            }).success(function (data) {
                console.log(data);
            });
            $('#checkModel').modal('hide')
        };
        //查看详情的取消
        $scope.check_cancel=function () {
            $scope.districtItem.name = s_name;
            $('#checkModel').modal('hide')
        };
    };
    // 分页
    $scope.pagination_page = function(index) {
        agination_index = index;
        getPagination(agination_index);
    };
    // 上一页
    $scope.toPreviouspage = function() {
        if (agination_index > 0) {
            agination_index--;
            getPagination(agination_index);
        }
    };
    // 下一页
    $scope.toNextpage = function() {
        if (agination_index < $scope.paginationsnum.length - 1) {
            agination_index++;
            getPagination(agination_index);
        }
    };
    //分页函数
    function getPagination(agination_index) {
        $http({
            method: "post",
            url: "../../db/district.php",
            data: {
                sid: sid,
                cmd: 'get'
            },
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            transformRequest: function(data) {return $.param(data);}
        }).success(function(data) {
            $scope.district = data.districts;
            $scope.districts = [];
            var min = agination_index,
                max = agination_index + 1,
                s_num = min * 18,
                e_num = max * 18;
            for (var i = 1; i <= $scope.district.length; i++) {
                if (i > s_num && i <= e_num) {
                    $scope.districts.push($scope.district[i - 1]);
                }
            }
            $($('.pagination li.Pagination')[agination_index]).addClass('active').siblings().removeClass('active');
        });
    }
}]);
