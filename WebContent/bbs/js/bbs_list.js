/**
 * Created by yx on 2017/11/6.
 */
var seqKey = localStorage.getItem('seqKey');
var bbsUrl = '/public/bbs-post/list/anon/except';
var typeList = [
    {'name': '全部话题', 'code': '', 'image': '../images/bbs/huatifenlei_quanbuhuati.png'},
    {'name': '', 'image': '../images/bbs/baise.png'},
    {'name': '', 'image': '../images/bbs/baise.png'},
    {'name': '', 'image': '../images/bbs/baise.png'},
];
var bbsData = {
    bbsList: [],
    typeList: typeList,
    objCode: '',
    typeStr: '话题选择'
};
loadEnv(function () {
    $('#userPhoto').attr('src', editHeartImg());
    var history = JSON.parse(localStorage.getItem('history'));
    if (history.slice(history.length - 1)[0].indexOf('release_talk') > -1) {
        history.pop();
        localStorage.setItem('history', JSON.stringify(history));
    }
    pushToHistory(window.location.href);
    initShareObj({
        title: '暖心理', // 分享标题
        content: '暖心理，温暖世界温暖你', // 分享描述
        shareUrl: window.location.origin + '/warm/home/home.html?isEntry=1',
        iconUrl: window.location.origin + '/warm/images/logo120.png',
    });
    var vm = new Vue({
        el: "#bbsMainList",
        data: bbsData,
        created: function () {
            $(".loading").hide();
            $("#bbsMainList").show();
            getBbsTypeList();
            if (bbsData.objCode == '') {
                url = bbsUrl + '?pageNum=1&pageSize=10'
            } else {
                url = bbsUrl + '?type=' + bbsData.objCode + '&pageNum=1&pageSize=10'
            }
            getBbsList(url, 1);
        },
        computed: {},
        methods: {
            chooseTypeClick: function (index) {
                if (index >= 1 && index <= 3) {
                    return;
                }
                $("div").remove(".typeShade");
                $("img").remove(".typeCheck");
                var box = $('.imageDiv')[index];
                var div = document.createElement('div');
                div.className = 'typeShade';
                var img = document.createElement('img');
                img.className = 'typeCheck';
                img.src = '../images/bbs/check_label.png';
                box.appendChild(div);
                box.appendChild(img);
                bbsData.objCode = bbsData.typeList[index].code;
                bbsData.typeStr = bbsData.typeList[index].name;
                hiddenShade();
                var url;
                if (bbsData.objCode == '') {
                    url = bbsUrl + '?pageNum=1&pageSize=10'
                } else {
                    url = bbsUrl + '?type=' + bbsData.objCode + '&pageNum=1&pageSize=10'
                }
                getBbsList(url, 1);
            },
            changeTypeClick: function () {
                typeSeeTypeClick();
            },
        }
    });
}, function () {
    popToHistory(window.location.href)
}, null);
function getBbsList(url, pageNum, callback) {
    var obj = {"source": '', "categoryList": ''};
    if (seqKey == 's365' && !browser.weixin) {
        obj.source = 's365';
    }
    if (bbsData.objCode == '') {
        obj.categoryList = ['knowledge'];
    }
    ajax(url, obj, function (resp) {
        if (pageNum == 1) {
            bbsData.bbsList = resp;
        } else if (pageNum > 1) {
            if (resp != '') {
                $.each(resp, function (index, value) {
                    bbsData.bbsList.push(value);
                })
            } else {
                callback();
            }
        }
    });
}
function getBbsTypeList() {
    var categoryList = {
        categoryList: ['knowledge']
    };
    ajax('/public/bbs-part/list/except?pageNum=1&pageSize=20', categoryList, function (resp) {
        bbsData.typeList = bbsData.typeList.concat(resp);
    }, '获取类型列表：');
}
function postingClick() {
    var url;
    if (bbsData.objCode == '') {
        url = '../bbs/release_talk.html';
    }
    else {
        url = '../bbs/release_talk.html?code=' + bbsData.objCode + '&name=' + bbsData.typeStr;
    }
    window.location.href = url;
}
function typeSeeTypeClick() {
    $('.warm-shade').show();
    $('.warm-type-tip').show();
    $('.per-head-portrait').hide();
    window.scroll(0, 0);
    document.body.style.overflow = 'hidden';
}
//隐藏相关的控件
function hiddenShade() {
    $('.warm-shade').hide();
    $('.warm-type-tip').hide();
    $('.per-head-portrait').show();
    document.body.style.overflow = '';
}
function pullDown() {
    if (bbsData.objCode == '') {
        url = bbsUrl + '?pageNum=1&pageSize=10'
    } else {
        url = bbsUrl + '?type=' + bbsData.objCode + '&pageNum=1&pageSize=10'
    }
    getBbsList(url, 1);
}
function pullUp(pageUpNum, callback) {
    if (bbsData.objCode == '') {
        url = bbsUrl + '?pageNum=' + pageUpNum + '&pageSize=10'
    } else {
        url = bbsUrl + '?type=' + bbsData.objCode + '&pageNum=' + pageUpNum + '&pageSize=10'
    }
    getBbsList(url, pageUpNum, callback);
}
shirleyScroll(pullDown, pullUp, $('#thelist'));