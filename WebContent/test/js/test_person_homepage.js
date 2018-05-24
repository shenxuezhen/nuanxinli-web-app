/**
 * Created by Administrator on 2017/8/10.
 */
var url=window.location.href;
loadEnv(function () {
    pushToHistory(url);
},function () {
    popToHistory(url)
},null);
initShareObj({
    title: '暖心理', // 分享标题
    content: '暖心理，温暖世界温暖你', // 分享描述
    shareUrl: window.location.origin + '/warm/home/home.html?isEntry=1',
    iconUrl: window.location.origin + '/warm/images/logo120.png',
});
var testPerson={};
new Vue({
    el:'.media-list',
    data:testPerson,
    created:function (){
        $('.loading').hide();
        $('.test-person-header').show();
        $('.media-list').show();
        var userInfo=JSON.parse(localStorage.getItem('userInfo'));
        if(userInfo.photo && userInfo.photo!=''){
            $('#userPhoto').attr('src',userInfo.photo);
        }
        if(userInfo.name && userInfo.name!=''){
            $('#userName')[0].innerHTML=userInfo.name;
        }
    },
    computed:{},
    methods:{
        getTestHistory:function(){//测评历史
            window.location.href='test_person_history.html';
        },
        getAbout:function(){//关于我们
            window.location.href='test_about.html';
        },
        getOrder:function () {//我的订单
            window.location.href='test_person_order.html';
        },
        getFeedback:function () {//意见反馈
            feedBack();
        },
        getCoupon:function () {
            window.location.href='/warm/coupon/coupon_list.html'
        }
    }
});