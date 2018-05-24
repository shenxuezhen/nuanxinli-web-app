var url = window.location.href;
loadEnv(function () {
    $('.course-buy-one-button-right').css('background', buttonColor());
    $('.course-buy-more-button').css('background', buttonColor());
    pushToHistory(url);
    var courseData = {
        course: {},
        serviceRecommend: {
            relationList: []
        }
    };
    /**
     * recomedId: 当前页面资源的id。
     * recomedType: 资源类型。例如: test, course, audio, sift.
     */
    var recommendRequestData = {
        "recomedId": getParam('courseId'),
        "recomedType": "course"
    };
    ajax('/public/course/' + getParam('courseId'), null, function (resp) {
        courseData.course = resp;
        document.title = courseData.course.name;
        initShareObj({
            title: courseData.course.name,
            content: courseData.course.description,
            shareUrl: window.location.origin+'/warm/course/course_detail.html?courseId'+getParam('courseId'),
            iconUrl: window.location.origin + courseData.course.cover
        });
    });
    new Vue({
        el: "#wrapper",
        data: courseData,
        beforeCreate: function () {
            ajax('/public/recommend/recomed', recommendRequestData, function (resp) {
                if (resp !== null) {
                    courseData.serviceRecommend = resp;
                }
            });
        },
        created: function () {
            $(".loading").hide();
            $("#wrapper").show();
        },
        computed: {},
        methods: {
            courseBuyClick: function () {
                localStorage.setItem('course', JSON.stringify(courseData.course));
                var url = "/warm/order/course_order.html";
                loadHtmlCloseOld(url);
            },
            coursePlayClick: function (course, item) {
                if (course.isFee === 0 || item.canListen === 1 || course.hasBuyCode === 1) {
                    var url='/warm/course/course_play.html?courseId=' + course.id + '&itemId=' + item.id;
                    loadHtml(url);
                }
            },
            viewAll: function () {
                $(".course-description-c").removeClass("ellipsis");
                $(".view-all").hide();
            },
            price: function (str) {
                return transitionPrice(str);
            }
        }
    });
}, function () {
    var history = JSON.parse(localStorage.getItem('history'));
    if (history.length > 2 && history.slice(history.length - 2)[0].indexOf('course_detail') > -1) {
        history.splice(history.length - 2, 1);
        localStorage.setItem('history', JSON.stringify(history));
    }
    popToHistory(url)
}, null);
