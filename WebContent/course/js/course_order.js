var course = JSON.parse(localStorage.getItem('course'));
var userInfo = JSON.parse(localStorage.getItem('userInfo'));
if(!userInfo){
    userInfo={};
}
var orderInfo = {
    isSeriesStr: course.isSeries === 0 ? '单节' : '系列',
    name: course.name,
    itemAmount: course.itemAmount,
    priceUnit: course.priceUnit,
    orderPrice: course.salePrice,
    orderTotalPrice: course.salePrice,
    companyCount: '',
    browser: browser.weixin,
    userInfo: userInfo
};
var url=window.location.href;
loadEnv(function () {
    $('.price-color').css('color',buttonColor());
    $('.order-button').css('background',buttonColor());
    initShareObj({
        title: '暖心理', // 分享标题
        content: '暖心理，温暖世界温暖你', // 分享描述
        shareUrl: window.location.origin + '/warm/home/home.html?isEntry=1',
        iconUrl: window.location.origin + '/warm/images/logo120.png',
    });
    new Vue({
        el: "#course-order",
        data: orderInfo,
        beforeCreate: function () {
        },
        created: function () {
            $(".loading").hide();
            $("#course-order").show();
        },
        computed: {
        },
        methods: {
            price:function (str) {
                return transitionPrice(str);
            },
            pay: function () {
                //zhuge.track('点击支付', { '课程名称': orderInfo.name });
                localStorage.setItem('orderTotalPrice', orderInfo.orderTotalPrice);
                localStorage.setItem('serviceType', 'course');
                placeOrder();
            }
        }
    });
},function () {
    popToHistory(url)
},null);