/**
 * Created by Administrator on 2017/8/7.
 */
try {
    var mySwiper;
    var homeData;
    loadEnv(function () {
        $('.mark-title').css('background', fbColor());
        $('.mark-line').css('background', fbColor());
        $('.more-btn').css('color', fbColor());
        $('.heartImage')[0].src = heartImg();
        $('.heartImage')[1].src = videoImg();
        mySwiper = new Swiper('.swiper-container', {
            direction: 'horizontal',
            loop: true,

            // 如果需要分页器
            pagination: '.swiper-pagination',

            //睡眠的时长
            autoplay: 5000,
            speed: 300,

            //懒加载图
            lazyLoading: true,
            mousewheels: true,

            paginationClickable: true,
            disableOnInteraction: false,
            longSwipesRatio: 0.3,
            touchRatio: 1,
            initialSlide: 1,
            observer: true,//修改swiper自己或子元素时，自动初始化swiper
            observeParents: true,//修改swiper的父元素时，自动初始化swiper
        });
        homeData = {
            'testLists': [],//测评题列表
            'magazineLists': [],//杂志列表
            'bbsTypeList': []//圈圈类型的列表
        };
        //localStorage.getItem('sid') || getCookie('sid') || browser.weixin
        var thirdPartyName = getParam('thirdPartyName');
        if (thirdPartyName) {
            localStorage.setItem('company', thirdPartyName);
        }
        var history = ['/warm/home/home.html?id=' + getParam('id') + '&thirdPartyName=' + getParam('thirdPartyName') + '&isEntry=0&uuid=' + getParam('uuid')];
        localStorage.setItem('history', JSON.stringify(history));
        initShareObj({
            title: '暖心理', // 分享标题
            content: '暖心理，温暖世界温暖你', // 分享描述
            shareUrl: window.location.href,
            iconUrl: window.location.origin + '/warm/images/logo120.png',
        });
        getSomeListAndBindVue();
    }, null, null);
}
catch (e){
    console.dir(e);
}

function getSomeListAndBindVue() {
    //获取banner列表、类型列表、杂志列表
    getBannerList().then(
        function () { return getBbsTypeList() }
    ).then(
        function () { return getMagazineList() }
    ).then(
        function () { return bindVue() }
    );
    //获取测评列表
    // getTestList();
}


//绑定Vue
function bindVue() {
    return new Promise(function (resolve, reject) {
        var vm = new Vue({
            el: "#homeView",
            data: homeData,
            created: function () {
                $(".loading").hide();
                $("#homeView").show();
                $(".psychTest").show();
                $(".per-head-portrait").show();
                var userInfo = JSON.parse(localStorage.getItem('userInfo'));
                if (userInfo != null && userInfo.photo) {
                    $('#userPhoto').attr('src', userInfo.photo);
                }
                $(".title").text('心理测评');

            },
            computed: {},
            methods: {
                //杂志列表
                magazineClick: function () {
                    window.location.href = '../../warm/magazine/magazine_list.html';
                },
                //测评列表
                testClick: function () {
                    window.location.href = '../../warm/test/test_list.html?isPhoto=0';
                },
                //课程
                coursesClick: function () {
                    window.location.href = '../../warm/course/course_list.html';
                },
                //减压音频
                audioClick: function () {
                    window.location.href = '../../warm/audio/audio_list.html';
                },
                //心事
                bbsClick: function () {
                    window.location.href = '../../warm/bbs/bbs_list.html';
                },
                //进入个人主页
                getPersonHomepage: function () {
                    window.location.href = '../../warm/mine/my_home.html';
                    /*window.location.href='/warm/home/test.html';*/
                },
                //导航进入不同类型的页面
                pushTypeViewClick: function (type, name) {
                    console.log(type);
                    window.location.href = '../../warm/category/category.html?categoryCode=' + type + '&codeName=' + name;
                },

            }
        });
    });
}
//获取类型列表
function getBbsTypeList() {
    return new Promise(function (resolve, reject) {
        var categoryList = {
            categoryList: ['knowledge']
        };
        ajax('/public/bbs-part/list/except?pageNum=1&pageSize=20', categoryList, function (resp) {
            homeData.bbsTypeList = resp;
            resolve();
        }, '获取类型列表：');
    });
}
//获取banner列表
function getBannerList() {
    //banner列表
    return new Promise(function (resolve, reject) {
        ajax('/public/cast-banner/list', null, function (resp) {
            for (var i = 0; i < resp.length; i++) {
                mySwiper.appendSlide('<div class="swiper-slide" onclick="bannerDetail(\''
                    + resp[i].articleSource + '\')" ><img  src="'
                    + resp[i].img +
                    '" class="swiper-lazy" style="width:100%; height:100%;"><div class="swiper-lazy-preloader"></div></div>')
            }
            resolve();
        }, '获取Banner列表：');
    });
}
//获取magazine列表
function getMagazineList() {
    return new Promise(function (resolve, reject) {
        //杂志列表
        ajax('/public/sift/my-list/for-website?pageNum=1&pageSize=3', null, function (resp) {
            homeData.magazineLists = resp.list;
            resolve();
        }, '获取杂志列表：');
    });
}
//banner详情
function bannerDetail(url) {
    if (url && url.indexOf('http') == 0) {
        window.location.href = '/warm/magazine/third_detail.html?url=' + encodeURIComponent(url);
    } else if (url) {
        window.location.href = url;
    } else {
        console.log('该banner没有出处');
    }
}