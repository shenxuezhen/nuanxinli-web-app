var s365Payment = {
    config: function () {

    },
    showPay: function (serviceObj) {
        this._s365Unifiedorder(serviceObj);
    },
    startTest: function () {
        window.location.href = '/warm/test/start_normal.html?testDId=' + serviceObj.testDId;
    },
    showResult: function () {
        window.location.href = '/warm/test/result_agent.html?testIId=' + serviceObj.testIId;
    },
    /**
     * s365下单
     */
    _s365Unifiedorder: function (serviceObj) {
        var userInfo=JSON.parse(localStorage.getItem('userInfo'));
        ajax('/public/payment/vendor/unifiedorder',{
            'buyer_id':userInfo.thirdPartyId,
            "bizno": orderNo ? orderNo : localStorage.getItem('orderNo'),
            "subject": serviceObj.serviceType==='test'?'测评':'课程',
            "total_amount": '' + serviceObj.payAmount,
            "return_url": window.location.origin+'/warm/test/alipay_wap_after.html',
            'thirdPartyName': userInfo.company.vendor.thirdPartyName,
            'vendor': {
                'thirdPartyName': userInfo.company.vendor.thirdPartyName,
                'id': userInfo.company.vendor.id
            }
        },function (resp) {
            //alert(JSON.stringify(resp));
            window.location.href=resp.url;
        },null,function () {
            $('.payBtn').css("pointer-events", '');
            $(".mask").hide();
        });
    }
};