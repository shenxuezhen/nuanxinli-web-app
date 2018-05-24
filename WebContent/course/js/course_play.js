var itemId = getParam('itemId');

var audioData = {
    objData: {},
    item: {},
    isListen: false,
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
var player = {};
loadEnv(function () {
    pushToHistory(window.location.href);
    var vm = new Vue({
        el: ".slider_body",
        data: audioData,
        created: function () {
            var url = '/public/course/' + getParam('courseId');
            ajax(url, null, function (resp) {
                audioData.objData = resp;
                for (var index = 0; index < audioData.objData.items.length; index++) {
                    if (audioData.objData.items[index].id == itemId) {
                        audioData.item = audioData.objData.items[index];
                        if (audioData.objData.isFee === 1 && audioData.objData.hasBuyCode === 0 && audioData.item.canListen === 0) {
                            window.location.href = "/warm/course/course_detail.html?courseId=" + audioData.objData.id;
                        }
                        document.getElementById("hls-source").src = audioData.item.url;
                        player = videojs('hls-audio');
                    }
                }
                document.title = '课程播放';
                initShareObj({
                    title: audioData.objData.items[0].name,
                    content: audioData.objData.items[0].description,
                    shareUrl: window.location.href,
                    iconUrl: window.location.origin + audioData.objData.items[0].cover
                });

            });

            ajax('/public/recommend/recomed', recommendRequestData, function (resp) {
                if (resp !== null) {
                    audioData.serviceRecommend = resp;
                }
            });
            $(".loading").hide();
            $("#slider_body").show();
        },
        computed: {},
        methods: {}
    });
}, function () {
    popToHistory(window.location.href);
}, null);


function shareaudio() {
    Toast('分享功能暂未开放！', 2000);
}

function download() {
    Toast('下载功能暂未开放！', 2000);
}

