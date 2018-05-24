/**
 * 变量含义
 * @param payState 支付流程记录
 * @param openid 微信公众号需要
 * @param timestamp 时间戳
 * @param signature 签名
 * @param nonce 随机字符串
 * @param price 测评题价格
 * @param wxOrderInfo 微信统一下单
 * @param sid 登录状态
 * @param orderId 订单编号id
 * @param isSuccess 支付成功轮询变量
 * @param extra ping++判断微信支付还是支付宝支付
 */
var openid,nonce,price,sid,orderId,orderNo;

//下载暖心理APP
function tested() {
    $(".warningBox").show();
    $(".warning").show();
    var windowW=document.documentElement.clientWidth;
    var windowH=document.documentElement.clientHeight;
    $(".warningBox").css('width',windowW);
    $(".warningBox").css('height',windowH);
    $(".warningBox").addClass('warningBoxPosition');
    $("#down-warm-app").on('touchstart',function () {
        var downA=document.getElementById('down-warm-app');
        if (browser.ios) {
            if (browser.weixin) {
                downA.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.chocolate.warmapp&g_f=991653';
            } else {
                downA.href = 'https://itunes.apple.com/us/app/nuan-xin-li/id983939376';
                }
        } else {
            if (browser.weixin) {
                downA.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.chocolate.warmapp&g_f=991653';
            } else {
                downA.href = 'http://app.nuanxinli.com/warm/WarmApp.apk';
            }
        }
    });
    $("#close-down").on('touchstart',function () {
        $(".warningBox").hide();
        $(".warning").hide();
    })
}
//准与不准点击的相关操作
function accuracyFunction() {
    var time;
    $("#accuracy").on('touchstart', function () {
        $("#accuracy").off('touchstart');
        $("#not-accuracy").off('touchstart');
        accuracyY();
        clearInterval(time);
        time = setTimeout(function () {
            $("#accuracy").attr("class", "animate");
        }, 10);
        save(vueData.data.id, 1);
    });
    $("#not-accuracy").on('touchstart', function () {
        $("#accuracy").off('touchstart');
        $("#not-accuracy").off('touchstart');
        accuracyN();
        clearInterval(time);
        time = setTimeout(function () {
            $("#not-accuracy").attr("class", "animate");
        }, 10);
        save(vueData.data.id, 0);
    })
}
//解决Android点击输入框键盘遮住输入框
function inputShade(ele) {
    var oHeight = $(document).height(); //浏览器当前的高度
    $(window).resize(function(){
        if($(document).height() < oHeight){
            ele.css("position","static");
        }else{
            ele.css("position","absolute");
        }
    });

}
//判断准不准的显示以及调用点击事件
function feelGood() {
    if (testIId) {
        //之所以要方分别判断0和1，是因为有null的情况，这时两个都不选
        if (vueData.data.feelGood == '0' || vueData.data.feelGood == '1') {
            (vueData.data.feelGood == '1') ? accuracyY() : accuracyN();
        } else {
            accuracyFunction();
        }
    } else {
        accuracyFunction();
    }
}

//点击更多按钮的操作
function stretch() {
    $('.stretch').hide();
    $('.center').show();
    if ($('.trait')) $('.trait').show();
    if ($('.dimension')) $('.dimension').show();
    if ($('.result-division')) $('.result-division').show();
}
//觉得准或者不准的post请求
function save(testIId, feelGood) {
    var accuracyUrl = '/public/test-i/' + testIId + '/feel/' + feelGood;
    ajaxPOST(accuracyUrl,'POST',null,null);
}
//改变准或者不准的样式，以及动画效果
function accuracyY() {
    $("#accuracy").attr("src", "../images/exact.png");
    $(".yes").addClass('.feelGoodClick');
}
function accuracyN() {
    $("#not-accuracy").attr("src", "../images/forbid.png");
    $(".no").addClass('.feelGoodClick');
}
//判断当前页面是否是分享页
function isShare(vueData) {
    if (isS == '1' && (vueData.data.feelGood == '0' || vueData.data.feelGood == '1')) {
        (vueData.data.feelGood == '1') ? accuracyY() : accuracyN();
    }
}
//16进制颜色转为RGB格式
String.prototype.colorRgb = function () {
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    var sColor = this.toLowerCase();
    if (sColor && reg.test(sColor)) {
        if (sColor.length === 4) {
            var sColorNew = "#";
            for (var i = 1; i < 4; i += 1) {
                sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
            }
            sColor = sColorNew;
        }
        //处理六位的颜色值
        var sColorChange = [];
        for (var i = 1; i < 7; i += 2) {
            sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
        }
        console.log("rgba(" + sColorChange.join(",") + ",0.1" + ")");
        return "rgba(" + sColorChange.join(",") + ",0.1" + ")";
    } else {
        return sColor;
    }
};
//画饼状图
function drawDISC(data) {
    var legendData = [];
    var colorArray = [];
    if (!data.arrageDivisionList) {
        $('#container').css({'width': 0, 'height': 0});
        return
    }
    for (var i = 0; i < data.arrageDivisionList.length; i++) {
        var divis = data.arrageDivisionList[i].name;
        legendData[i] = divis;
        var coloris = data.arrageDivisionList[i].color;
        colorArray[i] = coloris;
    }
    //highcharts相关配置
    $(function () {
        $('#container').highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: ''
            },
            tooltip: {
                pointFormat: '{series.name}:{point.percentage:.1f}%'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: false,
                    animation:false,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '{point.name}:{point.percentage:.1f}%',
                        style: {
                            width: '100px', // 重点在此
                            'color': (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                            'fontSize': '10px'
                        },
                        distance: 10,//控制引导线的长度
                    }
                },
            },

            exporting: {//导出的菜单
                enabled: false,  //设置导出按钮不可用
            },
            credits: {//右下角的公司相关
                text: "",
                href: "http://"
            },
            series: [{
                type: 'pie',
                name: '占比',
                data: data.arrageDivisionList
            }],
            colors: colorArray
        });
    });
}
/**
 * 随机生成字符串
 * @param randomFlag 产生任意长度随机字母数字组合
 * @param min 任意长度最小位[固定位数]
 * @param max 任意长度最大位
 * @returns {string}
 */
function noncestr(randomFlag, min, max) {
    var str = "",
        range = min,
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    // 随机产生
    if(randomFlag){
        range = Math.round(Math.random() * (max-min)) + min;
    }
    for(var i=0; i<range; i++){
        pos = Math.round(Math.random() * (arr.length-1));
        str += arr[pos];
    }
    return str;
}

//处理我的订单页数据
function treatmentOrder(data) {
    var list=data.list,serviceList=data.serviceList,testDList=data.testDList;
    list.forEach(function(listVal){
        $.each(listVal,function(keyList,valList){
            if(keyList=='serviceId'){
                serviceList.forEach(function(serviceVal){
                    $.each(serviceVal,function(keyService,valService){
                        if(keyService=='id' && valList==valService){
                            if(serviceVal.testIId){
                                listVal.testIId=serviceVal.testIId;
                            }else {
                                listVal.testIId='';
                            }
                            listVal.price=serviceVal.price;
                            listVal.validDays=serviceVal.testDPrice?serviceVal.testDPrice.validDays:serviceVal.validDays;
                            var testDId=serviceVal.testDId;
                            testDList.forEach(function(testDVal){
                                $.each(testDVal,function(keyTestD,valTestD){
                                    if(keyTestD=='id' && valTestD==testDId){
                                        listVal.title=testDVal.title;
                                        listVal.validDays=testDVal.testDPrice?testDVal.testDPrice.validDays:testDVal.validDays;
                                        listVal.type=testDVal.type;
                                        listVal.testDId=valTestD;
                                        listVal.img=testDVal.img;
                                        return false;
                                    }
                                })
                            });
                            return false;
                        }
                    })
                });
                return false;
            }
        });
    });
    return list;
}
