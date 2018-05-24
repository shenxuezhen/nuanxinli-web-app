/**
 * Created by yx on 2017/11/10.
 */
var bbsData={
    bbsList:[],
    type:'bbs-post',
};
var sourceForBbs = localStorage.getItem('seqKey');
var url=window.location.href;
loadEnv(function () {
    pushToHistory(url);
    initShareObj({
        title: '暖心理', // 分享标题
        content: '暖心理，温暖世界温暖你', // 分享描述
        shareUrl: window.location.origin + '/warm/home/home.html?isEntry=1',
        iconUrl: window.location.origin + '/warm/images/logo120.png',
    });

    var vm = new Vue({
        el: ".main",
        data: bbsData,
        created: function () {
            $(".loading").hide();
            $("#main").show();
            getBbsHistoryList('/public/' + bbsData.type + '/my-list?pageNum=1&pageSize=10&source=' + sourceForBbs, 1);
        },
        computed: {},
        methods: {
            changeType:function (type) {
                bbsData.type = type;
                pullDown();
            },
            bbsDetailClick:function (postId) {
                var  url = "../bbs/bbs_revert.html"+"?postId="+postId;
                window.location.href = url;
            },
            deleteSecondTime:function (time) {
                time = time.slice(0,time.length-3);
                return time;
            },
            deleteClick: function (id, event) {
                stopBubbling(event);
                $().showAlert("确定要删除吗？", function () {
                    var url;
                    if ( bbsData.type == 'bbs-post') {
                        url = "/public/bbs-post/"+id+"/delete";
                    }
                    else {
                        url = "/public/bbs-reply/"+id+"/delete";
                    }
                    var obj = { '': '' };
                    ajax(url, obj, function (resp) {
                        console.log(resp);
                        lastId = null;
                        Toast('删除成功！', 2000);
                        getBbsHistoryList('/public/' + bbsData.type + '/my-list?pageNum=1&pageSize=10&source=' + sourceForBbs, 1);
                    }, '获取类型列表：');
                }, true);
            },
        }
    });
},function () {
    popToHistory(url)
},null);

function getBbsHistoryList(url, pageNum, callback) {
    ajax(url, null, function (resp) {
        if(pageNum==1){
            bbsData.bbsList  = resp.list;
        }else if(pageNum>1){
            if(resp.list !=''){
                $.each(resp.list,function (index, value) {
                    bbsData.bbsList.push(value);
                })
            }else {
                callback();
            }
        }
    });
}

function postingClick() {
    window.location.href = '../bbs/release_talk.html';
}

function pullDown(){
    getBbsHistoryList('/public/' + bbsData.type + '/my-list?pageNum=1&pageSize=10&source=' + sourceForBbs, 1);
}

function pullUp(pageUpNum,callback){
    var url = '/public/' + bbsData.type + '/my-list?pageNum=' + pageUpNum + '&pageSize=10&source=' + sourceForBbs;
    getBbsHistoryList(url,pageUpNum,callback);
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
shirleyScroll(pullDown,pullUp,$('#thelist'));