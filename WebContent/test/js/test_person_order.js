/**
 * Created by Administrator on 2017/9/11 0011.
 */
loadEnv(function () {
    pushToHistory(window.location.href);
},function () {
    popToHistory(window.location.href)
},null);
initShareObj({
    title: '暖心理', // 分享标题
    content: '暖心理，温暖世界温暖你', // 分享描述
    shareUrl: window.location.origin + '/warm/home/home.html?isEntry=1',
    iconUrl: window.location.origin + '/warm/images/logo120.png',
});
var personOrder={list:[]};
var url='/public/test-service/order/list?pageNum=1&pageSize=20';
new Vue({
    el:'#thelist',
    data:personOrder,
    created:function(){
        $(".loading").css("display", "none");
        $("#wrapper").css("display", "block");
        getTestPersonOrder(url,1)
    },
    methods:{
        getPersonPrice:function (order) {
            return new Decimal(order.price).divide((order.customerIsOrg==1?order.customerCount:1));
        },
        getOrders:function (order){
            localStorage.setItem('orderId',order.id);
            localStorage.setItem('orderNo',order.code);
            localStorage.setItem('testIId',order.testIId);
            localStorage.setItem('testDId',order.testDId);
            localStorage.setItem('title',order.title);
            localStorage.setItem('type',order.type);
            localStorage.setItem('validDays',order.validDays);
            localStorage.setItem('orderPrice',!order.customerCount?order.price:new Decimal(order.price).divide(order.customerCount));
            localStorage.setItem('companyCount',order.customerCount);
            localStorage.setItem('testImg',order.img);
            localStorage.setItem('createTime',order.createTime);
            if(order.state == 'paid'){
                localStorage.setItem('payState',order.state);
                if(order.customerCount && order.customerCount>1){
                    window.location.href='/warm/order/test_order_details.html?customerIsOrg=company';
                }else {
                    window.location.href='/warm/order/test_order_details.html?customerIsOrg=person';
                }
            }else {
                localStorage.setItem('payState','');
                localStorage.setItem('orderTotalPrice',''+order.price);
                if(order.customerCount && order.customerCount>1){
                    window.location.href='/warm/order/test_order_details.html?customerIsOrg=company';
                }else {
                    window.location.href='/warm/order/test_order_details.html?customerIsOrg=person';
                }
            }
        }
    }
});

function getTestPersonOrder(url,pageNum){
    loadEnv(function () {
        ajax(url,null,function (resp) {
            if(pageNum==1){
                personOrder.list=treatmentOrder(resp);
            }else if(pageNum>1){
                $.each(treatmentOrder(resp),function (index, value) {
                    personOrder.list.push(value);
                })
            }
        });
        pushToHistory(window.location.href);
    },function () {
        popToHistory(window.location.href);
    },null,0);
}
function pullDown(){
    var url='/public/test-service/order/list?pageNum=1&pageSize=20';
    getTestPersonHistory(url,1);
}
function pullUp(pageUpNum){
    var url='/public/test-service/order/list?pageNum='+pageUpNum+'&pageSize=20';
    getTestPersonHistory(url,pageUpNum);
}
shirleyScroll(pullDown,pullUp,$('#thelist'));