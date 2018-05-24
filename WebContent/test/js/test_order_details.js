/**
 * Created by Administrator on 2017/9/5.
 */
var orderInfo = {
    title: localStorage.getItem('title'),
    type: localStorage.getItem('type'),
    companyCount: '',
    orderPrice: localStorage.getItem('orderPrice'),
    orderTotalPrice: localStorage.getItem('orderPrice'),
    couponPrice: '',
    validDay: localStorage.getItem('validDays'),
    photo: localStorage.getItem('testImg'),
    browser: browser.weixin,
    thirdPartyName: localStorage.getItem('company') == 'gzq',
};
var sid = localStorage.getItem('sid');
var payState = localStorage.getItem('payState');
initShareObj({
    title: '暖心理', // 分享标题
    content: '暖心理，温暖世界温暖你', // 分享描述
    shareUrl: window.location.origin + '/warm/home/home.html?isEntry=1',
    iconUrl: window.location.origin + '/warm/images/logo120.png',
});
if (payState && payState == 'paid') {
    $('.order-btn').hide();
    loadEnv(function () {
        $('.price-color').css('color', buttonColor());
        $('.order-btn div, .ios-pay-btn').css('background', buttonColor());
        new Vue(vueData);
    }, null, null);
} else {
    var url = window.location.href;
    if (localStorage.getItem('testTime') == 'testAfter') {
        loadEnv(function () {
            $('.price-color').css('color', buttonColor());
            $('.order-btn div, .ios-pay-btn').css('background', buttonColor());
            new Vue(vueData);
        }, function () {
            if (window.confirm('10分钟内可在我的“测评结果”继续购买，确定返回列表吗？')) {
                //确定
                popToHistory(url);
                return true;
            } else {
                //取消
                return false;
            }
        }, null)
    } else {
        loadEnv(function () {
            $('.price-color').css('color', buttonColor());
            $('.order-btn div, .ios-pay-btn').css('background', buttonColor());
            new Vue(vueData);
        }, function () {
            if (window.confirm('确定返回吗？')) {
                //确定
                popToHistory(url);
                return true;
            } else {
                //取消
                return false;
            }
        }, null)
    }
}
var vueData = {
    el: "#test-order",
    data: orderInfo,
    beforeCreate: function () {
        var customerIsOrg = getParam('customerIsOrg');
        var coupon;
        if (customerIsOrg == 'company') {//企业支付，页面默认是个人支付
            ajax('/public/company/member_count', null, function (resp) {
                orderInfo.companyCount = resp;
                localStorage.setItem('customerIsOrg', 'company');
                orderInfo.orderTotalPrice = new Decimal(orderInfo.orderPrice).multiply(resp).valueOf();
                localStorage.setItem('orderTotalPrice', '' + orderInfo.orderTotalPrice);
            });
        } else {
            localStorage.setItem('orderTotalPrice', '' + orderInfo.orderPrice);
        }

        if (getParam('coupon')) {
            orderInfo.couponPrice = getParam('coupon');
        } else {
            if (orderInfo.orderTotalPrice > 0) {
                ajax('/public/coupon/my-list?pageNum=1&pageSize=10&state=1-valid&serviceType=test&sourceId=' + localStorage.getItem('testDId'), null, function (resp) {
                    if (resp == '') return;
                    orderInfo.couponPrice = resp[0].amount;
                    coupon = resp[0];
                    localStorage.setItem('coupon', JSON.stringify(coupon));
                })
            }
        }

    },
    created: function () {
        $(".loading").css("display", "none");
        $("#test-order").css("display", "block");
        var customerIsOrg = getParam('customerIsOrg') || localStorage.getItem('customerIsOrg');
        if (customerIsOrg) {
            if (customerIsOrg == 'null') {
                localStorage.setItem('customerIsOrg', 'person');
            } else {
                localStorage.setItem('customerIsOrg', customerIsOrg);
            }
        }
        if (customerIsOrg == 'company') {//企业支付，页面默认是个人支付
            $('.order-person').hide();
            $('.buyCompany').hide();
            $('.order-company').show();
            $('.offline').show();
        }
        if (localStorage.getItem('company') == 's365') {
            $('.order-pay').hide();
        }
    },
    computed: {
    },
    methods: {
        buyCompany: function () {//跳转企业支付
            $('.order-person').hide();
            $('.order-company').show();
            $('.buyCompany').hide();
            $('.offline').show();
            ajax('/public/company/member_count', null, function (resp) {
                localStorage.setItem('customerIsOrg', 'company');
                this.vm.$data.companyCount = resp;
                localStorage.setItem('customerIsOrg', 'company');
                this.vm.$data.orderTotalPrice = new Decimal(this.vm.$data.orderPrice).multiply(resp).valueOf();
                localStorage.setItem('orderTotalPrice', '' + this.vm.$data.orderTotalPrice);
            });
        },
        openOffline: function () {
            window.scrollTo(0, 0);
            $('.warm-shade').show();
            $('.order-offline').show();
            $('.warm-shade').css('width', document.documentElement.clientWidth).css('height', document.body.clientHeight).css('position', 'absolute').css('left', '0').css('top', '0');
        },
        closeOffline: function () {
            $('.warm-shade').hide();
            $('.order-offline').hide();
        },
        pay: function () {
            debugger;
            zhuge.track('点击支付', { '测评名称': localStorage.getItem('title') });
            if (localStorage.getItem('testTime') == 'testBefore') localStorage.removeItem('testIId');
            localStorage.setItem('serviceType', 'test');
            placeOrder();

        },
        /** isActualPrice:是否实际支付价格。取值，no:不是，yes:是。 */
        price: function (isActualPrice, couponStr, str) {
            if (couponStr != '') {
                if (couponStr >= str) {
                    str = 0;
                } else {
                    str = new Decimal(str).minus(couponStr);
                }
            }
            if (isActualPrice == 'yes') {
                localStorage.setItem('actualPrice', str);
            }
            return transitionPrice(str);
        },
        changeCoupon: function () {
            window.location.href = '/warm/coupon/coupon_list.html?exchangeInput=hide&state=1-valid&serviceType=test&sourceId=' + localStorage.getItem('testDId');
        }
    }
};
