/** 在微信客户端中打开页面的特定处理*/

/**
 * 页面初始化
 * @param onReady 初始化完成回调
 * @param onBack 用户按返回键回调
 * @param rightMenu 右侧菜单栏设置
 * @param shareObj 分享对象
 */
/*if(!localStorage.getItem('isFirst')){
    alert('心理健康模块正在调试，即将上线');
    localStorage.setItem('isFirst',1);
}*/
function init(onReady, onBack, rightMenu ,isLogin) {
    if (localStorage.getItem('sid') || getCookie('sid')) {
        console.log('既然有sid信息，就不需要继续获取第三方登录信息。');
        if (onReady) {
            onReady();
        }
    } else if (getParam('uuid') !== null && getParam('thirdPartyName') !== null) {
        getThirdParty(onReady);
    } else if (getParam('uuid') === null || getParam('thirdPartyName') === null) {
        console.warn('页面参数uuid和thirdPartyName缺失。');
    }
//  exchangeMethods('saveLocalData', 'test', 'test2');
    //alert(exchangeMethods('getLocalData', 'test'));
    if (window.location.href.indexOf('home/home.html') > -1) {
        var param = {"onBackClick": ""};
        exchangeMethods('setTopBar', param);
    } else {
        onBackHandler.onBack = onBack;
        if (!document.bactbuttonhanlder) {
            document.bactbuttonhanlder = true;
            document.addEventListener('backbutton', onBackHandler);
        }
        var param = {"onBackClick": "onBackHandler();"};
        exchangeMethods('setTopBar', param)
    }
}

/**
 * 监听返回键
 */
function onBackHandler() {
    //TODO:处理返回键
    if (onBackHandler.onBack && typeof onBackHandler.onBack == "function") {
        onBackHandler.onBack();
    }
}

/**
 * 获取第三方登录信息
 */
function getThirdParty(onReady) {
    var uuid = getParam('uuid');
    var employeeInfo = {
        thirdPartyId: uuid,    //员工第三方id
        company: {    //企业对象
            thirdPartyId: 'DEFnxl0010001',   //企业第三方id
            isVendor: 0,              //是否为供应商
            name: 'nxlCompany',
            vendor: {      //供应商对象
                id: getParam('id'),     //url
                thirdPartyName: getParam('thirdPartyName')  //供应商标识
            }
        }
    };
    nxlLogin(employeeInfo, onReady, function (status, text) {
        if (status == 0)return;
        alert("登录失败：status:" + status + ",text:" + text);
    });
}

/**
 * 通过第三方打电话
 */
function callPhone() {
}

/**
 * 调用第三方客服
 */
function feedBack() {
}

/**
 * 调用第三方分享
 */
function share() {
    exchangeMethods('share', {})
}

/**
 * 交互封装
 * 本地存储，会有三个参数
 * 调用方法，两个参数
 * @param name 方法名
 * @param key  参数
 * @param value  参数值
 * @returns {*}
 */
function exchangeMethods(name, key, value) {
    if (browser.ios) {
        /* alert('进入IOS');
         alert('window.webkit:'+window.webkit);
         alert('window.webkit.messageHandlers:'+window.webkit.messageHandlers);*/
        if (!window.webkit || !window.webkit.messageHandlers) {
            alert('ios is not fined bridge');
            return;
        }

        if (value) {
            window.webkit.messageHandlers["" + name].postMessage(key, value);
        } else {
            window.webkit.messageHandlers["" + name].postMessage(key);
        }

    } else {
        if (!window.appBridge || !(window.appBridge["" + name])) {
            // alert('android is not fined bridge');
            return;
        }
        if (value) {
            window.appBridge['' + name](key, value);
        } else {
            jsonData = JSON.stringify(key);
            return window.appBridge['' + name](jsonData);
        }
    }
}
function notLogin(url, data, callback, error, errorCallback) {
    var userInfo = JSON.parse(localStorage.getItem('userInfo'));
    nxlLogin(userInfo, function () {
        ajax(url, data, callback, error, errorCallback)
    });
}

function finishedToPay(data,customerIsOrg) {
    console.log('365不需要数据：'+data);
    window.location.href = '/warm/order/test_order_details.html?customerIsOrg=' + customerIsOrg;
}

function testState(data) {
    return 'data:'+data;
}

function loadPayment(orderInfo,serviceObj,paymentObj) {
    if (serviceObj.payAmount == 0) {
        loadJS("/warm/js/payment/payment_zero.js", function () {
            paymentObj = zeroPayment;
            verifyIsPay(orderInfo,serviceObj, paymentObj);
        });
    } else {
        loadJS("/warm/js/payment/payment_s365.js", function () {
            paymentObj = s365Payment;
            if (serviceObj.testDId || serviceObj.id) {
                verifyIsPay(orderInfo,serviceObj, paymentObj);
            }
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
    return 'nxl';
}
function setHeader() {
    var systemInfo=getSystemInfo();
    return {
        source:'nxl',
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