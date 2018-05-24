/**
 * 请求category.html这个页面需要带上参数。例如：
 * category.html?categoryCode=parenting
 * 此文件中的检查为弱检查。
 */
var categoryCode = getParam('categoryCode');
if (categoryCode == '') {
    alert("请求的资源不存在。");
    throw "请求的资源不存在。";
}

/**
 * health:情绪压力;
 * intimacy:婚恋情感;
 * sex:性心理;(注：暂时不在首页home.html上显示,所以从数组parameters中先移除.)
 * growing:自我成长;
 * relationship:人际关系;
 * parenting:亲子教育;
 * vocation:职场问题;
 * knowledge:知识讨论;
 * sleep:睡眠障碍.
 */
var parameters = ["intimacy", "knowledge", "growing", "relationship", "parenting", "vocation", "health", "sleep", "student", "sex"];

/**
 * 并没有在数据库里创建首页八个分类导航对应的二级列表。
 * 目前是两种种情况。
 */
var liListFour = [
    { "code": "bbs", "name": "心事" },
    { "code": "test", "name": "测评" },
    { "code": "sift", "name": "杂志" },
    { "code": "course", "name": "课程" }
];
var liListFive = [
    { "code": "bbs", "name": "心事" },
    { "code": "audio", "name": "减压" },
    { "code": "sift", "name": "杂志" },
    { "code": "test", "name": "测评" },
    { "code": "course", "name": "课程" }
];

document.title = getParam('codeName');

var menuArray = [];
if (categoryCode === 'vocation' ||
    categoryCode === 'intimacy' ||
    categoryCode === 'relationship' ||
    categoryCode === 'growing' ||
    categoryCode === 'parenting' ||
    categoryCode === 'student') {
    menuArray = liListFour;
} else if (categoryCode === 'health' ||
    categoryCode === 'sleep' ||
    categoryCode === 'sex' ||
    categoryCode === 'knowledge') {
    menuArray = liListFive;
}

/**
 * 圈圈类型。
 * 例如：{"intimacy":"婚恋情感","health","情绪压力"}
 */
var bbsTypeObj = {};

/**
 * 是否包含某种字符串。默认值：false。
 */
var containEle = false;
for (var i = 0; i < parameters.length; i++) {
    if (categoryCode === parameters[i]) {
        containEle = true;
    }
}
if (!containEle) {
    alert("请检测参数是否正确。");
    throw "请检测参数是否正确。";
}

/**
 * 分类列表接口。
 *
 * 值：'/public/category/list'
 */
var urlForCategoryList = '/public/category/list';

/**
 * 给查询分类列表的参数赋值。例如： {"content":"bbs","categoryCode":"health","source":"s365"}
 * source参数用于查询某一个来源的帖子，就是从那个地方发出来的。
 */
var postDataForCategoryList = {
    "content": "bbs",
    "categoryCode": categoryCode
};
var sourceForCategory = localStorage.getItem('seqKey');
if (sourceForCategory === 's365') {
    postDataForCategoryList = {
        "content": "bbs",
        "categoryCode": categoryCode,
        "source": sourceForCategory
    };
}

/**
 * 给查询banner列表的参数赋值。例如： {"content":"banner","categoryCode":"health"}
 */
var postDataForBannerList = {};

var categoryData = {
    type: '',
    banner: {},
    menuList: menuArray,
    bbsTypeList: [],
    itemList: {
        bbs: [],
        test: [],
        sift: [],
        course: [],
        audio: []
    }
};
initShareObj({
    title: '暖心理', // 分享标题
    content: '暖心理，温暖世界温暖你', // 分享描述
    shareUrl: window.location.href,
    iconUrl: window.location.origin + '/warm/images/logo120.png',
});
loadEnv(function () {
    $('#userPhoto').attr('src', editHeartImg());
    pushToHistory(window.location.href);

    getBbsTypeList();
    getBannerList();

    var vm = new Vue({
        el: "#cateList",
        data: categoryData,
        created: function () {

        },
        updated: function () {
            if ($('.course-list-play-img').length > 0) {
                $('.course-list-play-img').attr('src', audioButtonImg());
            }
        },
        computed: {},
        methods: {
            bannerDetail: function (banner) {
                if (banner.bannerType === 'pbanner') {
                    window.location.href = banner.articleSource;
                } else if (banner.bannerType === 'zbanner') {
                    window.location.href = '/warm/forecastBanner.html?id=' + banner.liveId;
                } else {
                    console.error('点击banner出现未知问题');
                    return;
                }
            }
        }
    });
}, function () {
    popToHistory(window.location.href)
}, null);

/**
 * 初始banner列表
 */

function getBannerList() {
    postDataForBannerList = {
        "content": "banner",
        "categoryCode": categoryCode
    };
    ajax(urlForCategoryList + '?pageNum=1&pageSize=10', postDataForBannerList, function (resp) {
        if (resp.length > 0) {
            categoryData.banner = resp[0];
            $(".banner-img").attr('src', categoryData.banner.img);
        }
    });
}

function getBbsTypeList() {
    var categoryList = {
        categoryList: ['knowledge']
    };
    ajax('/public/bbs-part/list/except?pageNum=1&pageSize=20', categoryList, function (resp) {
        if (resp == '') {
            console.log("圈圈类型列表接口请求没有合适的返回值。");
        }
        categoryData.bbsTypeList = resp;
        for (var i = 0; i < resp.length; i++) {
            bbsTypeObj[resp[i].code] = resp[i].name;
        }
    }, '获取类型列表：');
}

function postingClick() {
    var url;
    var partCode = categoryCode;
    if (partCode == '') {
        url = '../bbs/release_talk.html';
    }
    else {
        url = '../bbs/release_talk.html?code=' + partCode + '&name=' + bbsTypeObj[partCode];
    }
    window.location.href = url;
}

function appendData(dom, count, isReset, index, url, postData, isUp) {
    if (isReset) {
        categoryData.itemList[postData.content] = [];
    }
    ajax(url, postData, function (resp) {
        if (listPageNum[index] == 1) {
            categoryData.itemList[postData.content] = resp;
        } else if (listPageNum[index] > 1) {
            if (resp != '') {
                $.each(resp, function (index, value) {
                    categoryData.itemList[postData.content].push(value);
                });
            }
        }
        if (isUp) {
            var listDataLength = categoryData.itemList[postData.content].length;
            miniRefreshArr[index].endUpLoading(listDataLength < (listPageNum[index] * count) ? true : false);
        } else {
            miniRefreshArr[index].endDownLoading(true);
        }
    });

}


var listDomArr = [],
    listPageNum = [0, 0, 0, 0, 0],//根据导航菜单的数量增减。初始化和点击菜单时候会执行up，所以默认显示的第一项设置成0.
    requestDelayTime = 600,
    currIndex = 0,
    miniRefreshArr = [];

var initMiniRefreshs = function (index) {

    listDomArr[index] = document.querySelector('#listdata' + index);

    miniRefreshArr[index] = new MiniRefresh({
        container: '#minirefresh' + index,
        isScrollBar:false,
        down: {
            callback: function () {
                setTimeout(function () {
                    getBannerList();
                    // 每次下拉刷新后，上拉的状态会被自动重置
                    var url = urlForCategoryList + '?pageNum=1&pageSize=10';
                    listPageNum[index] = 1;
                    if (postDataForCategoryList.content == 'test') {
                        postDataForCategoryList.seqKey = localStorage.getItem('seqKey');
                    }
                    appendData(listDomArr[index], 10, true, index, url, postDataForCategoryList, false);
                }, requestDelayTime);
            }
        },
        up: {
            isAuto: true,
            offset: 400,
            loadFull: false,
            onScroll:function () {
                var scrollTop=miniRefreshArr[index].getPosition();
                console.log('scrollTop:'+scrollTop);
                $('.top').css('position','relative');
                if(bannerHeight-scrollTop < 0){
                    $('.top').css('top',0);
                    $('.pure-menu').css('top',0);
                    $('.minirefresh-wrap').css('top','1.4rem');
                }else{
                    $('.top').css('top',-scrollTop);
                    $('.pure-menu').css('top',bannerHeight-scrollTop);
                    $('.minirefresh-wrap').css('top',bannerHeight-scrollTop+muenHeight);
                }
                $('.content').css('top',scrollTop);

            },
            callback: function () {
                setTimeout(function () {
                    if (index === 0) {
                        $("ul[class='pure-menu-list'] li:eq(0) > a").addClass("pure-menu-link-white");
                        $("ul[class='pure-menu-list'] li:eq(0) > span").addClass("under-line-black");
                        $(".per-head-portrait").fadeIn("slow");
                    }
                    listPageNum[index] = listPageNum[index] + 1;
                    var url = urlForCategoryList + '?pageNum=' + listPageNum[index] + '&pageSize=10';
                    if (postDataForCategoryList.content == 'test') {
                        postDataForCategoryList.seqKey = localStorage.getItem('seqKey');
                    }
                    appendData(listDomArr[index], 10, false, index, url, postDataForCategoryList, true);
                }, requestDelayTime);
            }
        }
    });
};

var navControl = document.querySelector('.pure-menu-list'),
    CLASS_HIDDEN = 'minirefresh-hidden';

// 初始化

var bannerHeight=$('.banner')[0].scrollHeight;
var muenHeight=$('.pure-menu')[0].scrollHeight;
console.log('bannerHeight:'+bannerHeight);
console.log('muenHeight:'+muenHeight);
initMiniRefreshs(0);