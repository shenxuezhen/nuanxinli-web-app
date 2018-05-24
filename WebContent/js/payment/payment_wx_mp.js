var wxPayment = {
    APP_ID: 'wxef07d81749400b98',
    _TIMESTAMP: (new Date()).valueOf(),
    config: function () {

    },
    showPay: function (serviceObj) {
        this._wxUnifiedorder(serviceObj);
    },
    startTest: function () {
        window.location.href = '/warm/test/start_normal.html?testDId=' + serviceObj.testDId;
    },
    showResult: function () {
        agent();
    },
    /**
     * 微信统一下单（微信公众号）
     * @param userIp 用户IP
     */
    _wxUnifiedorder: function (serviceObj) {
        var that = this;
        var appId = this.APP_ID;
        var wxBbody = '暖心理';
        if (serviceObj.serviceType === 'course') {
            wxBbody = '暖心理-课程';
        } else {
            wxBbody = '暖心理-测评';
        }
        ajax('/public/payment/wec/unifiedorder', {
            "appid": appId,
            "nonceStr": noncestr(true, 16, 32),
            "body": wxBbody,
            "outTradeNo": orderNo,
            "totalFee": new Decimal(serviceObj.payAmount).multiply(100).valueOf(),
            "spbillCreateIp": '127.0.0.1',
            "notifyUrl": window.location.host,
            "tradeType": 'JSAPI',
            "openid": serviceObj.openid
        }, function (resp) {
            that._checkWxUnifiedorderResultAndThen(resp, serviceObj);
        }, null, function () {
            failPayment("微信统一下单失败：" + XMLHttpRequest.responseText);
        });
    },
    /**
     * 目前主要处理如下这个问题：
     * 201 商户订单号重复 
     */
    _checkWxUnifiedorderResultAndThen: function (xmlStr, serviceObj) {
        var that = this;
        var xmlDoc = $.parseXML(xmlStr.result);
        var $xml = $(xmlDoc);
        var $return_code = $xml.find("return_code");
        var $return_msg = $xml.find("return_msg");
        var $result_code = $xml.find("result_code");
        var $err_code = $xml.find("err_code");
        var $err_code_des = $xml.find("err_code_des");
        if ($return_code.text() == 'SUCCESS') {
            if ($result_code.text() == 'SUCCESS') {
                that._getWebpaysign(xmlStr);
            } else if ($result_code.text() == 'FAIL' && $err_code.text() == 'INVALID_REQUEST' && $err_code_des.text() == '201 商户订单号重复') {
                ajax('/public/service-order/' + orderId + '/update-code', JSON.stringify({}), function (resp) {
                    orderNo = resp.code;
                    that._wxUnifiedorder(serviceObj);
                }, null, function (resp) {
                    throw '微信下单失败';
                });
            } else if ($result_code.text() == 'FAIL') {
                throw '微信下单失败';
            }
        } else if ($return_code.text() == 'FAIL') {
            var errorMsg = '微信下单出现问题！错误码：' + $return_msg.text()
            Toast(errorMsg, 2000);
            throw errorMsg;
        }
    },
    /**
     * 获得choosePay需要的签名
     * @param wxOrderInfo 微信统一下单返回的信息，xml格式
     */
    _getWebpaysign: function (wxOrderInfo) {
        var that = this;
        var results = wxOrderInfo.result;
        var xmldoc = loadXML(results);
        var package = 'prepay_id=' + xmldoc.getElementsByTagName("prepay_id")[0].textContent;
        var appId = that.APP_ID;
        var timestamp = that._TIMESTAMP;
        ajax('/public/payment/wec/webpaysign', {
            appid: appId,
            timestamp: timestamp,
            nonceStr: noncestr(true, 16, 32),
            packageValue: package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
            signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
        }, function (resp) {
            that._wxChoosePay(resp);
        }, null, function () {
            failPayment('获取签名失败：' + XMLHttpRequest.responseText);
        });
    },
    _wxChoosePay: function (webpaysignInfo) {
        /*//发送后台的请求获取相应数据
         var payConfig = {
         appId: webpaysignInfo.appid,
         timestamp: webpaysignInfo.timestamp,
         nonceStr: webpaysignInfo.nonceStr,
         package: webpaysignInfo.packageValue, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
         signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
         paySign: webpaysignInfo.sign, // 支付签名
         error: function (res) {
         failPayment('支付失败！' );
         },
         cancel: function (res) {
         failPayment('您已取消支付！' );
         },
         success: function (res) {
         successPayment();
         }
         };
         wx.ready(wx.chooseWXPay(payConfig));*/
        var payConfig = {
            appId: webpaysignInfo.appid,
            timeStamp: webpaysignInfo.timestamp,
            nonceStr: webpaysignInfo.nonceStr,
            package: webpaysignInfo.packageValue, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
            signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
            paySign: webpaysignInfo.sign // 支付签名
        };
        WeixinJSBridge.invoke(
            'getBrandWCPayRequest', payConfig,
            function (res) {
                if (res.err_msg == "get_brand_wcpay_request:ok") {
                    successPayment();
                }
            }
        );
    },

};