/**
 * Created by yx on 2017/11/6.
 */
var audioData = {
    audioList: []
};
loadEnv(function () {
    var vm = new Vue({
        el: "#thelist",
        data: audioData,
        created: function () {
            $(".loading").hide();
            $("#wrapper").show();

            var url = '/public/interest-audio/list?pageNum=1&pageSize=10';
            getAudioList(url, 1,function () {
                initShareObj({
                    title: '暖心理', // 分享标题
                    content: '暖心理，温暖世界温暖你', // 分享描述
                    shareUrl: window.location.origin + '/warm/home/home.html?isEntry=1',
                    iconUrl: window.location.origin + '/warm/images/logo120.png',
                });
            });
        },
        computed: {},
        methods: {}
    });
    $('.audio-list-spImg').attr('src',audioButtonImg());
    pushToHistory(window.location.href);
}, function () {
    popToHistory(window.location.href)
}, null);

function getAudioList(url, pageNum, callback) {
    ajax(url, null, function (resp) {
        if (pageNum == 1) {
            audioData.audioList = resp.list;
        } else if (pageNum > 1) {
            if (resp.list != '') {
                $.each(resp.list, function (index, value) {
                    if (typeof audioData != 'undefined') {
                        audioData.audioList.push(value);
                    }
                });
            } else {
                callback();
            }
        }
    });
}
function pullDown() {
    var url = '/public/interest-audio/list?pageNum=1&pageSize=10';
    getAudioList(url, 1);
}
function pullUp(pageUpNum, callback) {
    var url = '/public/interest-audio/list?pageNum=' + pageUpNum + '&pageSize=10';
    getAudioList(url, pageUpNum, callback);
}
shirleyScroll(pullDown, pullUp, $('#thelist'));