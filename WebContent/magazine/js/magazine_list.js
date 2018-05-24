/**
 * Created by Administrator on 2017/10/25.
 */
var magazineData = {
    magazineList: [],
    keyword: '',
    partCode: '',
    pageNum: 1,
    typeList: []
};
var url = window.location.href;
loadEnv(function () {
    pushToHistory(url);
    $('.magazine-list-admonition-icon>img').attr('src', magazineImg());
    initShareObj({
        title: '暖心理', // 分享标题
        content: '暖心理，温暖世界温暖你', // 分享描述
        shareUrl: window.location.origin + '/warm/home/home.html?isEntry=1',
        iconUrl: window.location.origin + '/warm/images/logo120.png',
    });
    var vm = new Vue({
        el: "#wrapper",
        data: magazineData,
        created: function () {
            $(".loading").hide();
            $("#wrapper").show();
            getMagazineList('/public/sift/my-list/for-website?pageNum=1&pageSize=10', 1);
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
                magazineData.partCode = magazineData.typeList[index].code;
                hiddenShade();
                document.body.style.overflow = '';
                var url;
                if (magazineData.partCode == '') {
                    if(magazineData.keyword==''){
                        url = '/public/sift/my-list/for-website?pageNum=1&pageSize=10'
                    }else {
                        url='/public/sift/my-list/for-website?pageNum=1&pageSize=10&keyword=' + magazineData.keyword
                    }
                } else {
                    if(magazineData.keyword==''){
                        url = '/public/sift/my-list/for-website?partCode=' + magazineData.partCode + '&pageNum=1&pageSize=10';
                    }else {
                        url = '/public/sift/my-list/for-website?partCode=' + magazineData.partCode + '&pageNum=1&pageSize=10&keyword=' + magazineData.keyword;
                    }
                }
                getMagazineList(url, 1);
            }
        }
    });
}, function () {
    popToHistory(url)
}, null);
//检查是否是触屏设备
var isTouchDevice = "ontouchstart" in window || navigator.msMaxTouchPoints;

$(".search-magazine-input").val('搜索文章全称或关键字').css({'color': 'rgb(187, 187, 187)'});

function getMagazineList(url, pageNum, callback) {
    ajax(url, null, function (resp) {
        if (pageNum == 1) {
            magazineData.magazineList = resp.list;
        } else if (pageNum > 1) {
            if (resp != '') {
                $.each(resp.list, function (index, value) {
                    magazineData.magazineList.push(value);
                })
            } else {
                callback();
            }
        }
    });
}

function hiddenShade() {
    $('.warm-shade').hide();
    $('.warm-type-tip').hide();
}

$(".search-magazine-input").focus(function () {
    if ($(".search-magazine-input").val() === '搜索文章全称或关键字' && $(".search-magazine-input").css('color') === 'rgb(187, 187, 187)') {
        $(".search-magazine-input").val('').css({'color': '#000000'});
    }
    $(".top").addClass("top-height-100");
    $("body").css({'overflow': 'hidden'});
    if (isTouchDevice) {
        //绑定触碰移动事件
        $("body").bind("touchmove", function (e) {
            e.preventDefault();  //阻止默认行为
        });
    }
});

$(".search-magazine-input").blur(function () {
    if ($(".search-magazine-input").val() === '' && $(".search-magazine-input").css('color') === 'rgb(0, 0, 0)') {
        $(".search-magazine-input").val('搜索文章全称或关键字').css({'color': 'rgb(187, 187, 187)'});
    }
});

$(".clear-img").click(function () {
    window.scroll(0, 0);
    document.body.style.overflow = 'hidden';
    $('.warm-type-tip').show();
    $('.warm-shade').show();
    loadTopic(magazineData);
});

$(".cancel-search").click(function () {
    document.body.style.overflow = '';
    $('.warm-shade').hide();
    $('.warm-type-tip').hide();
    $(".top").removeClass("top-height-100");
    $("body").css({'overflow': 'scroll'});
    if (isTouchDevice) {
        $("body").unbind("touchmove");
    }
    // && magazineData.magazineList.length == 0
    if ($.trim($("input[name=keyword]").val()) !== '') {
        $("input[name=keyword]").val('');
        magazineData.keyword='';
        ajax('/public/sift/my-list/for-website?pageNum=1&pageSize=10', null, function (resp) {
            magazineData.magazineList = resp.list;
        });
    }
});

$('form').on('submit', function (e) {
    var keyword = $.trim($("input[name=keyword]").val());
    if (keyword === '' && magazineData.keyword === '') {
        Toast('请输入关键字.', 2000);
        return false;
    }
    return getMagaSearList(keyword);
});

function getMagaSearList(keyword) {
    $(".top").removeClass("top-height-100");
    $("body").css({'overflow': 'scroll'});
    if (isTouchDevice) {
        $("body").unbind("touchmove");
    }
    magazineData.keyword = keyword;
    var siftListUrlWithKeyword;
    if(magazineData.partCode==''){
        siftListUrlWithKeyword = '/public/sift/my-list/for-website?pageNum=' + magazineData.pageNum + '&pageSize=10&keyword=' + magazineData.keyword;
    }else {
        siftListUrlWithKeyword = '/public/sift/my-list/for-website?partCode=' + magazineData.partCode + '&pageNum=' + magazineData.pageNum + '&pageSize=10&keyword=' + magazineData.keyword;
    }
    ajax(siftListUrlWithKeyword, null, function (resp) {
        magazineData.magazineList = resp.list;
    });
    return false;
}

function setPageNum(pageUpNum) {
    magazineData.pageNum = pageUpNum;
}

function pullDown() {
    var url;
    if(magazineData.partCode==''){
        if(magazineData.keyword==''){
            url='/public/sift/my-list/for-website?pageNum=1&pageSize=10';
        }else {
            url='/public/sift/my-list/for-website?pageNum=1&pageSize=10&keyword='+magazineData.keyword;
        }
    }else {
        if(magazineData.keyword==''){
            url='/public/sift/my-list/for-website?partCode='+magazineData.partCode+'&pageNum=1&pageSize=10';
        }else {
            url='/public/sift/my-list/for-website?partCode='+magazineData.partCode+'&pageNum=1&pageSize=10&keyword='+magazineData.keyword;
        }
    }
    getMagazineList(url, 1);
}

function pullUp(pageUpNum, callback) {
    var url;
    if(magazineData.partCode==''){
        if(magazineData.keyword==''){
            url='/public/sift/my-list/for-website?pageNum=' + pageUpNum + '&pageSize=10';
        }else {
            url='/public/sift/my-list/for-website?pageNum=' + pageUpNum + '&pageSize=10&keyword='+magazineData.keyword;
        }
    }else {
        if(magazineData.keyword==''){
            url='/public/sift/my-list/for-website?partCode='+magazineData.partCode+'&pageNum=' + pageUpNum + '&pageSize=10';
        }else {
            url='/public/sift/my-list/for-website?partCode='+magazineData.partCode+'&pageNum=' + pageUpNum + '&pageSize=10&keyword='+magazineData.keyword;
        }
    }
    getMagazineList(url, pageUpNum, setPageNum(pageUpNum));
}

shirleyScroll(pullDown, pullUp, $('#thelist'));

function loadTopic(magazineData) {
    var typeList = [
        {'name': '全部话题', 'code': '', 'image': '../images/bbs/huatifenlei_quanbuhuati.png'},
        {'name': '', 'image': '../images/bbs/baise.png'},
        {'name': '', 'image': '../images/bbs/baise.png'},
        {'name': '', 'image': '../images/bbs/baise.png'},
    ];
    var categoryList = {
        categoryList: ['knowledge']
    };
    ajax('/public/bbs-part/list/except?pageNum=1&pageSize=20', categoryList, function (resp) {
        magazineData.typeList = typeList.concat(resp);
    }, '获取类型列表：');
}