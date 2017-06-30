angular.module('app').controller('typesCtrl', ['$http', '$scope','locals', function($http, $scope,locals){
  var userInfo=locals.getObject('userInfo'),
      sid=userInfo.sid,
      uid=window.localStorage.getItem('uid');
  var agination_index = 0;  //分页的核心变量
    $http({
        method: "post",
        url: "../../db/socket.php",
        data: {
            sid: sid,
            cmd: 'get_type'
        },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        transformRequest: function(data) {return $.param(data);}
    }).success(function(data) {
        console.log(data);
        $scope.type = data.types;
        $scope.types = [];
        // 页数
        $scope.paginationsnum = [];
        var num = Math.ceil($scope.type.length / 18);
        for (var j = 0; j < num; j++) {
            var dom = {
                name: j + 1
            };
            $scope.paginationsnum.push(dom);
        }
        // 默认显示第一页的内容
        for (var i = 0; i < $scope.type.length; i++) {
            if (i < 18) {
                $scope.types.push($scope.type[i])
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
                    cmd: "add_type",
                    defaultname:$scope.addItem.name,
                    defaultprice:$scope.addItem.price,
                    type:$scope.addItem.type,
                    remark:$scope.addItem.remark
                },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function(data) {return $.param(data);}
            }).success(function(data) {
                // 页数
                $scope.paginationsnum = [];
                var num = Math.ceil(($scope.type.length + 1) / 18);
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
    // 修改*****
    $scope.change = function(index) {
        $scope.typeItem = $scope.types[index];
        var s_name = $scope.typeItem.defaultsocketname,
            s_price=$scope.typeItem.defaultprice,
            s_type=$scope.typeItem.type,
            s_remark=$scope.typeItem.remark;
        $scope.change_sure= function() {
            $http({
                method: "post",
                url: "../../db/socket.php",
                data: {
                    sid: sid,
                    cmd: "edit_type",
                    id: $scope.typeItem.id,
                    defaultsocketname: $scope.typeItem.defaultsocketname,
                    defaultprice:$scope.typeItem.defaultprice,
                    type:$scope.typeItem.type,
                    remark:$scope.typeItem.remark
                },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                transformRequest: function(data) {return $.param(data);}
            }).success(function (data) {
                console.log(data);
            });
            $('#changeModal').modal('hide');
        };
        $scope.change_cancel=function () {
            $scope.typeItem.name = s_name;
            $scope.typeItem.defaultprice=s_price;
            $scope.typeItem.type=s_type;
            $scope.typeItem.remark=s_remark;
            $('#changeModal').modal('hide')
        };
    };
    // 删除
    $scope.delete= function() {
        $scope.delete_sure = function() {
            $http({
                method: "post",
                url: "../../db/socket.php",
                data: {
                    sid: sid,
                    cmd: "del_type",
                    id:$scope.typeItem.id
                },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                transformRequest: function(data) {return $.param(data);}
            }).success(function(data) {
                console.log(data);
                //分页   判断删除时，地区条数是否正好是18的倍数，如果是则agination_index要减一
                var big = Math.floor(($scope.type.length - 1) / 18);
                var flag = ($scope.type.length - 1) - big * 18;
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
                cmd: 'get_type'
            },
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            transformRequest: function(data) {return $.param(data);}
        }).success(function(data) {
            $scope.type = data.types;
            $scope.types = [];
            var min = agination_index,
                max = agination_index + 1,
                s_num = min * 18,
                e_num = max * 18;
            for (var i = 1; i <= $scope.type.length; i++) {
                if (i > s_num && i <= e_num) {
                    $scope.types.push($scope.type[i - 1]);
                }
            }
            $($('.pagination li.Pagination')[agination_index]).addClass('active').siblings().removeClass('active');
        });
    }
}]);
