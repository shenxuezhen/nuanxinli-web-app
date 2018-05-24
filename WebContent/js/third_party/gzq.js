/**
 * Created by Administrator on 2017/9/20 0020.
 */
//初始化工作圈
function init(onReady, onBack, rightMenu,isLogin) {
    if(test){
        test.isPhoto=1;
    }else {
        var test;
    }
    if (window.cordova) {
        console.log("cordova已经加载过，不用再次加载");
        onBackHandler.onBack = onBack;
        if (!document.bactbuttonhanlder) {
            document.bactbuttonhanlder = true;
            document.addEventListener('backbutton', onBackHandler);
        }
        var param = {
            "onBackClick": "onBackHandler();",
        };

        if (rightMenu) {
            param.right = rightMenu;
        }
        setTopBar(param);

        if(onReady){
            onReady();
        }
    } else {
        var androidCor = '/warm/js/android/cordova.js', iosCor = '/warm/js/ios/cordova.js';
        loadJS((browser.android) ? androidCor : iosCor, function () {
            document.addEventListener("deviceready", function () {
                onBackHandler.onBack = onBack;
                if (!document.bactbuttonhanlder) {
                    document.bactbuttonhanlder = true;
                    document.addEventListener('backbutton', onBackHandler);
                }
                var param = {
                    "onBackClick": "onBackHandler();",
                };

                if (rightMenu) {
                    param.right = rightMenu;
                }
                setTopBar(param);

                if(!localStorage.getItem('sid')){
                    login(onReady);
                } else {
                    onReady();
                }
            }, true);
        });
    }
}

function notLogin(url, data, callback, error, errorCallback) {
    var userInfo = JSON.parse(localStorage.getItem('userInfo'));
    nxlLogin(userInfo, function () {
        ajax(url, data, callback, error, errorCallback);
    });
}

function onBackHandler() {
    if (onBackHandler.onBack && typeof onBackHandler.onBack == "function") {
        if (window.location.href.indexOf('nuanWarm.html') > -1) {
            exitNXL();
        } else {
            onBackHandler.onBack();
        }
    }
}

//获取第三方用户信息
function login(onReady) {
    cordova.exec(
        function (data) {
            var data = JSON.parse(data).data;
            if (localStorage.getItem('userInfo')) {
                var employeeInfo = JSON.parse(localStorage.getItem('userInfo'));
            } else {
                var employeeInfo = {
                    thirdPartyId: data.userid,    //员工第三方id
                    name: data.userName,
                    photo: data.userAvatar,
                    department: "",
                    position: "",
                    /*cellphone:"",*/               //是否提供手机号，根据企业中是否提供手机号做判断
                    company: {    //企业对象
                        thirdPartyId: data.entId,   //企业第三方id
                        isProvidePhone: 0,        //是否提供手机号
                        isVendor: 0,              //是否为供应商
                        name: data.entName,
                        logo: data.entAvatar,
                        vendor: {      //供应商对象
                            id: getParam('id'),     //url
                            thirdPartyName: getParam('thirdPartyName')  //供应商标识
                        }
                    },
                    validate: {
                        appId: data.appId,
                        accessToken: data.accessToken,
                        auth: data.auth
                    }
                };
                localStorage.setItem('userInfo', JSON.stringify(employeeInfo));
            }
            nxlLogin(employeeInfo, onReady, function (text) {
                alert("登录失败：" + text);
            });
        },
        function () {
            alert("Failed!");
        },
        'Config',
        'getConfig',
        []
    );
}

function callPhone() {
    cordova.exec(
        function (data) {
        },
        function () {
            alert("调用电话本失败");
        },
        'PhoneCall',
        'phoneCall',
        [{
            'phoneNo': '4006889848'
        }]
    );
}

function feedBack() {
    cordova.exec(
        function (info) {

        },
        function (error) {

        },
        "GZQIM",
        "singleChat",
        [{
            userInfo: {
                "bid": '60009521459'/*'60001072525'*/
            },
            msgs: [{
                type: 0,
                url: "",
                data: "",
                time: 0,
                isSend: 0
            }]
        }]
    );
}

function share() {
    if(window.shareObj){
        cordova.exec(
            function (info) {
            },
            function (error) {
                alert('失败：' + error);
            },
            "GZQShare",
            "share",
            [window.shareObj]
        );
    }
}
//未调用topBar三个点
function setTopBar(param) {
    cordova.exec(
        function (data) {
        },
        function () {
        },
        'TopBar',
        'configNavigationBar',
        [param]
    );
    if (window.shareObj) {
        cordova.exec(
            function (info) {
            },
            function (error) {
                alert('失败：' + error);
            },
            "GZQShare",
            "share",
            [window.shareObj]
        );
    }
}

function exitNXL() {
    cordova.exec(
        function (data) {

        },
        function () {

        },
        'Destroy',
        'destroy',
        []
    )
}

function finishedToPay(data,customerIsOrg) {
    console.log('gzq不需要数据：'+data);
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
        loadJS("/warm/js/payment/payment_gzq.js", function () {
            paymentObj = gzqPayment;
            if (serviceObj.testDId || serviceObj.id) {
                verifyIsPay(orderInfo,serviceObj,paymentObj)
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
    return 'gzq';
}
function setHeader() {
    return {
        source:'gzq',
        device:getSystemInfo().device,
        os:getSystemInfo().os,
        web:true
    }
}
function loadHtml(url) {
    window.location.href=url;
}
function loadHtmlCloseOld(url) {
    loadHtml(url);
}