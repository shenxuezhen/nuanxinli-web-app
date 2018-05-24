/**
 * Created by Administrator on 2017/8/17.
 */
var test = {
    testHistory: []
};
var pageUrl=window.location.href;
loadEnv(function () {
    pushToHistory(pageUrl);
    var vm = new Vue({
        el:"#thelist",
        data:test,
        created:function(){
            var url='/public/test-i/my-list?pageNum=1&pageSize=10';
            getTestPersonHistory(url);
            $(".loading").css("display", "none");
            $("#thelist").css("display", "block");
        },
        computed:{},
        methods:{
            deleteTime:function (time) {
                return subTime(time);
            },
            getTestResult:function (myTest) {
                console.dir(myTest);
                localStorage.setItem('testIId', myTest.id);
                localStorage.setItem('testDId', myTest.testId);//做题前购买则不删除，做完题再删除；做完题再购买购买完成直接删除就好
                localStorage.setItem('title', myTest.testD.title);//做题前购买和做题后购买都删除
                localStorage.setItem('type', myTest.testD.type);//做题前购买和做题后购买都删除
                var orderPrice;
                if(myTest.testD.isSalePrice==0){
                    orderPrice=myTest.testD.price;
                }else if(myTest.testD.isSalePrice==1){
                    orderPrice=myTest.testD.testDPrice.salePrice;
                }else {
                    orderPrice=myTest.testD.price;
                }
                localStorage.setItem('orderPrice', orderPrice);//做题前购买和做题后购买都删除
                localStorage.setItem('validDays', myTest.testD.validDays);//做题前购买和做题后购买都删除
                localStorage.setItem('testImg', myTest.testD.img);//做题前购买和做题后购买都删除
                localStorage.setItem('createTime', myTest.createTime);
                if(myTest.isValid==0){
                    localStorage.setItem('testTime','testAfter');
                    window.location.href='/warm/order/test_order_details.html?customerIsOrg=person';
                }else {
                    window.location.href='result_agent.html?testIId='+myTest.id+'&testDId='+myTest.testId;
                }
            },
            //删除测评记录
            deleteTest:function (value) {
                $().showAlert("确定要删除吗？",function(){
                    ajax('/public/test-i/'+value+'/delete','',function (resp) {
                        ajax('/public/test-i/my-list?pageNum=1&pageSize=5',null,function(resp){
                            test.testHistory=resp.list;
                            Toast('删除成功！',2000);
                        });
                    })
                },true);
            },
            //重新测试
            reTest:function (value) {
                window.location.href = '/warm/test/start_normal.html?testDId=' + value;
            },
            //再次购买
            rePay:function (myTest) {
                ajax('/public/test-d/service/'+myTest.testId,null,function (resp) {
                    localStorage.setItem('testIId', myTest.id);
                    localStorage.setItem('testDId', myTest.testId);//做题前购买则不删除，做完题再删除；做完题再购买购买完成直接删除就好
                    localStorage.setItem('title', resp.title);//做题前购买和做题后购买都删除
                    localStorage.setItem('type', resp.type);//做题前购买和做题后购买都删除
                    localStorage.setItem('orderPrice', resp.isSalePrice ? resp.testDPrice.salePrice : resp.price);//做题前购买和做题后购买都删除
                    localStorage.setItem('validDays', resp.isSalePrice ? resp.testDPrice.validDays : resp.validDays);//做题前购买和做题后购买都删除
                    localStorage.setItem('testImg', resp.img);
                    //localStorage.setItem('createTime', myTest.createTime);
                    window.location.href='/warm/order/test_order_details.html?customerIsOrg=person';
                });
            }
        }
    });
},function () {
    popToHistory(pageUrl);
},null);
initShareObj({
    title: '暖心理', // 分享标题
    content: '暖心理，温暖世界温暖你', // 分享描述
    shareUrl: window.location.origin + '/warm/home/home.html?isEntry=1',
    iconUrl: window.location.origin + '/warm/images/logo120.png',
});
function getTestPersonHistory(url, pageNum, callback) {
    ajax(url, null, function (resp) {
        if (pageNum == 1) {
            test.testHistory = resp.list;
        } else {
            if (resp.list != '') {
                $.each(resp.list, function (index, value) {
                    test.testHistory.push(value);
                });
            } else {
                callback();
            }
        }
    });
}
function pullDown() {
    var url = '/public/test-i/my-list?pageNum=1&pageSize=10';
    getTestPersonHistory(url, 1);
}
function pullUp(pageUpNum, callback) {
    var url = '/public/test-i/my-list?pageNum=' + pageUpNum + '&pageSize=10';
    getTestPersonHistory(url, pageUpNum, callback);
}
shirleyScroll(pullDown, pullUp, $('#thelist'));