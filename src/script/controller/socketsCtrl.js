angular.module('app').controller('socketsCtrl', ['$http', '$scope','locals', function($http, $scope,locals){
  var userInfo=locals.getObject('userInfo'),
      sid=userInfo.sid,
      uid=window.localStorage.getItem('uid');
  var agination_index = 0;  //分页的核心变量
    $http({
        method: "post",
        url: "../../db/socket.php",
        data: {
            sid: sid,
            cmd: 'get'
        },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        transformRequest: function(data) {return $.param(data);}
    }).success(function(data) {
        console.log(data);
        $scope.socket = data.sockets;
        $scope.sockets = [];
        // 页数
        $scope.paginationsnum = [];
        var num = Math.ceil($scope.socket.length / 18);
        for (var j = 0; j < num; j++) {
            var dom = {
                name: j + 1
            };
            $scope.paginationsnum.push(dom);
        }
        // 默认显示第一页的内容
        for (var i = 0; i < $scope.socket.length; i++) {
            if (i < 18) {
                $scope.sockets.push($scope.socket[i])
            }
        }
    });
    // 添加地区**********
    $scope.add = function() {
        $scope.add_sure = function() {
            // 调用添加地区信息接口
            $http({
                method: "post",
                url: "../../db/socket.php",
                data: {
                    sid: sid,
                    cmd: "add",
                    device:$scope.addItem.device,
                    index:$scope.addItem.index,
                    type:$scope.addItem.type,
                    socketname:$scope.addItem.socketname,
                    price:$scope.addItem.price,
                    floor:$scope.addItem.floor,
                    num:$scope.addItem.num
                },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function(data) {return $.param(data);}
            }).success(function(data) {
                console.log(data);
                // 页数
                $scope.paginationsnum = [];
                var num = Math.ceil(($scope.socket.length + 1) / 18);
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
    // 修改****
    $scope.change = function(index) {
        $scope.socketItem = $scope.sockets[index];
        var s_device = $scope.socketItem.device,
            s_price=$scope.socketItem.price,
            s_type=$scope.socketItem.type,
            s_index=$scope.socketItem.index,
            s_num=$scope.socketItem.num,
            s_socketname=$scope.socketItem.socketname;
        $scope.change_sure= function() {
            $http({
                method: "post",
                url: "../../db/socket.php",
                data: {
                    sid: sid,
                    cmd: "edit",
                    id: $scope.socketItem.id,
                    device: $scope.socketItem.device,
                    price:$scope.socketItem.price,
                    type:$scope.socketItem.type,
                    index:$scope.socketItem.index,
                    socketname:$scope.socketItem.socketname,
                    num:$scope.socketItem.num
                },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                transformRequest: function(data) {return $.param(data);}
            }).success(function (data) {
                $('#changeModal').modal('hide');
            });
        };
        $scope.change_cancel=function () {
            $scope.socketItem.device = s_device;
            $scope.socketItem.price=s_price;
            $scope.socketItem.type=s_type;
            $scope.socketItem.index=s_index;
            $scope.socketItem.num=s_num;
            $scope.socketItem.socketname=s_socketname;
            $('#changeModal').modal('hide')
        };
    };
    // 删除
    $scope.delete= function(index) {
        $scope.socketItem = $scope.sockets[index];
        $scope.delete_sure = function() {
            $http({
                method: "post",
                url: "../../db/socket.php",
                data: {
                    sid: sid,
                    cmd: "del",
                    id:$scope.socketItem.id
                },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                transformRequest: function(data) {return $.param(data);}
            }).success(function(data) {
                console.log(data);
                var big = Math.floor(($scope.socket.length - 1) / 18);
                var flag = ($scope.socket.length - 1) - big * 18;
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
                cmd: 'get'
            },
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            transformRequest: function(data) {return $.param(data);}
        }).success(function(data) {
            $scope.socket = data.sockets;
            $scope.sockets = [];
            var min = agination_index,
                max = agination_index + 1,
                s_num = min * 18,
                e_num = max * 18;
            for (var i = 1; i <= $scope.socket.length; i++) {
                if (i > s_num && i <= e_num) {
                    $scope.sockets.push($scope.socket[i - 1]);
                }
            }
            $($('.pagination li.Pagination')[agination_index]).addClass('active').siblings().removeClass('active');
        });
    }
}]);
