loadEnv(function () {
    url = '/public/test-d/list/seq/authc?seqKey=' + seqKey + '&pageNum=1&pageSize=10';
    getTestList(url, 1);
    pushToHistory(window.location.href);
}, function () {
    popToHistory(window.location.href)
}, null);
initShareObj({
    title: '暖心理', // 分享标题
    content: '暖心理，温暖世界温暖你', // 分享描述
    shareUrl: window.location.origin + '/warm/home/home.html?isEntry=1',
    iconUrl: window.location.origin + '/warm/images/logo120.png',
});
var test = {
    'testLists': '',//测评题列表
    'testHistory': '',//测评历史
    'employee': {},//企业员工
    'personOrder': '',//订单详情
    'orderLists': '',
    'isPhoto': 1,
    'pageNum': 1,
    'typeList': [],
    'partCode':'',
    'keyword':''
};
if (getParam('isPhoto') == 0) {
    test.isPhoto = 0;
}
var url, seqKey;
seqKey = localStorage.getItem('seqKey');
var vm = new Vue({
    el: "#test-list",
    data: test,
    created: function () {
        $(".loading").hide();
        $("#wrapper").show();
        $(".psychTest").show();
        $(".per-head-portrait").show();
        var userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo) {
            if (userInfo.photo && userInfo.photo != '') {
                $('#userPhoto').attr('src', userInfo.photo);
            }
        }
        $(".title").text('心理测评');
    },
    computed: {},
    methods: {
        openTestIntroduction: function () {
            $('.warm-shade').show();
            $('.warm-test-tip').show();
        },
        closeTestIntroduction: function () {
            $('.warm-shade').hide();
            $('.warm-test-tip').hide();
        },
        getPersonHomepage: function () {
            window.location.href = 'test_person_homepage.html';
        },
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
            test.partCode = test.typeList[index].code;
            hiddenShade();
            document.body.style.overflow = '';
            var url;
            if (test.partCode == '') {
                if (test.keyword == '') {
                    url = '/public/test-d/list/seq?seqKey=' + seqKey + '&pageNum=1&pageSize=10'
                } else {
                    url = '/public/test-d/list/seq?seqKey=' + seqKey + '&pageNum=1&pageSize=10&keyword=' + test.keyword
                }
            } else {
                if (test.keyword == '') {
                    url = '/public/test-d/list/seq?seqKey=' + seqKey + '&partCode=' + test.partCode + '&pageNum=1&pageSize=10';
                } else {
                    url = '/public/test-d/list/seq?seqKey=' + seqKey + '&partCode=' + test.partCode + '&pageNum=1&pageSize=10&keyword=' + test.keyword;
                }
            }
            getTestList(url, 1);
        }
    }
});

//检查是否是触屏设备
var isTouchDevice = "ontouchstart" in window || navigator.msMaxTouchPoints;

$(".search-test-input").val('搜索文章全称或关键字').css({ 'color': 'rgb(187, 187, 187)' });

function hiddenShade() {
    $('.warm-shade').hide();
    $('.warm-type-part-code').hide();
}

$(".search-test-input").focus(function () {
    if ($(".search-test-input").val() === '搜索文章全称或关键字' && $(".search-test-input").css('color') === 'rgb(187, 187, 187)') {
        $(".search-test-input").val('').css({ 'color': '#000000' });
    }
    $(".top").addClass("top-height-100");
    $("body").css({ 'overflow': 'hidden' });
    if (isTouchDevice) {
        //绑定触碰移动事件
        $("body").bind("touchmove", function (e) {
            e.preventDefault();  //阻止默认行为
        });
    }
});

$(".search-test-input").blur(function () {
    if ($(".search-test-input").val() === '' && $(".search-test-input").css('color') === 'rgb(0, 0, 0)') {
        $(".search-test-input").val('搜索文章全称或关键字').css({ 'color': 'rgb(187, 187, 187)' });
    }
});

$(".clear-img").click(function () {
    window.scroll(0, 0);
    document.body.style.overflow = 'hidden';
    $('.warm-type-part-code').show();
    $('.warm-shade').show();
    loadTopic(test);
});

$(".cancel-search").click(function () {
    document.body.style.overflow = '';
    $('.warm-shade').hide();
    $('.warm-type-part-code').hide();
    $(".top").removeClass("top-height-100");
    $("body").css({ 'overflow': 'scroll' });
    if (isTouchDevice) {
        $("body").unbind("touchmove");
    }

    if ($.trim($("input[name=keyword]").val()) !== '') {
        $("input[name=keyword]").val('');
        test.keyword = '';
        ajax('/public/test-d/list/seq?seqKey=' + seqKey + '&pageNum=1&pageSize=10', null, function (resp) {
            test.testLists = resp;
        });
    }
});

$('form').on('submit', function (e) {
    var keywordTrim = $.trim($("input[name=keyword]").val());
    if (keywordTrim === '' && test.keyword === '') {
        Toast('请输入关键字.', 2000);
        return false;
    }
    return getTestSearchList(keywordTrim);
});

function getTestSearchList(keyword) {
    $(".top").removeClass("top-height-100");
    $("body").css({ 'overflow': 'scroll' });
    if (isTouchDevice) {
        $("body").unbind("touchmove");
    }
    test.keyword = keyword;
    var testListUrlWithKeyword;
    if (test.partCode == '') {
        testListUrlWithKeyword = '/public/test-d/list/seq?seqKey=' + seqKey + '&pageNum=' + test.pageNum + '&pageSize=10&keyword=' + keyword;
    } else {
        testListUrlWithKeyword = '/public/test-d/list/seq?seqKey=' + seqKey + '&partCode=' + test.partCode + '&pageNum=' + test.pageNum + '&pageSize=10&keyword=' + keyword;
    }
    ajax(testListUrlWithKeyword, null, function (resp) {
        test.testLists = resp;
    });
    return false;
}

function getTestList(url, pageNum, callback) {
    ajax(url, null, function (resp) {
        resp.forEach(function (test) {
            if (test.remValidDays) {
                if (test.remValidDays / 180 === 1) {
                    test.remValidDays = '半年';
                } else if (test.remValidDays % 360 === 0) {
                    test.remValidDays = test.remValidDays / 360 + '年';
                } else {
                    test.remValidDays = test.remValidDays + '天';
                }
                return false;
            }
        });
        if (pageNum == 1) {
            test.testLists = resp;
        } else if (pageNum > 1) {
            if (resp != '') {
                $.each(resp, function (index, value) {
                    test.testLists.push(value);
                });
            } else {
                callback();
            }
        }
    });
}
function pullDown() {
    var url;
    url = '/public/test-d/list/seq?seqKey=' + seqKey + '&pageNum=1&pageSize=10';
    if (test.partCode == '') {
        if (test.keyword == '') {
            url = '/public/test-d/list/seq?seqKey=' + seqKey + '&pageNum=1&pageSize=10';
        } else {
            url = '/public/test-d/list/seq?seqKey=' + seqKey + '&pageNum=1&pageSize=10&keyword=' + test.keyword;
        }
    } else {
        if (test.keyword == '') {
            url = '/public/test-d/list/seq?seqKey=' + seqKey + '&partCode=' + test.partCode + '&pageNum=1&pageSize=10';
        } else {
            url = '/public/test-d/list/seq?seqKey=' + seqKey + '&partCode=' + test.partCode + '&pageNum=1&pageSize=10&keyword=' + test.keyword;
        }
    }
    getTestList(url, 1);
}
function pullUp(pageUpNum, callback) {
    var url;
    url = '/public/test-d/list/seq?seqKey=' + seqKey + '&pageNum=' + pageUpNum + '&pageSize=10';
    if (test.partCode == '') {
        if (test.keyword == '') {
            url = '/public/test-d/list/seq?seqKey=' + seqKey + '&pageNum=' + pageUpNum + '&pageSize=10';
        } else {
            url = '/public/test-d/list/seq?seqKey=' + seqKey + '&pageNum=' + pageUpNum + '&pageSize=10&keyword=' + test.keyword;
        }
    } else {
        if (test.keyword == '') {
            url = '/public/test-d/list/seq?seqKey=' + seqKey + '&partCode=' + test.partCode + '&pageNum=' + pageUpNum + '&pageSize=10';
        } else {
            url = '/public/test-d/list/seq?seqKey=' + seqKey + '&partCode=' + test.partCode + '&pageNum=' + pageUpNum + '&pageSize=10&keyword=' + test.keyword;
        }
    }
    getTestList(url, pageUpNum, callback);
}
shirleyScroll(pullDown, pullUp, $('#thelist'));

function loadTopic(test) {
    var typeList = [
        { 'name': '全部话题', 'code': '', 'image': '../images/bbs/huatifenlei_quanbuhuati.png' },
        { 'name': '', 'image': '../images/bbs/baise.png' },
        { 'name': '', 'image': '../images/bbs/baise.png' },
        { 'name': '', 'image': '../images/bbs/baise.png' },
    ];
    var categoryList = {
        categoryList: ['knowledge']
    };
    ajax('/public/bbs-part/list/except?pageNum=1&pageSize=20', categoryList, function (resp) {
        test.typeList = typeList.concat(resp);
    }, '获取类型列表：');
}