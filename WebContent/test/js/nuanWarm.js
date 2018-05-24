/**
 * Created by Administrator on 2017/8/16.
 */
localStorage.clear();
var test = {
    'testLists': '',//测评题列表
    'testHistory': '',//测评历史
    'employee': {},//企业员工
    'personOrder': '',//订单详情
    'orderLists': ''
};
var pagename = '';
///warm/test/nuanWarm.html?id=1&thirdPartyName=gzq
var company = getParam('thirdPartyName');
localStorage.setItem('company', company);
loadEnv(function () {
    var history=['/warm/home/home.html?id='+getParam('id')+'&thirdPartyName='+getParam('thirdPartyName')+'&isEntry=0'];
    console.log(history);
    localStorage.setItem('history',JSON.stringify(history));
    $('#warm-content').load('/warm/test/test_list.html');
}, function () {});