/**
 * Created by yx on 2017/11/8.
 */
var url=window.location.href;
loadEnv(function () {
    pushToHistory(url);
    initShareObj({
        title: '暖心理', // 分享标题
        content: '暖心理，温暖世界温暖你', // 分享描述
        shareUrl: window.location.origin + '/warm/home/home.html?isEntry=1',
        iconUrl: window.location.origin + '/warm/images/logo120.png',
    });
    var permissionsList=[
        {'permissions':'职场情感','image':'../images/bbs/show_everyone.png','title':'展示给所有人','content':'可以让大家以及咨询师帮助你解决心事哦~'},
        {'permissions':'职场关系','image':'../images/bbs/show_myself.png','title':'仅展示给自己','content':'自己的心事自己解决就好啦~不让别人看'},
    ];
    var releaseData={
        typeStr:'话题选择',
        typeList:[],
        permissionsStr:'展示给所有人',
        permissionsList:permissionsList,
        objIsPrivate:0,//仅自己可见
        objCode:'',
        objTitle:'',
        objContent:''
    };
    if (getParam('name')){
        releaseData.typeStr = getParam('name');
        releaseData.objCode = getParam('code');
        $(".typeTitle").css({color: "#393932"});
    }
    var vm = new Vue({
        el: "#release_talk",
        data: releaseData,
        created: function () {
            getBbsTypeList();
        },
        computed: {},
        methods: {
            changeTypeClick:function () {
                console.log("改变类型弹窗。。");
                $('.warm-shade').show();
                $('.warm-type-tip').show();
                $('.bottom').hide();
            },
            changeModeClick:function () {
                console.log("改变发布方式。。");
                $('.warm-shade').show();
                $('.warm-permissions-tip').show();
                $('.bottom').hide();
            },
            chooseTypeClick:function (index) {
                console.log("改变类型");
                $("div").remove(".typeShade");
                $("img").remove(".typeCheck");
                var box=$('.imageDiv')[index];
                var div=document.createElement('div');
                div.className='typeShade';
                var img=document.createElement('img');
                img.className='typeCheck';
                img.src = '../images/bbs/check_label.png';
                box.appendChild(div);
                box.appendChild(img);
                releaseData.typeStr = releaseData.typeList[index].name;
                releaseData.objCode = releaseData.typeList[index].code;
                $(".typeTitle").css({color: "#393932"});
            },
            choosePermissionsClick:function (index) {
                choosePermissions(index);
            }
        }
    });
},function () {
    popToHistory(url)
},null);
//改变权限
function choosePermissions(index) {
    $("img").remove(".permissionCheck");
    var box=$('.showAll')[index];
    var img=document.createElement('img');
    img.className='permissionCheck';
    img.src = '../images/bbs/select.png';
    box.appendChild(img);
    releaseData.permissionsStr = releaseData.permissionsList[index].title;
    releaseData.objIsPrivate=index;
}
//隐藏相关的控件
function hiddenShade() {
    $('.warm-shade').hide();
    $('.warm-type-tip').hide();
    $('.warm-permissions-tip').hide();
    $('.bottom').show();
}
//标题的change事件 data赋值
function titleChange(value) {
    releaseData.objTitle = value;
}
//内容的change事件 data赋值
function contentChange() {
    // $("#textarea").val();
    releaseData.objContent = $("#textarea").val();
}
function getBbsTypeList() {
    var categoryList={
        categoryList:['knowledge']
    };
    ajax('/public/bbs-part/list/except?pageNum=1&pageSize=20', categoryList, function (resp) {
        releaseData.typeList = resp;
    },'获取类型列表：');
}
//发布按钮
function submitClick(event) {
    stopBubbling(event);
    var objTitle = $.trim(releaseData.objTitle);
    var objContent = $.trim(releaseData.objContent);
    var userInfo=JSON.parse(localStorage.getItem('userInfo'));
    if (releaseData.typeStr=='话题选择'){
        Toast('请选择话题~',2000);
        return;
    }
    if (!objTitle || objTitle==''){
        Toast('请输入标题~',2000);
        return;
    }
    else if(releaseData.objTitle.length>50){
        Toast('标题限制50字~',2000);
        return;
    }
    if (!objContent || objContent==''){
        Toast('请输入内容~',2000);
        return;
    }
    else if(releaseData.objContent.length>2000){
        Toast('内容限制2000字~',2000);
        return;
    }
    var seqKey = localStorage.getItem('seqKey');
    var source;
    if (seqKey == 's365' && !browser.weixin){
        source='s365';
    }
    else {
        source='wxmp';
    }
    var obj = {
        'isAnonymous':1,
        'isPrivate':releaseData.objIsPrivate,
        'partCode':releaseData.objCode,
        'createUser':userInfo.name,
        'title':releaseData.objTitle,
        'content':releaseData.objContent,
        'source':source
    };
    ajax('/public/bbs-post/post', obj, function (resp) {
        // window.location.href='/warm/bbs/bbs_list.html';
        window.history.go(-1);
        Toast('发布成功~',2000);
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
choosePermissions(0);
