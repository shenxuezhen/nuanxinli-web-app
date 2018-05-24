var sid=localStorage.getItem('sid');
var zeroPayment = {
    config: function () {

    },
    showPay: function (serviceObj) {
        this._getZero(serviceObj);
    },
    startTest: function () {
        window.location.href = '/warm/test/start_normal.html?testDId=' + serviceObj.testDId;
    },
    showResult: function (serviceObj) {
        window.location.href = '/warm/test/result_agent.html?testIId=' + serviceObj.testIId;
    },
    _getZero: function (serviceObj) {
        var that=this;
        var coupon=JSON.parse(localStorage.getItem('coupon'));
        var zeroData={};
        if(!coupon){
            zeroData={
                "orderId": orderId,
                "channel": 'wecpay',
                "totalAmount": 0,
                "couponAmount": 0,
                "paidAmount": 0,
                "couponCount": 0,
                "coupons": []
            }
        }else {
            var totalAmount=localStorage.getItem('orderTotalPrice');
            var couponAmount=coupon.amount;
            var paidAmount;
            if(couponAmount>=totalAmount){
                paidAmount=0;
            }else {
                paidAmount=totalAmount-couponAmount;
            }
            zeroData={
                "orderId": orderId,
                "channel": 'wecpay',
                "totalAmount": totalAmount,
                "couponAmount": couponAmount,
                "paidAmount": paidAmount,
                "couponCount": 1,
                "coupons": [coupon]
            }
        }
        ajax('/public/payment/pay',zeroData,function (resp) {
            successPayment();
        },null,function () {
            $('.payBtn').css("pointer-events", '');
            $(".mask").hide();
        });
    }
};
