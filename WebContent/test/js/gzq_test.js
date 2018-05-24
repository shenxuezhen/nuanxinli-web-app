/**
 * Created by Administrator on 2017/9/20 0020.
 */
function callPhone(){
    cordova.exec(
        function (data) {
        },
        function () {
            alert("调用电话本失败");
        },
        'PhoneCall',
        'phoneCall',
        [{
            'phoneNo':'4006889848'
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
            userInfo : {
                "bid": '60009521459'/*'60001072525'*/
            },
            msgs :[{
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
    cordova.exec(
        function(info) {
        },
        function(error) {
            alert('失败：'+error);
        },
        "GZQShare",
        "share",
        [{
            title : share.shareObj.title,
            content : share.shareObj.content,
            iconUrl : share.shareObj.iconUrl,
            shareUrl : share.shareObj.shareUrl
        }]
    );
}

function callBackHandler() {
    /*if (onBack && typeof onBack == "function"){
     onBack();
     }else
     */
    if (callBackHandler.onBack && typeof callBackHandler.onBack == "function"){
        callBackHandler.onBack();
    }else {
        window.history.go(-1);
    }
}

function configGZQ(onReady,onBack,rightMenu,shareObj) {
    if (onReady && typeof onReady == "function"){
        onReady();
    }
    callBackHandler.onBack = onBack;
    if (!document.bactbuttonhanlder){
        document.bactbuttonhanlder = true;
        document.addEventListener('backbutton',callBackHandler);
    }
    var param={
        "onBackClick":'callBackHandler();'
    };
    if(rightMenu){
        param.right=rightMenu;
    }
    if (shareObj){
        share.shareObj = shareObj;
    }
    cordova.exec(
        function (data) {},
        function () {},
        'TopBar',
        'configNavigationBar',
        [param]
    );
}

function  initGZQ(onReady,onBack,rightMenu,shareObj) {
    if (window.cordova){
        console.log("cordova已经加载过，不用再次加载");
        configGZQ(onReady,onBack,rightMenu,shareObj);
    }else{
        var androidCor = '/warm/js/android/cordova.js', iosCor = '/warm/js/ios/cordova.js';
        loadJS((browser.android) ? androidCor : iosCor, function () {
            document.addEventListener("deviceready", function () {
                configGZQ(onReady,onBack,rightMenu,shareObj);
            }, true);
        });
    }
}

