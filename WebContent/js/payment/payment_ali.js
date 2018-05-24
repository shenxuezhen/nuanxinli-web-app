var aliPayment = {
    config: function () {

    },
    showPay: function (serviceObj) {
        this._getAliCharge(serviceObj);
    },
    startTest: function () {
        parent.window.location.href = '/warm/test/start_normal.html?testDId=' + serviceObj.testDId;
    },
    showResult: function () {
        parent.window.location.href = '/warm/test/result_agent.html?testIId=' + serviceObj.testIId;
    },
    /**
     * ping++ 下订单
     * 根据参数做判断是支付宝还是微信
     * 订11单号、价格已经存在
     * */
    _getAliCharge: function (serviceObj) {

        ajax('/public/payment/order-sign/alipay/web',{
            "orderCode": orderNo ,
            "serviceType": 'test',
            "payAmount": '' + serviceObj.payAmount,
            "baseUrl": window.location.origin,
            "returnUrl":window.location.origin+'/warm/test/alipay_wap_after.html'
        },function (resp) {
            var formData=resp.replace(/\\/img,'');
            console.log(formData);
            document.body.innerHTML=formData.slice(0,formData.indexOf('</form>')+7);
            console.log(formData.slice(0,formData.indexOf('</form>')+7));
            (new Function(formData.slice(formData.indexOf('<script>')+8,formData.indexOf('</script>'))))();
            //var scripts=document.createElement('script');
            //window.location.href='https://mapi.alipay.com/gateway.do?'+encodeURIComponent(resp.orderSignInfo.replace(/\\/img,'').replace(/\"/img,''));
        });
    }
};
