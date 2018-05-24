/**
 * Created by Administrator on 2017/10/25.
 */
var seqKey = localStorage.getItem('seqKey');
var source;
if (seqKey == 's365' && !browser.weixin){
    source='s365';
}
else {
    source='wxmp';
}
var postId = getParam('postId');
var replyId = getParam('replyId');
var isSend = true;//是否可以发送评论
var dic={
    'partCode':'',
    'postId':postId,
    'replyToUser':'',
    'content':'',
    'isAnonymous':1,
    'source':source
};
var bbsRevertData={
    isFristList:true,
    revertList:[],
    formData:{},
    placeholder:'回复帖子',//输入框
    parameter:dic,
    isCss:true,
    priseData:{
        yesPrise:false,//赞是否选中
        noPrise:false
    },
};
var url=window.location.href;
loadEnv(function () {
    $('.contact_div').css('background',buttonColor());
    $('.input_div').css('background',buttonColor());
    pushToHistory(url);
    ajax('/public/bbs-post/' + postId, null, function (resp) {
        bbsRevertData.formData = resp;
        bbsRevertData.parameter.partCode = resp.partCode;
        bbsRevertData.parameter.replyToUser = resp.createUser;
        if (resp.hasPraise =='YES'){
            bbsRevertData.priseData.yesPrise=true;
            bbsRevertData.priseData.noPrise=false;
        }
        else {
            bbsRevertData.priseData.yesPrise=false;
            bbsRevertData.priseData.noPrise=true;
        }
        document.title = bbsRevertData.formData.partName;
        console.log(bbsRevertData.formData.partName+'========'+JSON.stringify(resp));
        initShareObj({
            title:bbsRevertData.formData.title,
            content:bbsRevertData.formData.content,
            shareUrl:window.location.href,
            iconUrl:window.location.origin+'/warm/images/logo120.png'
        });
    });
    new Vue(vueData);
},function () {
    popToHistory(url)
},null);

var vueData={
    el: "#bbs_revert",
    data: bbsRevertData,
    created: function () {
        $(".loading").hide();
        $("#bbs_revert").show();
        if (replyId){
            //二级回复列表
            loadSecondData('/public/bbs-post/'+postId+'/bbs-reply/'+replyId+'/list/second?pageNum=1&pageSize=10',1);
        } else {
            //正常的一级列表
            loadFristData('/public/bbs-post/'+postId+'/bbs-reply/list/anon?pageNum=1&pageSize=10',1);
        }
    },
    computed: {
    },
    methods: {
        nimingHeader:function (value) {
            if(value===1){
                return bbsNiming();
            }
        },
        deleteTime:function (time) {
            return subTime(time);
        },
        //查看更多
        moreClick:function (postId,replyId) {
            window.location.href = '../bbs/bbs_revert.html?postId='+postId+"&replyId=" + replyId;
        },
        //点击 帖子
        formClick:function () {
            console.log('点击帖子');
            if (bbsRevertData.isFristList){
                this.placeholder = '回复帖子';
                this.parameter.replyToUser = this.formData.createUser;
                this.parameter.replyId = '';
            }
        },
        //点击 回复回复
        secondReplyClick:function (createAlias,replyId,createUser) {
            console.log('回复回复');
            this.placeholder = '回复'+ createAlias;
            this.parameter.replyId = replyId;
            this.parameter.replyToUser = createUser;
        },
        //帖子的点赞
        formGoodClick:function () {
            sendWarm();
        },
        //用户回复的点赞
        replyGoodClick:function (item,id,tIndex) {
            thankYou(item,id,tIndex);
        },
        //联系咨询师
        contactTeacherClick:function (createUser) {
            window.location.href = '../consultant/consultantHome.html?username='+createUser;
        },
        //发送按钮
        sendClick:function (event) {
            stopBubbling(event);
            console.log(JSON.stringify(dic));
            var str = $.trim(this.parameter.content);
            if (!str || str==''){
                Toast('请输入内容~',2000);
                return;
            }
            else if(this.parameter.content.length > 1500){
                Toast('内容限制1500字~',2000);
                return;
            }
            if (isSend){
                isSend = false;
                ajax('/public/bbs-post/' + postId +'/reply', dic, function (resp) {
                    bbsRevertData.parameter.content='';
                    isSend = true;
                    Toast('成功!',2000);
                    if (replyId){
                        //二级回复列表
                        loadSecondData('/public/bbs-post/'+postId+'/bbs-reply/'+replyId+'/list/second?pageNum=1&pageSize=10',1);
                    } else {
                        //正常的一级列表
                        loadFristData('/public/bbs-post/'+postId+'/bbs-reply/list/anon?pageNum=1&pageSize=10',1);
                    }
                });
            }
        },
    }
};
//输入框的change事件
function contentChange(value) {
    bbsRevertData.parameter.content = value;
}
function getFocus() {
    var h = document.documentElement.scrollHeight || document.body.scrollHeight;
    window.scrollTo(h,h);
}
//跳转的二级页面 存在replyId
var lastResp;
var respList;

function processingData(resp) {
    for (var i=0; i<resp.length; i++){
        if (resp[i].hasThanks == 'YES'){
            resp[i].yesThank = true;
            resp[i].noThank = false;
        }
        else {
            resp[i].hasThanks='NO';
            resp[i].yesThank = false;
            resp[i].noThank = true;
        }
    }
    return resp;
}
function initData(){
    if(lastResp && respList){
        var list = new Array(1);
        lastResp.secondReplyList=respList;
        list[0]=lastResp;
        bbsRevertData.revertList=list;
        console.log(bbsRevertData);
    }
}
function sendWarm() {
    console.log('click button'+ bbsRevertData.formData.hasPraise);
    var prasize;
    //已经选中了 要取消
    if (bbsRevertData.priseData.yesPrise){
        bbsRevertData.priseData.yesPrise=false;
        bbsRevertData.priseData.noPrise=true;
        prasize = {'warming':0};
        bbsRevertData.formData.praiseCount = bbsRevertData.formData.praiseCount-1;
    }
    //选中
    else {
        bbsRevertData.priseData.yesPrise=true;
        bbsRevertData.priseData.noPrise=false;
        prasize = {'warming':1};
        bbsRevertData.formData.praiseCount = bbsRevertData.formData.praiseCount+1;
    }
    ajax('/public/bbs-post/'+postId+'/warming', prasize, function (resp) {
        // alert('送暖'+resp);
        console.log('送暖'+resp);
    });
    stopBubbling(event);
}
function thankYou(item,id,tIndex) {
    //hasThanks
    var prasize;
    //已经灰了 要选中
    if (item.noThank){
        prasize = {'thanks':1};
        bbsRevertData.revertList[tIndex].yesThank=true;
        bbsRevertData.revertList[tIndex].noThank=false;
        bbsRevertData.revertList[tIndex].thanksCount = bbsRevertData.revertList[tIndex].thanksCount+1;
        bbsRevertData.revertList[tIndex].hasThanks='YES';
    }
    //要取消
    else {
        prasize = {'thanks':0};
        bbsRevertData.revertList[tIndex].yesThank=false;
        bbsRevertData.revertList[tIndex].noThank=true;
        bbsRevertData.revertList[tIndex].thanksCount = bbsRevertData.revertList[tIndex].thanksCount-1;
        bbsRevertData.revertList[tIndex].hasThanks='NO';
    }
    ajax('/public/bbs-post/'+postId+'/bbs-reply/+'+id+'/thanks', prasize, function (resp) {
        // alert('感谢'+resp);
        console.log('感谢'+resp);
    });
    stopBubbling(event);
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
function loadFristData(url,pageNum,callback){
    bbsRevertData.isFristList=true;
    ajax(url, null, function (resp) {
        if(pageNum==1){
            var list = processingData(resp.list);
            bbsRevertData.revertList = list;
        }else if(pageNum>1){
            if(resp.list != ''){
                var list = processingData(resp.list);
                $.each(list,function (index,value) {
                    if(typeof bbsRevertData != 'undefined'){
                        bbsRevertData.revertList.push(value);
                    }
                });
            }else {
                callback();
            }
        }
    });
}
function loadSecondData(url,pageNum,callback){
    bbsRevertData.isFristList=false;
    var list = new Array(1);
    ajax('/public/bbs-post/bbs-reply/' + replyId, null, function (resp) {
            if (resp.hasThanks == 'YES'){
                resp.yesThank = true;
                resp.noThank = false;
            }
            else {
                resp.hasThanks='NO';
                resp.yesThank = false;
                resp.noThank = true;
            }
        lastResp=resp;
        console.log('----------------'+JSON.stringify(resp));
        bbsRevertData.placeholder = '回复' + resp.createAlias;
        bbsRevertData.parameter.replyId = resp.id;
        bbsRevertData.parameter.replyToUser = resp.createUser;
        initData();
    });
    ajax(url, null, function (resp) {
        if(pageNum==1){
            respList=resp.list;
            initData();
        }else if(pageNum>1){
            if(resp.list != ''){
                    if(typeof bbsRevertData != 'undefined'){
                        respList = respList.concat(resp.list);
                        initData();
                    }
            }else {
                callback();
            }
        }
    });
}

function pullDown(){
    if (replyId){
        //二级回复列表
        loadSecondData('/public/bbs-post/'+postId+'/bbs-reply/'+replyId+'/list/second?pageNum=1&pageSize=10',1);
    } else {
        //正常的一级列表
        loadFristData('/public/bbs-post/'+postId+'/bbs-reply/list/anon?pageNum=1&pageSize=10',1);
    }
}
function pullUp(pageUpNum,callback){
    if (replyId){
        //二级回复列表
        loadSecondData('/public/bbs-post/'+postId+'/bbs-reply/'+replyId+'/list/second?pageNum='+pageUpNum+'&pageSize=10',pageUpNum,callback);
    } else {
        //正常的一级列表
        loadFristData('/public/bbs-post/'+postId+'/bbs-reply/list/anon?pageNum='+pageUpNum+'&pageSize=10',pageUpNum,callback);
    }
}

shirleyScroll(pullDown,pullUp,$('#bbs_revert'));