angular.module('app').controller('floorsCtrl', ['$http', '$scope','locals', function($http, $scope,locals){
  var userInfo=locals.getObject('userInfo'),
      sid=userInfo.sid,
      uid=window.localStorage.getItem('uid');
  var agination_index = 0;  //分页的核心变量
    //调用获取地区信息接口
    $http({
        method: "post",
        url: "../../db/floor.php",
        data: {
            sid: sid,
            cmd: 'get'
        },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        transformRequest: function(data) {return $.param(data);}
    }).success(function(data) {
        console.log(data);
        $scope.floor = data.floors;
        $scope.floors = [];
        // 页数
        $scope.paginationsnum = [];
        var num = Math.ceil($scope.floor.length / 18);
        for (var j = 0; j < num; j++) {
            var dom = {
                name: j + 1
            };
            $scope.paginationsnum.push(dom);
        }
        // 默认显示第一页的内容
        for (var i = 0; i < $scope.floor.length; i++) {
            if (i < 18) {
                $scope.floors.push($scope.floor[i])
            }
        }
    });
    // 添加地区******
    $scope.add = function() {
        $scope.add_sure = function() {
            $http({
                method: "post",
                url: "../../db/floor.php",
                data: {
                    sid: sid,
                    cmd: "add",
                    name:$scope.addItem.name,
                    bid:$scope.addItem.bid
                },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function(data) {return $.param(data);}
            }).success(function(data) {
                console.log(data);
                $scope.paginationsnum = [];
                var num = Math.ceil(($scope.floor.length + 1) / 18);
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
        $scope.add_cancel=function () {
            $('#add').modal('hide');
        }
    };
    // 修改*****
    $scope.change = function(index) {
        $scope.floorItem = $scope.floors[index];
        var s_name = $scope.floorItem.name,
            s_bid=$scope.floorItem.building;
        $scope.change_sure= function() {
            $http({
                method: "post",
                url: "../../db/floor.php",
                data: {
                    sid: sid,
                    cmd: "edit",
                    id: $scope.floorItem.id,
                    name: $scope.floorItem.name,
                    bid:$scope.floorItem.building
                },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                transformRequest: function(data) {return $.param(data);}
            }).success(function (data) {
                console.log(data);
            });
            $('#changeModal').modal('hide');
        };
        $scope.change_cancel=function () {
            $scope.floorItem.name = s_name;
            $scope.floorItem.building=s_bid;
            $('#changeModal').modal('hide');
        };
    };
    // 删除
    $scope.delete= function(index) {
        $scope.floorItem = $scope.floors[index];
        $scope.delete_sure = function() {
            $http({
                method: "post",
                url: "../../db/floor.php",
                data: {
                    sid: sid,
                    cmd: "del",
                    id:$scope.floorItem.id
                },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                transformRequest: function(data) {return $.param(data);}
            }).success(function(data) {
                console.log(data);
                var big = Math.floor(($scope.floor.length - 1) / 18);
                var flag = ($scope.floor.length - 1) - big * 18;
                if (flag == 0) {
                    if(agination_index == ($scope.paginationsnum.length-1)){
                        agination_index--;
                    }
                    $scope.paginationsnum.length--;
                }
                getPagination(agination_index);
            });
            $('#deleteModal').modal('hide');
        };
        $scope.delete_cancel=function () {
            $('#deleteModal').modal('hide');
        };
        $('#close').click(function(){
            $('#deleteModal').modal('hide');
        })
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
            url: "../../db/floor.php",
            data: {
                sid: sid,
                cmd: 'get'
            },
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            transformRequest: function(data) {return $.param(data);}
        }).success(function(data) {
            $scope.floor = data.floors;
            $scope.floors = [];
            var min = agination_index,
                max = agination_index + 1,
                s_num = min * 18,
                e_num = max * 18;
            for (var i = 1; i <= $scope.floor.length; i++) {
                if (i > s_num && i <= e_num) {
                    $scope.floors.push($scope.floor[i - 1]);
                }
            }
            $($('.pagination li.Pagination')[agination_index]).addClass('active').siblings().removeClass('active');
        });
    }
}]);
