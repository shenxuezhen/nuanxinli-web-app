/**
 * Created by yx on 2017/12/12.
 */
var collectData={
    collectList:[]
};
var lastId,obj;
var url=window.location.href;
loadEnv(function () {
    pushToHistory(url);
    var vm = new Vue({
        el: "#wrapper",
        data: collectData,
        created: function () {
            $(".loading").hide();
            $("#wrapper").show();
            getCollectList(collectUrl,1);
        },
        computed: {},
        methods: {}
    });
},function () {
    popToHistory(url)
},null,{
    title: '暖心理', // 分享标题
    content: '暖心理，温暖世界温暖你', // 分享描述
    shareUrl: window.location.origin + '/warm/home/home.html?isEntry=1',
    iconUrl: window.location.origin + '/warm/images/logo120.png',
});
var collectUrl = '/public/sift-collection/my-list';
function getCollectList(url,pageUpNum,callback) {
    var obj={'count':5,'afterId':0};
    if (lastId){
        obj.afterId = lastId;
    }
    else {
        obj.afterId = 0;
    }
    ajax(url, obj, function (resp) {
        if(pageUpNum==1){
            if(resp !=''){
                collectData.collectList = resp;
                lastId = resp[resp.length - 1].id;
            }
            else {
                collectData.collectList = [];
            }
        }else {
            if(resp !=''){
                $.each(resp,function (index, value) {
                    collectData.collectList.push(value);
                });
                lastId = resp[resp.length - 1].id;
            }else {
                callback();
            }
        }
        /*if(!lastId && resp != ''){
            collectData.collectList = resp;
            lastId = resp[resp.length - 1].id;
        }else{
            if(resp !=''){
                $.each(resp,function (index, value) {
                    collectData.collectList.push(value);
                });
                lastId = resp[resp.length - 1].id;
            }else {
                callback();
            }
        }*/
    });
}
//解决点击冲突的问题
function stopBubbling(e) {
    e = e?e:window.event;
    if (e.stopPropagation) {
        e.stopPropagation();      //阻止事件 冒泡传播
    } else {
        e.cancelBubble = true;   //ie兼容
    }
}
function pullDown(){
    getCollectList(collectUrl,null);
}

function pullUp(pageUpNum,callback){
    getCollectList(collectUrl,pageUpNum,callback);
}

shirleyScroll(pullDown,pullUp,$('#thelist'));