// 请求数据
var httpRequest;

var audioData = {
    objData: {},
    isListen: false,
    serviceRecommend: {
        relationList: []
    }
};
/**
 * recomedId: 当前页面资源的id。
 * recomedType: 资源类型。例如: test, course, audio, sift.
 */
loadEnv(function () {
    $('#play_img').attr('src',audioButtonImg());
    var recommendRequestData = {
        "recomedId": getParam('id'),
        "recomedType": "audio"
    };
    var vm = new Vue({
        el: ".slider_body",
        data: audioData,
        created: function () {
            ajax('/public/interest-audio/' + getParam('id'), null, function (resp) {
                audioData.objData = resp;
                initShareObj({
                    title:resp.title,
                    content:resp.descr,
                    shareUrl:window.location.href,
                    iconUrl:window.location.origin+resp.image
                });
                document.title = getParam('title');
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
    pushToHistory(window.location.href);
},function () {
    popToHistory(window.location.href);
},null,0);

var playButton = document.getElementById('play_img');
var audios = document.getElementById('play_audio');
var totalSeek = document.getElementById('progress');
var secondSeek = document.getElementById('second_progress');
var currentTime = document.getElementById('current_time');
var durationTime = document.getElementById("duration_time");
var Allseek = totalSeek.clientWidth;
audios.addEventListener('ended', function () {
    audios.src = audioData.objData.content;
    audios.currentTime = 0;
    currentTime.innerHTML = '00:00';
    secondSeek.style.width = 0 + 'px';
}, false);
audios.addEventListener('play', function () {
    $("#play_img").attr("src", "/warm/images/audio/playbutton_small.png");
    playButton.style.backgroundSize = 'contain';
}, false);
audios.addEventListener('pause', function () {
    $("#play_img").attr("src", "/warm/images/audio/pausebutton_small.png");
    playButton.style.backgroundSize = 'contain';
}, false);
// 播放事件
function play() {
    if (!audios.src) {
        audios.src = audioData.objData.content;
    }
    if (audios.paused) {
        audioData.isListen = true;
        audios.play();
    } else {
        audioData.isListen = false;
        audios.pause();
    }
}

function closeAudios() {
    if (audios) {
        audios.pause();
    }
}

function shareaudio() {
    Toast('分享功能暂未开放！', 2000);
}

function download() {
    Toast('下载功能暂未开放！', 2000);
}

function myData() {
    $("#current_time").html(timeDispose(audios.currentTime));
    if (audios.duration != 'Infinity') {
        $("#duration_time").html(timeDispose(audios.duration));
    }
    var seekData = parseInt(audios.currentTime) / parseInt(audios.duration)
        * 100;
    secondSeek.style.width = (Allseek * seekData) / 100 + "px";
}

// 格式化时间
function timeDispose(number) {
    var minute = parseInt(number / 60);
    var second = parseInt(number % 60);
    minute = minute >= 10 ? minute : "0" + minute;
    second = second >= 10 ? second : "0" + second;
    return minute + ":" + second;
}