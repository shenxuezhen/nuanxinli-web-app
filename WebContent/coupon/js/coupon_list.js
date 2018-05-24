var couponData = {
    couponList: []
};
initShareObj({
    title: '暖心理', // 分享标题
    content: '暖心理，温暖世界温暖你', // 分享描述
    shareUrl: window.location.origin + '/warm/home/home.html?isEntry=1',
    iconUrl: window.location.origin + '/warm/images/logo120.png',
});
var exchangeInput = getParam('exchangeInput');
var state = getParam('state');
var serviceType = getParam('serviceType');
var sourceId = getParam('sourceId');
var couponListUrl = '/public/coupon/my-list?pageNum=1&pageSize=10';
var couponListUrlExtraParam = '';
if (sourceId) {
    couponListUrlExtraParam = '&state=' + state + '&serviceType=' + serviceType + '&sourceId=' + sourceId;
    couponListUrl = couponListUrl + couponListUrlExtraParam;
}

if (exchangeInput == 'hide') {
    $('.redeem_code').hide();
}

loadEnv(function () {
    pushToHistory(window.location.href);

    getCouponList(couponListUrl, 1);
}, function () {
    popToHistory(window.location.href);
});
new Vue({
    el: '#coupon_page',
    data: couponData,
    created: function () {
    },
    computed: {

    },
    methods: {
        getCouponCode: function () {
            exchangeCoupon($('.coupon_code')[0].value, localStorage.getItem('seqKey'));
        }
    }
});
function getCouponList(url, pageNum, callback) {
    ajax(url, null, function (resp) {
        resp.forEach(function (test) {
            if (test.remValidDays) {
                if (test.remValidDays / 180 === 1) {
                    test.remValidDays = '半年';
                } else if (test.remValidDays % 360 === 0) {
                    test.remValidDays = test.remValidDays / 360 + '年';
                } else {
                    test.remValidDays = test.remValidDays + '天';
                }
                return false;
            }
        });
        if (pageNum == 1) {
            couponData.couponList = resp;
        } else if (pageNum > 1) {
            if (resp != '') {
                $.each(resp, function (index, value) {
                    couponData.couponList.push(value);
                });
            } else {
                callback();
            }
        }
    });
}
function exchangeCoupon(code, channel) {
    ajax('/public/coupon/exchange', {
        'exchangeCode': code,
        'channel': channel
    }, function (resp) {
        couponData.couponList.unshift(resp);
        alert('兑换成功');
    }, null, function (status, text) {
        $('#error').text(text);
        setTimeout(function () {
            $('#error').text('');
            $('.coupon_code')[0].value = '';
        }, 2000)
    })
}
function pullDown() {
    var url = '/public/coupon/my-list?pageNum=1&pageSize=10';
    if(couponListUrlExtraParam){
        url = url + couponListUrlExtraParam;
    }
    getCouponList(url, 1);
}

function pullUp(pageUpNum, callback) {
    var url = '/public/coupon/my-list?pageNum=' + pageUpNum + '&pageSize=10';
    if(couponListUrlExtraParam){
        url = url + couponListUrlExtraParam;
    }
    getCouponList(url, pageUpNum, callback);
}
shirleyScroll(pullDown, pullUp);