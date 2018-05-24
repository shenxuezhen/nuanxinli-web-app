var courseData = {
    courseList: []
};
var pageUrl = window.location.href;
loadEnv(function () {
    $('.course-list-play-img').attr('src',audioButtonImg());
    pushToHistory(pageUrl);

    var my = getParam('mine');
    if (my) {
        document.title = '我的课程';
        $(".course-list-head").remove();
        $(".hr-div").remove();
        $("#thelist").addClass("wrapper-my-list");
    } else {
        document.title = '课程';
        $("#thelist").addClass("wrapper-list");
    }

    var vm = new Vue({
        el: "#thelist",
        data: courseData,
        created: function () {
            $(".loading").hide();
            $("#thelist").show();
            var url = '/public/course/list?pageNum=1&pageSize=10&mine=' + my;
            getCourseList(url, 1);
        },
        computed: {},
        methods: {
            courseDetailClick: function (id, hasBuyCode) {
                var url = "/warm/course/course_detail.html?courseId=" + id;
                if (hasBuyCode === 1) {
                    url = "/warm/course/course_own.html?courseId=" + id;
                }
                window.location.href = url;
            }
        }
    });
}, function () {
    popToHistory(pageUrl)
}, null, {
    title: '暖心理', // 分享标题
    content: '暖心理，温暖世界温暖你', // 分享描述
    shareUrl: window.location.origin + '/warm/home/home.html?isEntry=1',
    iconUrl: window.location.origin + '/warm/images/logo120.png',
});

function getCourseList(url, pageNum, callback) {
    ajax(url, null, function (resp) {
        if (pageNum == 1) {
            courseData.courseList = resp;
        } else if (pageNum > 1) {
            if (resp != '') {
                $.each(resp, function (index, value) {
                    courseData.courseList.push(value);
                });
            } else {
                callback();
            }
        }
    });
}

function pullDown() {
    var url = '/public/course/list?pageNum=1&pageSize=10&mine=' + my;
    getCourseList(url, 1);
}

function pullUp(pageUpNum, callback) {
    var url = '/public/course/list?pageNum=' + pageUpNum + '&pageSize=10&mine=' + my;
    getCourseList(url, pageUpNum, callback);
}

shirleyScroll(pullDown, pullUp, $('#thelist'));