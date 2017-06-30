angular.module('app').controller('buildingsCtrl', ['$http', '$scope','locals', function($http, $scope,locals){
  var userInfo=locals.getObject('userInfo');
  var sid=userInfo.sid,
      uid=window.localStorage.getItem('uid');
  var agination_index = 0;  //分页的核心变量
    //调用获取地区信息接口
    $http({
        method: "post",
        url: "../../db/building.php",
        data: {
            sid: sid,
            cmd: 'get'
        },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        transformRequest: function(data) {return $.param(data);}
    }).success(function(data) {
        $scope.building = data.buildings;
        $scope.buildings = [];
        // 页数
        $scope.paginationsnum = [];
        var num = Math.ceil($scope.building.length / 18);
        for (var j = 0; j < num; j++) {
            var dom = {
                name: j + 1
            };
            $scope.paginationsnum.push(dom);
        }
        // 默认显示第一页的内容
        for (var i = 0; i < $scope.building.length; i++) {
            if (i < 18) {
                $scope.buildings.push($scope.building[i])
            }
        }
    });
    // 添加****
    $scope.add = function() {
        $scope.add_sure = function() {
            $http({
                method: "post",
                url: "../../db/building.php",
                data: {
                    sid: sid,
                    cmd: "add",
                    name:$scope.addItem.name,
                    school:$scope.addItem.school
                },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function(data) {return $.param(data);}
            }).success(function(data) {
                $scope.paginationsnum = [];
                var num = Math.ceil(($scope.building.length + 1) / 18);
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
            $('#add').modal('hide')
        }
    };
    // 修改****
    $scope.change = function(index) {
        $scope.buildingItem = $scope.buildings[index];
        var s_name = $scope.buildingItem.name,
            s_school=$scope.buildingItem.school;
        $scope.change_sure= function() {
            $http({
                method: "post",
                url: "../../db/building.php",
                data: {
                    sid: sid,
                    cmd: "edit",
                    id: $scope.buildingItem.id,
                    name: $scope.buildingItem.name,
                    school:$scope.buildingItem.school
                },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                transformRequest: function(data) {return $.param(data);}
            }).success(function (data) {
            });
            $('#changeModal').modal('hide')
        };
        $scope.change_cancel=function () {
            $scope.buildingItem.name = s_name;
            $scope.buildingItem.school=s_school;
            $('#changeModal').modal('hide');
        };
    };
    // 删除****
    $scope.delete= function(index) {
        $scope.buildingItem = $scope.buildings[index];
        $scope.delete_sure = function() {
            $http({
                method: "post",
                url: "../../db/building.php",
                data: {
                    sid: sid,
                    cmd: "del",
                    id:$scope.buildings[index].id
                },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                transformRequest: function(data) {return $.param(data);}
            }).success(function(data) {
                var big = Math.floor(($scope.building.length - 1) / 18);
                var flag = ($scope.building.length - 1) - big * 18;
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
            url: "../../db/building.php",
            data: {
                sid: sid,
                cmd: 'get'
            },
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            transformRequest: function(data) {return $.param(data);}
        }).success(function(data) {
            $scope.building = data.buildings;
            $scope.buildings = [];
            var min = agination_index,
                max = agination_index + 1,
                s_num = min * 18,
                e_num = max * 18;
            for (var i = 1; i <= $scope.building.length; i++) {
                if (i > s_num && i <= e_num) {
                    $scope.buildings.push($scope.building[i - 1]);
                }
            }
            $($('.pagination li.Pagination')[agination_index]).addClass('active').siblings().removeClass('active');
        });
    }
}]);
