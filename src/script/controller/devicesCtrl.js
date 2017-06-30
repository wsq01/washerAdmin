angular.module('app').controller('devicesCtrl', ['$http', '$scope','locals', function($http, $scope,locals){
  var userInfo=locals.getObject('userInfo'),
      sid=userInfo.sid,
      uid=window.localStorage.getItem('uid');
  var agination_index = 0;  //分页的核心变量
    $http({
        method: "post",
        url: "../../db/socket.php",
        data: {
            sid: sid,
            cmd: 'get_device'
        },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        transformRequest: function(data) {return $.param(data);}
    }).success(function(data) {
        console.log(data);
        $scope.device = data.devices;
        $scope.devices = [];
        // 页数
        $scope.paginationsnum = [];
        var num = Math.ceil($scope.device.length / 18);
        for (var j = 0; j < num; j++) {
            var dom = {
                name: j + 1
            };
            $scope.paginationsnum.push(dom);
        }
        // 默认显示第一页的内容
        for (var i = 0; i < $scope.device.length; i++) {
            if (i < 18) {
                $scope.devices.push($scope.device[i])
            }
        }
    });
    // 添加****
    $scope.add = function() {
        $scope.add_sure = function() {
            $http({
                method: "post",
                url: "../../db/socket.php",
                data: {
                    sid: sid,
                    cmd: "add_device",
                    name:$scope.addItem.name,
                    mac:$scope.addItem.mac,
                    did:$scope.addItem.did,
                    vendor:$scope.addItem.vendor,
                    lat:$scope.addItem.lat,
                    lon:$scope.addItem.lon,
                    floor:$scope.addItem.floor
                },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function(data) {return $.param(data);}
            }).success(function(data) {
                console.log(data);
                $scope.paginationsnum = [];
                var num = Math.ceil(($scope.device.length + 1) / 18);
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
        $scope.deviceItem = $scope.devices[index];
        var s_name = $scope.deviceItem.name,
            s_mac=$scope.deviceItem.mac,
            s_did=$scope.deviceItem.did,
            s_lat=$scope.deviceItem.lat,
            s_lon=$scope.deviceItem.lon,
            s_floor=$scope.deviceItem.floor,
            s_vendor=$scope.deviceItem.vendor;
        $scope.change_sure= function() {
            $http({
                method: "post",
                url: "../../db/socket.php",
                data: {
                    sid: sid,
                    cmd: "edit_device",
                    id: $scope.deviceItem.id,
                    name: $scope.deviceItem.name,
                    mac:$scope.deviceItem.mac,
                    did:$scope.deviceItem.did,
                    vendor:$scope.deviceItem.vendor,
                    lat:$scope.deviceItem.lat,
                    lon:$scope.deviceItem.lon,
                    floor:$scope.deviceItem.floor
                },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                transformRequest: function(data) {return $.param(data);}
            }).success(function (data) {
                console.log(data);
            });
            $('#changeModal').modal('hide')
        };
        $scope.change_cancel=function () {
            $scope.deviceItem.name = s_name;
            $scope.deviceItem.mac=s_mac;
            $scope.deviceItem.did=s_did;
            $scope.deviceItem.vendorid=s_vendor;
            $scope.deviceItem.lat=s_lat;
            $scope.deviceItem.lon=s_lon;
            $scope.deviceItem.floor=s_floor;
            $('#changeModal').modal('hide')
        };
    };
    // 删除
    $scope.delete= function(index) {
        $scope.deviceItem = $scope.devices[index];
        $scope.delete_sure = function() {
            $http({
                method: "post",
                url: "../../db/socket.php",
                data: {
                    sid: sid,
                    cmd: "del_device",
                    id:$scope.deviceItem.id
                },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                transformRequest: function(data) {return $.param(data);}
            }).success(function(data) {
                console.log(data);
                var big = Math.floor(($scope.device.length - 1) / 18);
                var flag = ($scope.device.length - 1) - big * 18;
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
            $('#deleteModal').modal('hide')
        };
        $('#close').click(function(){
            $('#deleteModal').modal('hide')
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
            url: "../../db/socket.php",
            data: {
                sid: sid,
                cmd: 'get_device'
            },
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            transformRequest: function(data) {return $.param(data);}
        }).success(function(data) {
            $scope.device = data.devices;
            $scope.devices = [];
            var min = agination_index,
                max = agination_index + 1,
                s_num = min * 18,
                e_num = max * 18;
            for (var i = 1; i <= $scope.device.length; i++) {
                if (i > s_num && i <= e_num) {
                    $scope.devices.push($scope.device[i - 1]);
                }
            }
            $($('.pagination li.Pagination')[agination_index]).addClass('active').siblings().removeClass('active');
        });
    }
}]);
