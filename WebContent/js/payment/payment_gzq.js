var gzqPayment = {
    config: function () {

    },
    showPay: function (serviceObj) {
        if(browser.ios){
            window.location.href='iOS_pay.html';
        }else {
            this._aliUnifiedorder(serviceObj);
        }
    },
    startTest: function () {
        window.location.href = '/warm/test/start_normal.html?testDId=' + serviceObj.testDId;
    },
    showResult: function () {
        window.location.href = '/warm/test/result_agent.html?testIId=' + serviceObj.testIId;
    },
    /**
     * 支付宝统一下单（工作圈Android）
     */
    _aliUnifiedorder: function (serviceObj) {
        ajax('/public/payment/order-sign/alipay',{
            "orderCode": orderNo ? orderNo : localStorage.getItem('orderNo'),
            "serviceType": serviceObj.serviceType,
            "payAmount": '' + serviceObj.payAmount,
            "baseUrl": window.location.origin
        },function (resp) {
            cordova.exec(
                function (resp) {
                    console.log(resp);
                    $(document).bind('backbutton');
                    if (JSON.parse(JSON.parse(resp).data).resultStatus == '9000') {
                        successPayment();
                    } else if (JSON.parse(JSON.parse(resp).data).resultStatus == '8000') {
                        alert('请稍等');
                        successPayment();
                    } else {
                        failPayment('支付失败');
                    }
                },
                function (resp) {
                    failPayment('支付失败'+resp);
                },
                'GZQPay',
                'aliPay',
                [{
                    "payVersion": 'pay',
                    "payInfo": resp.orderSignInfo
                }]
            )
        },null,function () {
            $('.payBtn').css("pointer-events", '');
            $(".mask").hide();
        });
    }

};
