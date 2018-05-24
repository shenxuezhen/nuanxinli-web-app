/**
 * Created by Administrator on 2018/1/26.
 */
function init(onReady, onBack, rightMenu,isLogin) {
    if(isLogin==0){
        if (onReady){
            onReady();
        }
        return;
    }
    if(!(localStorage.getItem('sid') || getCookie('sid'))){
        loginDialog();
    }
    onReady();
}

function notLogin(url, data, callback, error, errorCallback) {
//在普通浏览器中的处理
    loginDialog(url, data, callback, error, errorCallback);
}

function finishedToPay(data,customerIsOrg) {
    console.log('browser不需要数据：'+data);
    window.location.href = '/warm/order/test_order_details.html?customerIsOrg=' + customerIsOrg;
}

function testState(data) {
    return 'data:'+data;
}

function loadPayment(orderInfo,serviceObj,paymentObj) {
    if (serviceObj.payAmount == 0) {
        loadJS("/warm/js/payment/payment_zero.js", function () {
            paymentObj = zeroPayment;
            verifyIsPay(orderInfo,serviceObj,paymentObj)
        });
    } else {
        loadJS("/warm/js/payment/payment_ali.js", function () {
            paymentObj = aliPayment;
            verifyIsPay(orderInfo,serviceObj,paymentObj);
            $('#alipayWap').addClass('alipayWap');
            $('#alipayWap').attr('src', '/warm/test/alipay_wap_before.html');
        });
    }
}

function mainColor() {//主打色
    return '#fcab55';
}
function buttonColor() {//button色
    return '#fcab55';
}
function fbColor() {//浅色背景
    return '#fee2c5';
}
function heartImg() {
    return '/warm/images/navigation/thatmindApp.png';
}
function videoImg() {
    return '/warm/images/navigation/decompression_audioApp.png';
}
function magazineImg() {
    return '/warm/images/magazine/biaoqqian_bjApp.png';
}
/*function courseListPlayImg() {
    return '/warm/images/bbs/pausebutton_smallApp.png';
}*/
function editHeartImg() {
    return '/warm/images/bbs/levitationbuttonApp.png';
}
function bbsNiming() {
    return '/warm/images/bbs/nimingApp.jpg';
}
function audioButtonImg() {
    return '/warm/images/audio/pausebutton_smallApp.png';
}
function transitionPrice(str) {
    return "¥"+ str+"元";
}
function channel() {
    return 'browser';
}
function setHeader() {
    var systemInfo=getSystemInfo();
    return {
        source:'web',
        device:systemInfo.device,
        os:systemInfo.os,
        web:true
    }
}
function loadHtml(url) {
    window.location.href=url;
}
function loadHtmlCloseOld(url) {
    loadHtml(url);
}