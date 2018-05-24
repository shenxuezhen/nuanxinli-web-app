/**
 * Created by yx on 2017/11/27.
 */
loadEnv(function () {
    pushToHistory(window.location.href);
    var username = getParam('username');
    var isShade=false;
    var homeData={
        isMore:false,
        homeType:'who',
        objData:{
            user:{},
            consultant:{},
            descStr:'',
        },
        consultantBbsList:[],
    };
    var vm = new Vue({
        el: "#consultant_home",
        data: homeData,
        created: function () {
            ajax('/public/consultant/get-by-username/' + username, null, function (resp) {
                if (resp.consultant.labelList){
                    for (var i = 0;i<resp.consultant.labelList.length;i++){
                        resp.consultant.labelList[i].color = '#'+resp.consultant.labelList[i].color;
                    }
                }
                homeData.objData.user = resp.user;
                homeData.objData.consultant = resp.consultant;
                homeData.objData.descStr = homeData.objData.consultant.certificationLevel;
                initShareObj({
                    title:homeData.objData.user.alias+'咨询师',
                    content:'不是伦家吹牛，这个老师真的超赞的~~不信你看',
                    shareUrl:window.location.href,
                    iconUrl:window.location.origin+'/resource/consultant/AUTOGENd8rcrtd/photo.jpeg'
                });
            });
            $(".loading").hide();
            $("#consultant_home").show();
        },
        computed: {},
        methods: {
            callPhone:function () {
                isShade = true;
                window.scroll(0,0);
                document.body.style.overflow='hidden';
                $('.warm-shade').show();
                $('.warm-call-tip').show();
                setTimeout(function(){
                    isShade = false;
                },1000);
            },
            changeType:function (type) {
                if(type == 'who'){
                    this.homeType='who';
                }
                else {
                    this.homeType='bbs';
                    getBbsList();
                }
            },
            moreClick:function (e) {
                //如果是展开的-展示全部
                if (e){
                    $(".moreDiv").hide();
                    this.isMore = false;
                    this.objData.descStr = this.objData.consultant.certificationLevel;
                }
                //如果是合上的-展示部分
                else {
                    $(".moreDiv").show();
                    this.isMore = true;
                    if (this.objData.consultant.descr){
                        this.objData.descStr = this.objData.descStr +'<br>'+ this.objData.consultant.descr;
                    }
                }
            },
            bbsDetail:function (id) {
                var  url = "../bbs/bbs_revert.html"+"?postId="+id;
                window.location.href = url;
            },
            //显示咨询师更多标签
            typeMore:function () {
                isShade = true;
                $('.warm-shade').show();
                $('.warm-type-tip').show();
                setTimeout(function(){
                    isShade = false;
                },1000);
            },
            //联系客服
            callStaff:function () {
                window.location.href = 'tel://4006889848' ;
            }

        }
    });
},function () {
    popToHistory(window.location.href)
},null,0);
var creatTime;
var bbsListUrl;
var seqKey = localStorage.getItem('seqKey');
var source;
if (seqKey == 's365' && !browser.weixin){
    source='&source=s365';
}
else {
    source='';
}
function getBbsList() {
    if (!creatTime){
        bbsListUrl = '/public/bbs-post/user-list?username='+username+'&count=5'+source;
    }
    else {
        bbsListUrl = '/public/bbs-post/user-list?username='+username+'&createTime='+creatTime+'&count=5'+source;
    }
    ajax(bbsListUrl, null, function (resp) {
        homeData.consultantBbsList = resp;
        creatTime = resp[resp.length - 1].creatTime;
    });
    if (homeData.homeType=='bbs'){
        pagename='consultantBbsList';
        loadISroll();
    }
}
//隐藏相关的控件
function hiddenShade() {
    if(isShade){
        return;
    }
    document.body.style.overflow='';
    $('.warm-shade').hide();
    $('.warm-type-tip').hide();
    $('.warm-call-tip').hide();
}

