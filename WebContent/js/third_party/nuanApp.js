function init(onReady, onBack, rightMenu, isLogin) {
    if (isLogin == 0) {
        if (onReady) {
            onReady();
        }
        return;
    }
    if (!(localStorage.getItem('sid') || getCookie('sid'))) {
        var userData = browser.nuanApp.relogin();
        ajax('/public/user/login', userData, function (resp) {
            localStorage.setItem('userInfo', JSON.stringify({name: resp.name}));
        });
    }
    if (onReady) {
        onReady();
    }
}

function notLogin(url, data, callback, error, errorCallback) {
    var userData = browser.nuanApp.relogin();
    ajax('/public/user/login', userData, function (resp) {
        ajax(url, data, callback, error, errorCallback);
    });
}

function finishedToPay(data, customerIsOrg) {
    browser.nuanApp.pay(JSON.stringify(data));
}

function testState(data) {
    browser.nuanApp.stateChange(JSON.stringify(data));
}

//分享相关的操作，调的是app的样式
function shareApp() {
    browser.nuanApp.share(JSON.stringify({"url": getShareUrl(), "testDId": getTestDId()}));
}

function loadPayment(orderInfo,serviceObj,paymentObj) {
    if (serviceObj.payAmount == 0) {
        loadJS("/warm/js/payment/payment_zero.js", function () {
            paymentObj = zeroPayment;
            verifyIsPay(orderInfo,serviceObj, paymentObj);
        });
    } else {
        var serviceType = localStorage.getItem('serviceType');
        if (serviceType === 'test') {
            browser.nuanApp.pay(JSON.stringify({
                'type': 'test',
                'po': {
                    'testIId': getTestIId(),
                    'testDId': getTestDId(),
                    'price': getPrice()
                }
            }));
        } else if (serviceType === 'course') {
            var courseOwnUrl = window.location.origin + '/warm/course/course_own.html?courseId=' + serviceObj.id;
            var coursePlayUrl = window.location.origin +  '/warm/course/course_play.html?courseId=' + serviceObj.id + '&itemId=' + serviceObj.items[0].id;
            if (serviceObj.isSeries === 1) {//系列课程
                successUrl = courseOwnUrl;
            } else {//单节课程
                successUrl = coursePlayUrl;
            }
            browser.nuanApp.payOrder(JSON.stringify({
                'stateCode':'commonOrder',
                'order':{
                    'order':orderInfo,
                    'orderDesc':serviceObj.name,
                    'orderType':"课程",
                    'sourceId':serviceObj.id,
                    'successUrl':successUrl
                }
            }));
        }
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
    return "¥" + str + "元";
}
function channel() {
    return 'nuanApp';
}

function setHeader() {
    var userAgent = JSON.parse(browser.nuanApp.getWarmUserAgent());
    return {
        source: 'web',
        version: userAgent.version,
        device: userAgent.device,
        os: userAgent.os,
        web: true
    }
}
function loadHtml(url) {
    browser.nuanApp.loadSpecifiedUrl(window.location.origin + url);
}
function loadHtmlCloseOld(url) {
    browser.nuanApp.loadSpecifiedUrlFinish(window.location.origin + url);
}