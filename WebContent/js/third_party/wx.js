/** 在微信客户端中打开页面的特定处理*/
/**常量设置*/
var APP_ID = 'wxef07d81749400b98';
var _NONCE = "mnoihjiylxoahkhuh"; //微信获取签名API需要的随机字符串
var _TIMESTAMP = (new Date()).valueOf();
/**-------*/

/**
 * 页面初始化
 * @param onReady 初始化完成回调
 * @param onBack 用户按返回键回调
 * @param rightMenu 右侧菜单栏设置
 * @param shareObj 分享对象
 */
function init(onReady, onBack, rightMenu, isLogin) {
    if(window.location.href.indexOf('start_team.html')>-1){
        if(onReady)onReady();
        return;
    }
    var wxCode=(getParam('wx_code') || localStorage.getItem('wxCode'));
    var openid=localStorage.getItem('openid');
    if(wxCode){
        localStorage.setItem('wxCode',wxCode);
        if(window.location.href.indexOf('employee')>-1){
            if(!openid){
                getOpenId(onReady);
            } else {
                if (onReady) onReady();
            }
        } else {
            var sid = localStorage.getItem('sid'), isEntry = getParam('isEntry');
            if (sid) {
                console.log('_getSignature调用');
                _getSignature(
                    function (signatureObj) {
                        _loadConfig(signatureObj,onReady);
                    }
                );
                return;
            }
            if(isLogin==0){
                return;
            }
            ajax('/public/weixinmp/login',{
                code:wxCode
            },function (resp, status, xhr) {
                var userInfo={
                    photo:resp.photo,
                    name:resp.alias
                };
                localStorage.setItem('userInfo', JSON.stringify(userInfo));
                localStorage.setItem('openid', resp.openid);
                var headers = xhr.getAllResponseHeaders();
                headers.split('\r\n').forEach(function (value) {
                    if (value.indexOf('sid: ') > -1) {
                        if (value.indexOf('=')) {
                            sid = value.slice(value.indexOf('=') + 1);
                            localStorage.setItem('sid', sid);
                            _getSignature(function (signatureObj) {
                                    _loadConfig(signatureObj,onReady);
                                });
                            return false;
                        }
                    }
                });
            }, null, function (status, responseText) {
                if (status == '718') {
                    var isEntry = getParam('isEntry');
                    var url = window.location.href;
                    if (isEntry) {
                        url = url.replace(url.substr(url.indexOf('isEntry=') + 8, 1), '0');
                    }
                    if(parent.isParent && parent.isParent==1){
                        parent.location.href='https://open.weixin.qq.com/connect/oauth2/authorize?appid='+APP_ID+'&redirect_uri='+encodeURIComponent('https://app.nuanxinli.com/warm/wx/code_exchange.html?url='+url)+'&response_type=code&scope=snsapi_userinfo&state=park#wechat_redirect';
                    }else {
                        window.location.href='https://open.weixin.qq.com/connect/oauth2/authorize?appid='+APP_ID+'&redirect_uri='+encodeURIComponent('https://app.nuanxinli.com/warm/wx/code_exchange.html?url='+url)+'&response_type=code&scope=snsapi_userinfo&state=park#wechat_redirect';
                    }
                }else if(status=='603'){
                    if (window.confirm('亲，你没有关注我们的公众号“暖心理小暖”哦，关注以后才可以查看更多有趣的内容')) {
                        //确定
                        window.location.href='https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzAwMDQxNjI2OA==&scene=124#wechat_redirect';
                        return true;
                    } else {
                        //取消
                        return false;
                    }
                }else {
                    alert('status:'+status+',text:'+responseText);
                }
            });
        }
    } else {
        //重定向获取微信code（code是获取openid的基础）
        if(isLogin==0){
            _getSignature(
                function (signatureObj) {
                    _loadConfig(signatureObj,onReady);
                }
            );
            return;
        }
        var isEntry=getParam('isEntry');
        var url=window.location.href;
        if(isEntry){
            url=url.replace(url.substr(url.indexOf('isEntry=')+8,1),'0');
        }
        if(parent.isParent && parent.isParent==1){
            parent.location.href='https://open.weixin.qq.com/connect/oauth2/authorize?appid='+APP_ID+'&redirect_uri='+encodeURIComponent('https://app.nuanxinli.com/warm/wx/code_exchange.html?url='+url)+'&response_type=code&scope=snsapi_userinfo&state=park#wechat_redirect';
        }else {
            window.location.href='https://open.weixin.qq.com/connect/oauth2/authorize?appid='+APP_ID+'&redirect_uri='+encodeURIComponent('https://app.nuanxinli.com/warm/wx/code_exchange.html?url='+url)+'&response_type=code&scope=snsapi_userinfo&state=park#wechat_redirect';
        }
    }
}

/**
 * 获取微信签名（这是一个后台接口）
 * @private
 */
function _getSignature(onSuccess) {
    console.log('_getSignature执行');
    var signatureObj = {
        timestamp: _TIMESTAMP,
        nonce: _NONCE,
        signature: "",
        appId: APP_ID
    };
    var curl = window.location.href;
    //跟后台约定的参数替换方式，把所有&替换为__AND__，后台接收以后，再替换回来
    var surl = encodeURI(curl).replace(/&/g, "__AND__");
    ajax("/public/weixinmp/signature?noncestr=" + signatureObj.nonce + "&timestamp=" + signatureObj.timestamp + "&url=" + surl, null, function (resp) {
        signatureObj.signature = resp.signature;
        onSuccess(signatureObj);
    });
}

/**
 * 获取openId
 * 微信公众号登录获取权限
 * */
function getOpenId(onReady) {
    var code = getParam('wx_code') || localStorage.getItem('wxCode');
    ajax('/public/weixinmp/openid', {
        "code": code
    }, function (resp) {
        localStorage.setItem('openid', resp);
        if (onReady) onReady();
    }, '发送请求失败:', function (status, responseText) {
        if (status == "718") {
            window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + APP_ID + '&redirect_uri=' + encodeURIComponent('https://app.nuanxinli.com/warm/wx/code_exchange.html?url=' + window.location.href) + '&response_type=code&scope=snsapi_userinfo&state=park#wechat_redirect';
        }
    });
}

/**
 * 加载微信公众平台API JS，并完成配置
 */
function _loadConfig(signatureObj,onReady) {
	var isReady=false;
    loadJS('/warm/js/jweixin-1.2.0.js',function () {
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: signatureObj.appId, // 必填，公众号的唯一标识
            timestamp: signatureObj.timestamp, // 必填，生成签名的时间戳
            nonceStr: signatureObj.nonce, // 必填，生成签名的随机串
            signature: signatureObj.signature, // 必填，签名，
            jsApiList: [
                'checkJsApi',
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo',
                'onMenuShareQZone',
                'hideMenuItems',
                'showMenuItems',
                'hideAllNonBaseMenuItem',
                'showAllNonBaseMenuItem',
                'translateVoice',
                'startRecord',
                'stopRecord',
                'onRecordEnd',
                'playVoice',
                'pauseVoice',
                'stopVoice',
                'uploadVoice',
                'downloadVoice',
                'chooseImage',
                'previewImage',
                'uploadImage',
                'downloadImage',
                'getNetworkType',
                'openLocation',
                'getLocation',
                'hideOptionMenu',
                'showOptionMenu',
                'closeWindow',
                'scanQRCode',
                'chooseWXPay',
                'openProductSpecificView',
                'addCard',
                'chooseCard',
                'openCard'
            ]
        });
        wx.error(function (res) {
            console.log('出现一个问题:' + res.errorMessage);
        });
        wx.ready(function() {
            if(window.shareObj){
                var shareConfig = {
                    title: window.shareObj.title, // 分享标题
                    desc: window.shareObj.content, // 分享描述
                    link: window.shareObj.shareUrl,
                    imgUrl: window.shareObj.iconUrl, // 分享图标
                    type: 'link', // 分享类型,music、video或link，不填默认为link
                    success: function () {
                        console.log('用户分享');

                    },
                    cancel: function () {
                        console.log('onMenuShareAppMessage cancel');
                    }
                };
            }
            wx.onMenuShareAppMessage(shareConfig);
            wx.onMenuShareTimeline(shareConfig);
            wx.onMenuShareQQ(shareConfig);
            wx.onMenuShareWeibo(shareConfig);
            wx.onMenuShareQZone(shareConfig);
            if (onReady) {
            	if(!isReady){
            		isReady=true;
                	onReady();
            	}
            	
            }
        });
        if(onReady){
        	if(!isReady){
        		isReady=true;
            	onReady();
        	}
        }
    })
}

/**
 * 监听返回键
 */
function onBackHandler() {
//TODO:处理返回键
}

/**
 * 401处理
 */

function notLogin(url, data, callback, error, errorCallback) {
    //在微信的的处理
    var wxCode = (getParam('wx_code') || localStorage.getItem('wxCode'));
    var openId = localStorage.getItem('openid');
    if (!openId) {
        if (wxCode) {
            ajax('/public/weixinmp/login', {
                code: wxCode
            }, function (resp, status, xhr) {
                var userInfo = {
                    photo: resp.photo,
                    name: resp.alias
                };
                localStorage.setItem('userInfo', JSON.stringify(userInfo));
                localStorage.setItem('openid', resp.openid);
                ajax(url, data, callback, error);
            }, null, function (status, responseText) {
                if (status == '718') {
                    var isEntry = getParam('isEntry');
                    var url = window.location.href;
                    if (isEntry) {
                        url = url.replace(url.substr(url.indexOf('isEntry=') + 8, 1), '0');
                    }
                    var APP_ID = 'wxef07d81749400b98';
                    window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + APP_ID + '&redirect_uri=' + encodeURIComponent('https://app.nuanxinli.com/warm/wx/code_exchange.html?url=' + url) + '&response_type=code&scope=snsapi_userinfo&state=park#wechat_redirect';
                } else if (status == '603') {
                    if (window.confirm('亲，你没有关注我们的公众号“暖心理小暖”哦，关注以后才可以查看更多有趣的内容')) {
                        //确定
                        window.location.href = 'https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzAwMDQxNjI2OA==&scene=124#wechat_redirect';
                        return true;
                    } else {
                        //取消
                        return false;
                    }
                } else {
                    alert('status:' + status + ',text:' + responseText);
                }
            });
        } else {
            var APP_ID = 'wxef07d81749400b98';
            if (parent.isParent && parent.isParent == 1) {
                parent.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + APP_ID + '&redirect_uri=' + encodeURIComponent('https://app.nuanxinli.com/warm/wx/code_exchange.html?url=' + window.location.href) + '&response_type=code&scope=snsapi_userinfo&state=park#wechat_redirect';
            } else {
                window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + APP_ID + '&redirect_uri=' + encodeURIComponent('https://app.nuanxinli.com/warm/wx/code_exchange.html?url=' + window.location.href) + '&response_type=code&scope=snsapi_userinfo&state=park#wechat_redirect';
            }
        }
    } else {
        ajax("/public/weixinmp/login/openid", {openid: openId}, function (resp, status, xhr) {
            var headers = xhr.getAllResponseHeaders();
            headers.split('\r\n').forEach(function (value) {
                if (value.indexOf('sid: ') > -1) {
                    if (value.indexOf('=')) {
                        var sid = value.slice(value.indexOf('=') + 1);
                        localStorage.setItem('sid', sid);
                        setCookie('sid', sid);
                        ajax(url, data, callback, error);
                    }
                }
            })
        }, null, function (status, text) {
            if (status == '602' && text.indexOf('6002') > -1) {
                var APP_ID = 'wxef07d81749400b98';
                if (parent.isParent && parent.isParent == 1) {
                    parent.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + APP_ID + '&redirect_uri=' + encodeURIComponent('https://app.nuanxinli.com/warm/wx/code_exchange.html?url=' + window.location.href) + '&response_type=code&scope=snsapi_userinfo&state=park#wechat_redirect';
                } else {
                    window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + APP_ID + '&redirect_uri=' + encodeURIComponent('https://app.nuanxinli.com/warm/wx/code_exchange.html?url=' + window.location.href) + '&response_type=code&scope=snsapi_userinfo&state=park#wechat_redirect';
                }
            }
        });
    }
}

function finishedToPay(data,customerIsOrg) {
    console.log('wx不需要数据：'+data);
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
        loadJS("/warm/js/payment/payment_wx_mp.js", function () {
            paymentObj = wxPayment;
            verifyIsPay(orderInfo,serviceObj, paymentObj);
        })
    }
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
    wx.ready(function() {
        if(window.shareObj){
            var shareConfig = {
                title: window.shareObj.title, // 分享标题
                desc: window.shareObj.content, // 分享描述
                link: window.shareObj.shareUrl,
                imgUrl: window.shareObj.iconUrl, // 分享图标
                type: 'link', // 分享类型,music、video或link，不填默认为link
                success: function() {
                    console.log('用户分享');

                },
                cancel: function() {
                    console.log('onMenuShareAppMessage cancel');
                }
            };
        }
        wx.onMenuShareAppMessage(shareConfig);
        wx.onMenuShareTimeline(shareConfig);
        wx.onMenuShareQQ(shareConfig);
        wx.onMenuShareWeibo(shareConfig);
        wx.onMenuShareQZone(shareConfig);
    });
}

/**
 * 设置标题栏文字和右上角菜单
 * @param param
 * 微信不支持这种设置
 */
function setTopBar(param) {

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
    return 'weixin';
}
function setHeader() {
    return {
        source:'xcx',
        device:getSystemInfo().device + ' '+navigator.userAgent.match(/MicroMessenger\/([\d\\.]+)/i)[1],
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