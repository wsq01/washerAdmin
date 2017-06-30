angular.module('app').controller('ordersCtrl', ['$http', '$scope','locals', function($http, $scope,locals){
  var userInfo=locals.getObject('userInfo'),
      sid=userInfo.sid,
      uid=window.localStorage.getItem('uid');
  var agination_index = 0;  //分页的核心变量
    $http({
        method: "post",
        url: "../../db/order.php",
        data: {
            sid: sid,
            cmd: 'get_orders',
            customer:'0'
        },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        transformRequest: function(data) {return $.param(data);}
    }).success(function(data) {
        console.log(data);
        $scope.order = data.orders;
        $scope.orders = [];
        // 页数
        $scope.paginationsnum = [];
        var num = Math.ceil($scope.order.length / 18);
        for (var j = 0; j < num; j++) {
            var dom = {
                name: j + 1
            };
            $scope.paginationsnum.push(dom);
        }
        // 默认显示第一页的内容
        for (var i = 0; i < $scope.order.length; i++) {
            if (i < 18) {
                $scope.orders.push($scope.order[i])
            }
        }
    });
    // 添加地区**********
    $scope.add = function() {
        $scope.add_sure = function() {
            // 调用添加地区信息接口
            $http({
                method: "post",
                url: "../../db/order.php",
                data: {
                    sid: sid,
                    cmd: "add_order",
                    socket:$scope.addItem.socket,
                    duration:$scope.addItem.duration,
                    amount:$scope.addItem.amount,
                    mode:$scope.addItem.mode,
                    addr:$scope.addItem.addr
                },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function(data) {return $.param(data);}
            }).success(function(data) {
                console.log(data);
                $scope.paginationsnum = [];
                var num = Math.ceil(($scope.order.length + 1) / 18);
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
    $scope.finish_order=function (index) {
        $http({
            method:'post',
            url:'../../db/order.php',
            data:{
                sid:sid,
                cmd:'finish_order',
                id:$scope.orders[index].id
            },
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            transformRequest: function(data) {return $.param(data);}
        }).success(function (data) {
            console.log(data);
            getPagination(agination_index);
        });
        $scope.confirm_pay=function (index) {
            $http({
                method: 'post',
                url: '../../db/order.php',
                data: {
                    sid: sid,
                    cmd: 'confirm_pay',
                    id: $scope.orders[index].id
                },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function (data) {
                    return $.param(data);
                }
            }).success(function (data) {
                console.log(data);
                getPagination(agination_index);
            })
        }
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
            url: "../../db/order.php",
            data: {
                sid: sid,
                cmd: 'get_orders',
                customer:'0'
            },
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            transformRequest: function(data) {return $.param(data);}
        }).success(function(data) {
            $scope.order = data.orders;
            $scope.orders = [];
            var min = agination_index,
                max = agination_index + 1,
                s_num = min * 18,
                e_num = max * 18;
            for (var i = 1; i <= $scope.order.length; i++) {
                if (i > s_num && i <= e_num) {
                    $scope.orders.push($scope.order[i - 1]);
                }
            }
            $($('.pagination li')[agination_index]).addClass('active').siblings().removeClass('active');
        });
    }
    $scope.dateTime=function () {
        $('.form_dateTime').datetimepicker({
            language:'zh-CN',
            format:'yyyy-mm-dd',
            autoclose:true,
            minView:2,
            startView:3,
            pickerPosition: "bottom-left"
        });
    };
    $scope.total_sure=function () {
        //按月统计
        console.log($scope.order);
        var rule=$('#t_rule').val();
        console.log(rule);
        var startTime=$('#t_start').val();
        startTime=startTime.split('-');
        console.log(startTime);
        var endTime=$('#t_end').val();
        endTime=endTime.split('-');
        $('#total').modal('hide');
        function unique(x){ //去重
            var res = [];
            var json = {};
            for(var i = 0; i < x.length; i++){
                if(!json[x[i]]){
                    res.push(x[i]);
                    json[x[i]] = 1;
                }
            }
            return res;
        }
        function totalX(){
            var x=[];
            for(var i=0;i<$scope.order.length;i++){
                var orderTime=$scope.order[i].starttime.split( ' ')[0];
                orderTime=orderTime.split('-');
                console.log(orderTime);
                if(rule=='0'&&orderTime[0]>=startTime[0]&&orderTime[0]<=startTime[0]){
                    x.push(orderTime[1]);
                }else if(rule=='1'&&orderTime[0]>=startTime[0]&&orderTime[0]<=startTime[0]&&orderTime[1]>=startTime[1]&&orderTime[1]<=endTime[1]){
                    x.push(orderTime[2]);
                }
            }
            x=unique(x);
            x.sort();
            return x;
        }
        function totalY(x){
            var amount=[];
            for(var i=0;i<x.length;i++){
                amount[i]=0;
                for(var j=0;j<$scope.order.length;j++){
                    var orderTime=$scope.order[j].starttime.split( ' ')[0];
                    orderTime=orderTime.split('-');
                    if(rule=='0'&&$scope.order[j].status=='已完成'){
                       if(orderTime[1]==x[i]){
                           amount[i]+=parseInt($scope.order[j].amount);
                       }
                    }else if(rule=='1'&&orderTime[0]>=startTime[0]&&orderTime[0]<=startTime[0]&&orderTime[1]>=startTime[1]&&orderTime[1]<=endTime[1]&&$scope.order[j].status=='已完成'){
                        if(orderTime[2]==x[i]){
                            amount[i]+=parseInt($scope.order[j].amount);
                        }
                    }
                }
            }
            return amount;
        }
        var X=totalX();
        var Y=totalY(X);
        console.log(X);
        console.log(Y);

        function turn_x(x) {
            for(var i=0;i<x.length;i++){
                if(rule=='0'){
                    x[i]+="月";
                }else if(rule=='1'){
                    x[i]+="日";
                }
            }
            return x;
        }


        var title = {
            text: ''
        };
        var subtitle = {
            text: ''
        };
        var xAxis = {
            categories: turn_x(X)
        };
        var yAxis = {
            title: {
                text: '金额（元）'
            }
        };
        var plotOptions = {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking:true
            }
        };
        var series= [{
            name:'总计',
            data:Y
        }];
        var json = {};
        json.title = title;
        json.subtitle = subtitle;
        json.xAxis = xAxis;
        json.yAxis = yAxis;
        json.series = series;
        json.plotOptions = plotOptions;
        $('#container').highcharts(json);
    };
    $scope.total_cancel=function () {
        $('#total').modal('hide')
    }
}]);
