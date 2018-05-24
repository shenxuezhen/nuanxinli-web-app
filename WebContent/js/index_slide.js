var wid = document.documentElement.clientWidth;// 屏幕宽
var hei = document.documentElement.clientHeight;// 屏幕高
var slider = document.getElementById('slider');
slider.style.height = (hei+2) + 'px';
setCookie('sid', getParam('sid'));
localStorage.setItem('puburl', getParam('puburl'));
var isSecond = getParam('nextday');
var jsonStr = '';
//上次看到第几页
var lastCurrent = 0;
// 请求数据
var url = '';
if (getParam('date')) {
    url = '/public/sift/list?date=' + getParam('date');
} else {
    url = '/public/sift/today-list';
}

loadEnv(function() {}, function() {}, null);

//判断加载之前没看完的还是加载新的
var json = '';
$.ajax({
    url: url,
    type: 'GET',
    dataType: 'json',
    async: false,
    success: function (resp) {
        json = resp;
        if (isSecond == 1) {

        } else {
            var id = getParam('ids');

            /*alert(id);*/
            if (id) {
                var ids = id.split(',');
                /*alert(ids.length);*/
                lastCurrent = ids.length - 2;
                for (var a = 0; a <= ids.length - 3; a++) {
                    for (var v = json.length - 1; v >= 0; v--) {
                        if (json[v].id == ids[a]) {
                            json.splice(v, 1);
                        }
                    }
                }
            }
        }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
        console.log(errorThrown);
    }
});
//收藏标记
var collectFlag = false;
var sliderWarp = document.getElementById('slider_wrap');
var pointUi = document.getElementById('position');
var pictureDiv = '<div id="miss_text_div" class="miss_text_div"><div class="miss_text">不能回翻 ？是的 ！</div><div class="miss_text">小暖想让你懂得珍惜当下</div><div class="miss_text">不要轻易错过哦</div></div><div id="slider_body" class="slider_body"><div id="slider_type" class="slider_type"></div><div class="slider_line"></div><div id="slider_image" class="slider_image"><div class="collect_img_div" onclick="collectClick();"><div id="collect_img" class="no_collect_img"/></div></div></div><div class="slider_content_div"><div id="date_div" class="date_div"><div id="day_div" class="day_div">03</div><div id="month_div" class="month_div">Apr,2015</div><div id="data_line"></div></div><div id="picture_slider_content_div"><div id="slider_content" class="picture_slider_content"></div></div></div></div>';
var linkDiv = '<div id="miss_text_div" class="miss_text_div"><div class="miss_text">不能回翻 ？是的 ！</div><div class="miss_text">小暖想让你懂得珍惜当下</div><div class="miss_text">不要轻易错过哦</div></div><a id="testA"><div id="slider_body" class="slider_body"><div id="slider_type" class="slider_type"></div><div class="slider_line"></div><div id="slider_image" class="slider_image"><div class="collect_img_div" onclick="collectClick();"><div id="collect_img" class="no_collect_img"></div></div></div><div class="slider_content_div"><div id="slider_title" class="slider_title"></div><div id="slider_content" class="slider_content"></div><div id="slider_page" class="slider_page"></div></div></div></a>';
var nolinkDiv = '<div id="miss_text_div" class="miss_text_div"><div class="miss_text">不能回翻 ？是的 ！</div><div class="miss_text">小暖想让你懂得珍惜当下</div><div class="miss_text">不要轻易错过哦</div></div><div id="slider_body" class="slider_body"><div id="slider_type" class="slider_type"></div><div class="slider_line"></div><div id="slider_image" class="slider_image"><div class="collect_img_div" onclick="collectClick();"><div id="collect_img" class="no_collect_img"></div></div></div><div class="slider_content_div"><div id="slider_title" class="slider_title"></div><div id="slider_content" class="slider_content"></div><div id="slider_page" class="slider_page"></div></div></div>';
var soundDiv = '<div id="miss_text_div" class="miss_text_div"><div class="miss_text">不能回翻 ？是的 ！</div><div class="miss_text">小暖想让你懂得珍惜当下</div><div class="miss_text">不要轻易错过哦</div></div><div id="slider_body" class="slider_body"><div id="slider_type" class="slider_type"></div><div class="slider_line"></div><div id="slider_image" class="slider_image"><div class="collect_img_div" onclick="collectClick();"><div id="collect_img" class="no_collect_img"></div></div><div id="play_img" class="play_img" onClick="play()"></div><div id="play_progress" class="play_progress"><audio id="play_audio" ontimeupdate="myData()"></audio><div id="current_time" class="time_div">00:00</div><div id="progress_div" class="progress_div"><div id="progress" class="progress"><div id="second_progress" class="second_progress"></div></div></div><div id="duration_time" class="time_div">00:00</div></div></div><div class="slider_content_div"><div id="slider_title" class="slider_title"></div><div id="slider_content" class="slider_content"></div><div id="slider_page" class="slider_page"></div></div></div>';
var videoDiv = '<div id="miss_text_div" class="miss_text_div"><div class="miss_text">不能回翻 ？是的 ！</div><div class="miss_text">小暖想让你懂得珍惜当下</div><div class="miss_text">不要轻易错过哦</div></div><a id="testA"><div id="slider_body" class="slider_body"><div id="slider_type" class="slider_type"></div><div class="slider_line"></div><div id="slider_image" class="slider_image"><div class="collect_img_div" onclick="collectClick();"><div id="collect_img" class="no_collect_img"></div></div><div id="play_img" class="play_img" onClick="play()"></div></div><div class="slider_content_div"><div id="slider_title" class="slider_title"></div><div id="slider_content" class="slider_content"></div><div id="slider_page" class="slider_page"></div></div></div></a>';
var currentPage = 0;
if (json && json != '') {

    //如果第一条被收藏，改变收藏标记
    if (json[0].isCollected == '1') {
        collectFlag = true;
    }

    // 当前页
    for (var i = 0; i < json.length; i++) {
        // 添加底部的点
        var li = document.createElement("li");
        li.id = 'li' + i;
        if (i == 0) {
            li.className = 'on';
        } else {
            li.className = '';
        }
        pointUi.appendChild(li);
        if (i != json.length) {
            var id = json[i].id;
            var type = json[i].type;
            var title = json[i].title;
            var descr = json[i].descr;
            var image = json[i].image;
            var content = json[i].content;
            var detailUrl = json[i].detailUrl;
            var isCollected = json[i].isCollected;
            var figure = document.createElement("figure");
            var time = json[0].postTime;
            time = time.replace(new RegExp("-", "gm"), "/");
            var timeLong = new Date(time).getTime();
            var date = new Date(timeLong);
            var day = date.getDate().toString();
            if (day.length == 1) {
                day = '0' + day;
            }
            var month = date.getMonth();
            if (month == 0) {
                month = 'Jan';
            } else if (month == 1) {
                month = 'Feb';
            } else if (month == 2) {
                month = 'Mar';
            } else if (month == 3) {
                month = 'Apr';
            } else if (month == 4) {
                month = 'May';
            } else if (month == 5) {
                month = 'Jun';
            } else if (month == 6) {
                month = 'Jul';
            } else if (month == 7) {
                month = 'Aug';
            } else if (month == 8) {
                month = 'Sep';
            } else if (month == 9) {
                month = 'Oct';
            } else if (month == 10) {
                month = 'Nov';
            } else {
                month = 'Dec';
            }
            var year = date.getFullYear();

            if (type == 'audio') {
                figure.innerHTML = soundDiv;
                sliderWarp.appendChild(figure);
                // 居中播放按钮
                var playImg = document.getElementById('play_img');
                playImg.style.left = (wid - 60) / 2 + "px";
                playImg.style.top = (hei * 0.4 - 60) / 2 + "px";
                var playAudio = document.getElementById('play_audio');
                var currentTime = document.getElementById('current_time');// 当前时间
                var durationTime = document.getElementById('duration_time');// 总时间
                var progress = document.getElementById('progress');// 总进度条
                var secondProgress = document.getElementById('second_progress');// 播放进度条
                playAudio.id = 'play_audio' + i;
                currentTime.id = 'current_time' + i;
                durationTime.id = 'duration_time' + i;
                progress.id = 'progress' + i;
                secondProgress.id = 'second_progress' + i;
                playImg.id = 'play_img' + i;
            } else if (type == 'video') {
                figure.innerHTML = videoDiv;
                sliderWarp.appendChild(figure);
                // 居中播放按钮
                var playImg = document.getElementById('play_img');
                playImg.style.left = (wid - 60) / 2 + "px";
                playImg.style.top = (hei * 0.4 - 60) / 2 + "px";
                playImg.id = 'play_img' + i;
            } else if (type == 'article' || type == 'test' || type == 'game' || type == 'test-article'
                || type == 'book' || type == 'story' || type == 'movie' || type == 'psycho-edge') {
                figure.innerHTML = linkDiv;
                sliderWarp.appendChild(figure);
            } else if (type == 'picture') {
                figure.innerHTML = pictureDiv;
                sliderWarp.appendChild(figure);
                var dayDiv = document.getElementById('day_div');
                var monthDiv = document.getElementById('month_div');
                dayDiv.innerHTML = day;
                monthDiv.innerHTML = month + ',' + year;
                dayDiv.id = 'day_div' + i;
                monthDiv.id = 'month_div' + i;
            } else {
                figure.innerHTML = nolinkDiv;
                sliderWarp.appendChild(figure);
            }
            var collectImg = document.getElementById('collect_img');//收藏按钮
            var missTextDiv = document.getElementById('miss_text_div');// 错过页面
            var sliderBody = document.getElementById('slider_body');// 内容页面
            var typeDiv = document.getElementById('slider_type');// 类型
            var imageDiv = document.getElementById('slider_image');// 图片
            var titleDiv = document.getElementById('slider_title');// 标题
            var contentDiv = document.getElementById('slider_content');// 内容
            var pageDiv = document.getElementById('slider_page');// 页标
            var testA = document.getElementById('testA');//点击链接

            if (pageDiv) {
                var pageNumber = lastCurrent + i + 1;
                pageDiv.style.background = 'url(images/page' + pageNumber
                    + '.png) center no-repeat';
                pageDiv.style.backgroundSize = 'contain';
            }
            imageDiv.style.background = 'url(' + image + ') center no-repeat';
            imageDiv.style.backgroundSize = 'cover';
            if (titleDiv) {
                titleDiv.innerHTML = title;
            }

            if (type == 'picture') {
                typeDiv.innerHTML = '箴言  · Motto';
                contentDiv.innerHTML = descr;
            } else if (type == 'article') {
                typeDiv.innerHTML = '文章  · Essay';
                testA.href = content + '?id=' + id + '&sid=' + getParam('sid') + '&puburl=' + getParam('puburl');
                contentDiv.innerHTML = descr + '<span style="color:#fcab55;font-size:0.3656rem;">&nbsp;&nbsp;&nbsp;MORE>><span>';
            } else if (type == 'audio') {
                typeDiv.innerHTML = '音频  · Sound';
                contentDiv.innerHTML = descr;
            } else if (type == 'test') {
                typeDiv.innerHTML = '测试  · Test';
                testA.href = detailUrl + '?id=' + id + '&sid=' + getParam('sid') + '&puburl=' + getParam('puburl');
                contentDiv.innerHTML = descr + '<span style="color:#fcab55;font-size:0.3656rem;">&nbsp;&nbsp;&nbsp;MORE>><span>';
            } else if (type == 'test-article') {
                typeDiv.innerHTML = '测试  · Test';
                testA.href = content + '?id=' + id + '&sid=' + getParam('sid') + '&puburl=' + getParam('puburl');
                contentDiv.innerHTML = descr + '<span style="color:#fcab55;font-size:0.3656rem;">&nbsp;&nbsp;&nbsp;MORE>><span>';
            } else if (type == 'book') {
                typeDiv.innerHTML = '书籍推荐  · Book';
                testA.href = content + '?id=' + id + '&sid=' + getParam('sid') + '&puburl=' + getParam('puburl');
                contentDiv.innerHTML = descr + '<span style="color:#fcab55;font-size:0.3656rem;">&nbsp;&nbsp;&nbsp;MORE>><span>';
            } else if (type == 'story') {
                typeDiv.innerHTML = '咨询故事  · Story';
                testA.href = content + '?id=' + id + '&sid=' + getParam('sid') + '&puburl=' + getParam('puburl');
                contentDiv.innerHTML = descr + '<span style="color:#fcab55;font-size:0.3656rem;">&nbsp;&nbsp;&nbsp;MORE>><span>';
            } else if (type == 'movie') {
                typeDiv.innerHTML = '电影赏析  · Movie';
                testA.href = content + '?id=' + id + '&sid=' + getParam('sid') + '&puburl=' + getParam('puburl');
                contentDiv.innerHTML = descr + '<span style="color:#fcab55;font-size:0.3656rem;">&nbsp;&nbsp;&nbsp;MORE>><span>';
            } else if (type == 'game') {
                typeDiv.innerHTML = '游戏  · Game';
                testA.href = content + '?id=' + id + '&sid=' + getParam('sid') + '&puburl=' + getParam('puburl');
                contentDiv.innerHTML = descr + '<span style="color:#f60;font-size:0.3656rem;">&nbsp;&nbsp;&nbsp;MORE>><span>';
            } else if (type == 'knowledge') {
                typeDiv.innerHTML = '小知识  · Knowledge';
                contentDiv.innerHTML = descr;
            } else if (type == 'video') {
                typeDiv.innerHTML = '视频  · Video';
                testA.href = detailUrl + '?id=' + id + '&sid=' + getParam('sid') + '&puburl=' + getParam('puburl');
                contentDiv.innerHTML = descr + '<span style="color:#f60;font-size:0.3656rem;">&nbsp;&nbsp;&nbsp;MORE>><span>';
            } else if (type == 'psycho-edge') {
                typeDiv.innerHTML = '心理前沿 · Psycho-edge';
                testA.href = content + '?id=' + id + '&sid=' + getParam('sid') + '&puburl=' + getParam('puburl');
                contentDiv.innerHTML = descr + '<span style="color:#fcab55;font-size:0.3656rem;">&nbsp;&nbsp;&nbsp;MORE>><span>';
            }
            collectImg.id = 'collect_img' + i;
            missTextDiv.id = 'miss_text_div' + i;
            sliderBody.id = 'slider_body' + i;
            typeDiv.id = 'slider_type' + i;
            imageDiv.id = 'slider_image' + i;
            if (titleDiv) {
                titleDiv.id = 'slider_title' + i;
            }
            contentDiv.id = 'slider_content' + i;
            if (pageDiv) {
                pageDiv.id = 'slider_page' + i;
            }
            if (testA) {
                testA.id = 'testA' + i;
            }
        }
    }
}
// 添加结束页面
var figure = document.createElement("figure");
var finishDiv = '<div id="slider_finish"><iframe id="iframe" style="display: none;"></iframe></div>';
figure.innerHTML = finishDiv;
sliderWarp.appendChild(figure);
var playButton;
var audios;
var totalSeek;
var secondSeek;
var currentTime;
var durationTime;
var Allseek;
// 播放事件
function play() {
    playButton = document.getElementById('play_img' + currentPage);
    audios = document.getElementById('play_audio' + currentPage);
    totalSeek = document.getElementById('progress' + currentPage);
    secondSeek = document.getElementById('second_progress' + currentPage);
    currentTime = document.getElementById('current_time' + currentPage);
    durationTime = document.getElementById("duration_time" + currentPage);
    Allseek = totalSeek.clientWidth;
    if (!audios.src) {
        audios.src = json[currentPage].content;
    }
    audios.addEventListener('ended', function () {
        audios.src = json[currentPage].content;
        audios.currentTime = 0;
        currentTime.innerHTML = '00:00';
        secondSeek.style.width = 0 + 'px';
    }, false);
    audios.addEventListener('play', function () {
        playButton.style.background = "url('images/pause.png') center no-repeat";
        playButton.style.backgroundSize = 'cover';
    }, false);
    audios.addEventListener('pause', function () {
        playButton.style.background = "url('images/play.png') center no-repeat";
        playButton.style.backgroundSize = 'cover';
    }, false);
    if (audios.paused) {
        if (browser.ios) {
            if (getParam('isCount') == 'isCount') {
                lasePageIframe.src = 'play_audio';
            }
        } else {
            if (window.appInterface.playAudio) {
                window.appInterface.playAudio();
            }
        }
        audios.play();
    } else {
        audios.pause();
    }
}

//暂停播放
function closeAudios() {
    if (audios) {
        audios.pause();
    }
}

function myData() {
    currentTime.innerHTML = timeDispose(audios.currentTime);
    if (audios.duration != 'Infinity') {
        durationTime.innerHTML = timeDispose(audios.duration);
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
var bullets = document.getElementById('position').getElementsByTagName('li');
var lasePageIframe = document.getElementById('iframe');
//和客户端交互出现倒计时
if (!json || json == '') {
    if (browser.ios) {
        lasePageIframe.src = 'last_page';
    } else {
        if (window.appInterface) {
            window.appInterface.showCountDown();
        }
    }
}
if (browser.ios) {
    //和客户端交互分享链接
    if (json && json != '') {
        lasePageIframe.src = 'share:id=' + json[currentPage].id;
    }
} else {
    if (json && json != '') {
        if (window.appInterface) {
            window.appInterface.getId(json[currentPage].id);
        }
        if (window.appInterface.getImagePath) {
            window.appInterface.getImagePath(json[currentPage].image);
        }
    }
}

//居中收藏后效果图片
var collectEffectImage = document.getElementById('xin');
var collectEffectImageWid = collectEffectImage.offsetWidth;
var collectEffectImageHei = collectEffectImage.offsetHeight;
collectEffectImage.style.top = (hei - collectEffectImageHei) / 2 + 'px';
collectEffectImage.style.left = (wid - collectEffectImageWid) / 2 + 'px';

//居中取消收藏提示文字
var cancelCollectText = document.getElementById('cancel_collect_font_div');
var cancelCollectTextWid = cancelCollectText.offsetWidth;
var cancelCollectTextHei = cancelCollectText.offsetHeight;
cancelCollectText.style.top = (hei - cancelCollectTextHei) / 2 + 'px';
cancelCollectText.style.left = (wid - cancelCollectTextWid) / 2 + 'px';

// 滑动js
var slider = Swipe(document.getElementById('slider'), {
    continuous: true,
    callback: function (pos) {
        if (audios) {
            audios.pause();
        }
        //去掉收藏动作的效果
        collectEffectImage.className = '';
        // 设置当前页
        currentPage = pos;
        var prev = pos - 1;
        // 翻过的隐藏
        var miss = document.getElementById('miss_text_div' + prev);
        var body = document.getElementById('slider_body' + prev);
        miss.style.display = 'block';
        body.style.display = 'none';
        var li = document.getElementById('li' + currentPage);
        if (li) {
            li.parentNode.removeChild(li);
        }
        var i = bullets.length;
        while (i--) {
            bullets[i].className = '';
        }
        bullets[0].className = 'on';
        //和客户端交互出现倒计时
        if (currentPage == json.length) {
            if (browser.ios) {
                lasePageIframe.src = 'last_page';
            } else {
                if (window.appInterface) {
                    window.appInterface.showCountDown();
                }
            }
        }
        if (browser.ios) {
            //和客户端交互分享链接
            if (json && json != '') {
                lasePageIframe.src = 'share:id=' + json[currentPage].id;
            }
        } else {
            if (json && json != '') {
                if (window.appInterface) {
                    window.appInterface.getId(json[currentPage].id);
                }
                if (window.appInterface.getImagePath) {
                    window.appInterface.getImagePath(json[currentPage].image);
                }
            }
        }
        collectImg = document.getElementById('collect_img' + currentPage);
        //改变收藏标记
        if (json[currentPage].isCollected == '1') {
            collectFlag = true;
            collectImg.className = 'collect_img';
        } else {
            collectFlag = false;
            collectImg.className = 'no_collect_img';
        }
    }
});

//收藏参数
var param = '';
//收藏接口
var url = '';
//收藏按钮
var collectImg = document.getElementById('collect_img' + currentPage);
if (collectFlag) {
    collectImg.className = 'collect_img';
}
//是否登录过
var collectIsLogin = getParam('isLogin');
//版本号
var versionName = getParam('versionName');
var versionNameFloat;
if (versionName && versionName != '') {
    versionNameFloat = parseFloat(versionName);
}

//登录完成回调
function loginBack(sid) {
    collectIsLogin = 'true';
    setCookie('sid', sid);
}

//退出登录回调
function outLoginBack() {
    collectIsLogin = '';
}

//收藏按钮点击
function collectClick() {
    var aHref = '';
    //屏蔽a标签
    var testA = document.getElementById('testA' + currentPage);
    if (testA) {
        aHref = testA.href;
        testA.href = 'javascript:void(0);';
        setTimeout(function () {
            testA.href = aHref;
        }, 1000);
    }
    if (browser.ios) {
        if (versionNameFloat && versionNameFloat >= 2.5) {
            if (collectIsLogin == 'true') {
                collectSift();
            } else {
                lasePageIframe.src = "siftCollectNotLogin";
            }
        } else {
            setCookie('sid', getParam('sid'));
            collectSift();
        }
    } else {
        if (versionNameFloat && versionNameFloat >= 4.0) {
            if (collectIsLogin == 'true') {
                collectSift();
            } else {
                if (window.appInterface.login) {
                    window.appInterface.login();
                }
            }
        } else {
            setCookie('sid', getParam('sid'));
            collectSift();
        }
    }
}

//收藏
function collectSift() {
    if (!collectFlag) {
        param = '{"isCollected":1}';
        collectImg.className = 'collect_img';
        collectFlag = true;
        collectEffectImage.style.visibility = 'visible';
        setTimeout(function () {
            collectEffectImage.className = 'xin1';
        }, 10);
        setTimeout(function () {
            collectEffectImage.style.visibility = 'hidden';
        }, 200);
        if (browser.ios) {
            if (getParam('isCount') == 'isCount') {
                lasePageIframe.src = "siftCollect";
            }
        } else {
            if (window.appInterface.siftCollect) {
                window.appInterface.siftCollect();
            }
        }
    } else {
        param = '{"isCollected":0}';
        collectImg.className = 'no_collect_img';
        collectFlag = false;
        cancelCollectText.style.visibility = 'visible';
        collectEffectImage.className = '';
        setTimeout(function () {
            cancelCollectText.style.visibility = 'hidden';
        }, 1000);
    }
    //收藏接口
    url = '/public/sift/' + json[currentPage].id + '/collect';
    ajax(url, param, function (resp) {
        jsonStr = resp;
    }, null, function () {
        if (httpRequest.status == 401) {
            if (browser.ios) {
                /*iosIframe.src = "warmIsOverdue";*/
            } else {
                if (window.appInterface) {
                    /*alert('重新获取sid');*/
                    window.appInterface.getSid();
                }
            }
        }
    });
}

//sid过期重新收藏
function collectSid(sid) {
    var beforeSid = document.cookie;
    if (sid) {
        setCookie("sid", sid);
    }
    httpRequest.open('POST', url, false);
    httpRequest.send(param);
    /*alert('重新收藏');*/
    if (httpRequest.readyState == 4) {
        if (httpRequest.status == 200) {
            jsonStr = httpRequest.responseText;
        }
    } else {
        alert(httpRequest.status + '-------' + httpRequest.responseText + '获取sid之后不成功');
    }
}
function getImage() {
    return json[currentPage].image;
}
