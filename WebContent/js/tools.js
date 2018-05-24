localStorage.setItem('companyMainColor', "#fcab55");
localStorage.setItem('companyBtnColor', "#3f907e");
//去掉左右空格
function trimStr(str) {
    return str.replace(/(^\s+)|(\s+$)/g, "");
}

//保存cookie
function setCookie(name, value) { // name为cookie的名称,value为name值
    var days = 10; // 保存天数,可作为参数传进来
    var expires = new Date(); // 建立日期变量
    expires.setTime(expires.getTime() + days * 30 * 24 * 60 * 60 * 1000); // expires过期时间
    var str = name + '=' + value + ';path=/'; // 将值及过期时间一起保存至cookie中(需以GMT格式表示的时间字符串)
    // var str = name + ‘=’ + escape(value) +’;expires=’ +
    // expires.toGMTString();
    document.cookie = str;
}

// 获取cookie
function getCookie(name) {// name为cookie名称
    var strcookie = document.cookie;// 获取cookie字符串
    var arr = strcookie.split(';'); // 分割cookie
    for (var i = 0; i < arr.length; i++) {
        var arrStr = arr[i].split('='); // 对各个cookie进行分割
        if (trimStr(arrStr[0]) == name)
            return trimStr(arrStr[1]); // 判断是否存在cookie名称为name并输出
    }
    return ""; // 返回
}

// 删除cookie
function deleteCookie(name) {
    var date = new Date();
    date.setTime(date.getTime() - 10000);
    document.cookie = name + "=; expire=" + date.toGMTString();
}

//

// 获取参数
function getParam(name) {
    var search = decodeURIComponent(document.location.search);
    var pattern = new RegExp("[?&]" + name + "\=([^&]+)", "g");
    var matcher = pattern.exec(search);
    var items = null;
    if (null != matcher) {
        try {
            items = decodeURIComponent(decodeURIComponent(matcher[1]));
        } catch (e) {
            try {
                items = decodeURIComponent(matcher[1]);
            } catch (e) {
                items = matcher[1];
            }
        }
    }
    return items;
}

function getParamAndUrl(url, name) {
    var pattern = new RegExp("[?&]" + name + "\=([^&]+)", "g");
    var matcher = pattern.exec(url);
    var items = null;
    if (null != matcher) {
        try {
            items = decodeURIComponent(decodeURIComponent(matcher[1]));
        } catch (e) {
            try {
                items = decodeURIComponent(matcher[1]);
            } catch (e) {
                items = matcher[1];
            }
        }
    }
    return items;
}

var Browser = function () {
    var u = navigator.userAgent, app = navigator.appVersion;
    var first, second, version;
    if (u.indexOf('Android ')) {
        first = u.substr(u.indexOf('Android ') + 8, 1);
        if ((typeof Number(first) == 'number') && (first <= 4)) {
            second = u.substr(u.indexOf('Android ') + 10, u);
            if ((typeof Number(second) == 'number') && (second < 4)) {
                version = 'true';
            } else {
                version = 'false';
            }
        }
    }
    ;

    this.isAndroid = version;//浏览器版本是否低于4.4
    this.trident = u.indexOf('Trident') > -1; //IE内核
    this.presto = u.indexOf('Presto') > -1; //opera内核
    this.webKit = u.indexOf('AppleWebKit') > -1; //苹果、谷歌内核
    this.gecko = u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1; //火狐内核
    this.mobile = !!u.match(/AppleWebKit.*Mobile.*/); //是否为移动终端
    this.ios = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    this.android = u.indexOf('Android') > -1
        || u.indexOf('Linux') > -1; //android终端或uc浏览器
    this.iPhone = u.indexOf('iPhone') > -1; //是否为iPhone或者QQHD浏览器
    this.iPad = u.indexOf('iPad') > -1; //是否iPad
    this.webApp = u.indexOf('Safari') == -1; //是否web应该程序，没有头部与底部
    this.weixin = u.toLowerCase().match(/MicroMessenger/i) == "micromessenger";
    this.qq = u.indexOf('MQQBrower') > -1;
    this.alipay = u.indexOf('Alipay') > -1;
    this.taobao = u.indexOf('AliApp(TB') > -1;
    this.nuanApp = window.nuanApp;
};

var browser = new Browser();

//获取手机系统信息
function getSystemInfo() {
    var md = new MobileDetect(navigator.userAgent);
    var os = md.os();//系统
    var device,version;
    var Sys = {};
    var ua = navigator.userAgent.toLowerCase();
    var s;
    (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1] :
        (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
            (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
                (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
                    (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
                        (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;

    if (Sys.ie) version=Sys.ie;
    if (Sys.firefox) version=Sys.firefox;
    if (Sys.chrome) version=Sys.chrome;
    if (Sys.opera) version=Sys.opera;
    if (Sys.safari) version=Sys.safari;
    if (os == "iOS") {
        os = os + ' ' + md.version("iPhone");
        device = md.mobile();
    } else if (os == "AndroidOS") {
        os = os + ' ' + md.version("Android");
        var sss = navigator.userAgent.split(";");
        if (sss.indexOf("Build/") > -1) {
            device = sss[i].substring(0, sss[i].indexOf("Build/"));
        }
    }
    return {
        'os': os,
        'version': version,
        'device': md.userAgent()+' '+version,
    }
}

//div限制字数
//内容超出部分显示省略号
function textCountLimit(textCount, textDiv) {
    var content = textDiv.innerHTML;
    var flag = false;
    while (content.length > textCount) {
        content = content.substring(0, content.length - 1);
        flag = true;
    }
    if (flag) {
        content += "...";
    }
    textDiv.innerHTML = content;
}

//获取当前时间yyyy-MM-dd HH:mm:ss
function getCurrentTime() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minutes = date.getMinutes();
    var second = date.getSeconds();
    return year + "-" + month + "-" + day + " " + hour + ":" + minutes + ":" + second;
}

function subTime(str) {
    return str.slice(0, str.length - 3);
}

//等待状态
function wait(ele) {
    setTimeout(function () {
        ele.innerHTML = '请稍等...';
    }, 1000);
}

//获取屏幕高度
function doubleClick() {
    var clientHei = document.documentElement.clientHeight;
    var bodyHei = document.documentElement.offsetHeight;
    if (bodyHei <= clientHei) {
        document.documentElement.style.height = clientHei + 100 + 'px';
    }
}

//xml解析json
loadXML = function (xmlString) {
    var xmlDoc = null;
    //判断浏览器的类型
    //支持IE浏览器
    if (!window.DOMParser && window.ActiveXObject) {   //window.DOMParser 判断是否是非ie浏览器
        var xmlDomVersions = ['MSXML.2.DOMDocument.6.0', 'MSXML.2.DOMDocument.3.0', 'Microsoft.XMLDOM'];
        for (var i = 0; i < xmlDomVersions.length; i++) {
            try {
                xmlDoc = new ActiveXObject(xmlDomVersions[i]);
                xmlDoc.async = false;
                xmlDoc.loadXML(xmlString); //loadXML方法载入xml字符串
                break;
            } catch (e) {
            }
        }
    }
    //支持Mozilla浏览器
    else if (window.DOMParser && document.implementation && document.implementation.createDocument) {
        try {
            /* DOMParser 对象解析 XML 文本并返回一个 XML Document 对象。
             * 要使用 DOMParser，使用不带参数的构造函数来实例化它，然后调用其 parseFromString() 方法
             * parseFromString(text, contentType) 参数text:要解析的 XML 标记 参数contentType文本的内容类型
             * 可能是 "text/xml" 、"application/xml" 或 "application/xhtml+xml" 中的一个。注意，不支持 "text/html"。
             */
            domParser = new DOMParser();
            xmlDoc = domParser.parseFromString(xmlString, 'text/xml');
        } catch (e) {
        }
    }
    else {
        return null;
    }

    return xmlDoc;
};

//控制加载外部文件顺序
function loadJS(url, success) {
    var domScript = document.createElement('script');
    domScript.src = url;
    success = success || function () {
        };
    domScript.onload = function () {
        success();
    };
    document.getElementsByTagName('head')[0].appendChild(domScript);
}

//ajax的封装
function ajax(url, data, callback, error, errorCallback) {
    console.log('index_slide');
    var sid = getCookie('sid') || localStorage.getItem('sid');
    setCookie('sid', sid);
    if (!sid) var sid = '';
    $.ajax({
        url: url,
        type: data == null ? 'GET' : 'POST',
        data: data == null ? '' : JSON.stringify(data),
        contentType: "application/json",
        dataType: "json",
        success: function (resp, status, xhr) {
            callback(resp, status, xhr);
        },
        error: function (XMLHttpRequest) {
            if (XMLHttpRequest.status == "401") {
                notLogin(url, data, callback, error, errorCallback)
            } else if (XMLHttpRequest.status == "0") {
                //取消当前请求，XMLHttpRequest对象还没有初始化完成
                return;
            } else if(XMLHttpRequest.status == "998"){
                var userInfo=JSON.parse(browser.nuanApp.needRealUser());
                if(userInfo.password && userInfo.username){
                    var userData=browser.nuanApp.relogin();
                    ajax('/public/user/login', userData, function (resp) {
                        ajax(url, data, callback, error, errorCallback);
                    },null,function (status, text) {
                        alert('登录失败');
                    });
                }else {
                    return 0;
                }
            }else {
                if (errorCallback) {
                    errorCallback(XMLHttpRequest.status, XMLHttpRequest.responseText);
                    return;
                } else {
                    console.dir(XMLHttpRequest);
                    alert((error ? error : '') + XMLHttpRequest.status + ',' + XMLHttpRequest.responseText);
                }
            }
        },
        headers: {
            'sid': sid,
            'Warm-User-Agent':JSON.stringify(setHeader())
        }
    });
}

function ajaxPOST(url, type, data, callback, error, errorCallback) {
    var sid = getCookie('sid') || localStorage.getItem('sid');
    setCookie('sid', sid);
    if (!sid) var sid = '';
    $.ajax({
        url: url,
        type: type,
        data: data == null ? '' : JSON.stringify(data),
        contentType: "application/json",
        dataType: "json",
        success: function (resp, status, xhr) {
            callback(resp, status, xhr);
        },
        error: function (XMLHttpRequest) {
            if (errorCallback) {
                errorCallback(XMLHttpRequest.status, XMLHttpRequest.responseText);
                return;
            }
            if (XMLHttpRequest.status == "401") {
                notLogin(url, data, callback, error, errorCallback)
            } else if (XMLHttpRequest.status == "0") {
                //取消当前请求，XMLHttpRequest对象还没有初始化完成
                return;
            } else {
                console.dir(XMLHttpRequest);
                alert((error ? error : '') + XMLHttpRequest.status + ',' + XMLHttpRequest.responseText);
            }
        },
        headers: {
            'sid': sid,
            'Warm-User-Agent':JSON.stringify(setHeader())
        }
    });
}

var ajaxAry = [];

//封装验证码登录窗口
function loginDialog(url, data, callback, error) {
    document.body.style.overflow = 'hidden';
    var bodys = document.documentElement || document.body;
    ajaxAry.push({url: url, data: data, callback: callback, error: error});
    var myStyle = $('.mystyle')[0];
    if (myStyle) {
        return;
    }
    var loginDiv = document.createElement('div');
    var warpDiv = document.createElement('div');
    warpDiv.setAttribute('style', 'background: #000;width: 100%;height: 100%;z-index: 4;position: absolute;top: 0;left: 0;opacity: .5;');
    loginDiv.classList.add('mystyle');
    loginDiv.setAttribute('style', 'width: 8rem;height: 7rem;text-align: center;position:absolute;top:50%;left:50%;margin-top:-3rem;margin-left:-4rem;border:1px solid #ccc;background:#ccc;z-index:5;"');
    var str = '<div class="user-info" style="width: 100%;height: 90%;margin-top: 10%">' +
        '<p style="margin: .4rem auto;width:90%;height:1rem;line-height:1rem;display:flex;justify-content: space-between"><span class="user-tip" style="font-size: .4rem">手机号：</span><input type="tel" id="cellphone" style="width: 69%;padding-left: 5px;font-size: .3rem" placeholder="请输入手机号"></p>' +
        '<p id="warn1" style="display: none;font-size: .2rem;color: #e9322d">请输入正确手机号</p>' +

        '<p style="margin: .4rem auto;width:90%;height:1rem;line-height:1rem;display:flex;justify-content: space-between"><span class="user-tip" style="font-size: .4rem">验证码：</span><input type = "string" id = "graphValidate" placeholder = "验证码" style="width: 43%;height: 1rem;line-height: 1rem;padding-left: 5px;font-size: .3rem"> <span class = "graphValidate" style="display: inline-block;width:1.5rem;height: 1rem;line-height: 1rem;font-size: .3rem;color: #fcab55;background: #ffffff;"> <img id = "graphic" style="width: 100%;height: 100%;"> </span > </p>' +
        '<p id = "warn3" style = "font-size: 0.2rem; color: rgb(233, 50, 45); display: none;" > 请输入正确验证码 </p> ' +

        '<p style="margin: .4rem auto ;width:90%;height:1rem;line-height:1rem;display:flex;justify-content: space-between"><span class="user-tip" style="font-size: .4rem">验证码：</span><input type="number" id="seccode"  style="width: 43%;padding-left: 5px;font-size: .3rem" placeholder="请输入验证码"><span class="captcha" style="display: inline-block;width:1.5rem;height: .9rem;line-height: .9rem;border:1px solid #fcab55;font-size: .3rem;color: #fcab55;background: #ffffff;">验证码</span></p>' +
        '<p id="warn2" style="display: none;font-size: .2rem;color: #e9322d"">请输入正确且有效验证码</p>' +
        '<div class="login" style="width: 30%;height: 1rem;text-align: center;line-height: 1rem;margin: 0 auto;font-size: .6rem;background: #3F907F;color: #ffffff">登录</div>' +
        '</div>';
    loginDiv.innerHTML = str;
    bodys.lastChild.appendChild(loginDiv);
    bodys.lastChild.appendChild(warpDiv);
    getCaptchaImg();
    $('.graphValidate').on('click', getCaptchaImg);
    function getCaptchaImg() {
        ajaxPOST('/public/user/v2/verification/image', 'POST', '', function (resp) {
            $('#graphic').attr('src', resp.image)
        }, '获取图文验证码失败');
    }

    $('.captcha').on('click', getCaptcha);
    function getCaptcha() {
        var cellPhone = $("#cellphone")[0].value;
        var graphValidate = $('#graphValidate')[0].value;
        if (!cellPhone) {
            $("#warn1").html("手机号不能为空").show();
            setTimeout(function () {
                $("#warn1").hide();
            }, 1000);
            return;
        }
        var reg1 = /^\d+$/g;
        if (!reg1.test(cellPhone)) {
            $("#warn1").html("手机号为纯数字").show();
            setTimeout(function () {
                $("#warn1").hide();
            }, 1000);
            return;
        }
        ;
        var reg2 = /^1[3|4|5|7|8]\d{9}$/g;
        if (!reg2.test(cellPhone)) {
            $("#warn1").html("请输入有效手机号").show();
            setTimeout(function () {
                $("#warn1").hide();
            }, 1000);
            return;
        }
        if (graphValidate == '') {
            $("#warn3").html("图形验证码不能为空").show();
            setTimeout(function () {
                $("#warn3").hide();
            }, 1000);
            return;
        }
        ajax('/public/user/v2/verification/web-check', {
            "cellPhone": cellPhone,
            "imageVerify": graphValidate
        }, function (resp) {
            var captcha = $(".captcha");
            captcha.css('borderColor', '#dcdcdc');
            captcha.css('color', '#81807E');
            var num = 60;
            captcha.text(num + 's');
            var timer1 = setInterval(function () {
                $(".captcha").unbind();
                num--;
                captcha.text(num + 's');
                if (num < 1) {
                    captcha.css('borderColor', '#FCAB55');
                    captcha.css('color', '#FCAB55');
                    captcha.text('验证码');
                    clearInterval(timer1);
                    $(".captcha").bind('click', getCaptcha);
                }
            }, 1000);
        }, null, function (status, text) {
            $('#warn3').show().html(text);
            setTimeout(function () {
                $('#warn3').hide();
                $('#graphValidate')[0].value = '';
            }, 2000);
            if (status == '803') {
                getCaptchaImg();
            }
        });
    }

    $('.login').on('click', function () {
        var companyName = getParam('thirdPartyName');
        var cellData = {
            "cellPhone": $("#cellphone")[0].value,
            "content": $("#seccode")[0].value,
            "source": companyName ? 'H5' : 'H5Test'
        };
        $.ajax({
            url: '/public/user/v2/verification/check-user',
            type: 'POST',
            data: JSON.stringify(cellData),
            contentType: "application/json",
            dataType: "json",
            success: function (resp, status, xhr) {
                bodys.style.overflow = '';
                if (!JSON.parse(localStorage.getItem('userInfo'))) {
                    var userInfo = {
                        "name": resp.name,
                        "photo": resp.photo
                    };
                    localStorage.setItem('userInfo', JSON.stringify(userInfo));
                }
                var headers = xhr.getAllResponseHeaders();
                headers.split('\r\n').forEach(function (value) {
                    if (value.indexOf('sid: ') > -1) {
                        if (value.indexOf('=')) {
                            localStorage.setItem('sid', value.slice(value.indexOf('=') + 1));
                            setCookie('sid', value.slice(value.indexOf('=') + 1));
                            bodys.lastChild.removeChild(loginDiv);
                            bodys.lastChild.removeChild(warpDiv);
                            bodys.lastChild.style.overflow = "";
                            if (getParam('isEntry') == 1) {
                                window.location.href = '/warm/home/home.html?isEntry=0';
                            }
                            if (url) {
                                $.each(ajaxAry, function (key, value) {
                                    ajax(value.url, value.data, value.callback, value.error);
                                });
                                ajaxAry = [];
                            }
                            return true;
                        }
                    }
                });
            },
            error: function (XMLHttpRequest) {
                $("#warn2").show().html(XMLHttpRequest.text);
                setTimeout(function () {
                    $("#warn2").hide();
                }, 2000);
                if (status == '803') {
                    getCaptchaImg();
                }
            }
        });
    });
}

function pushToHistory(url) {
    var history = JSON.parse(localStorage.getItem('history'));
    if (history && history.slice(history.length - 1) != url) {
        history.push(url);
    }
    localStorage.setItem('history', JSON.stringify(history));
}

function popToHistory(url) {
    var history = JSON.parse(localStorage.getItem('history'));
    if (history && history.slice(history.length - 1) == url) {
        history.pop();
    }
    localStorage.setItem('history', JSON.stringify(history));
    window.location.href = history.slice(history.length - 1)[0];
}

//封装scroll
function shirleyScroll(downData, upData, ele) {
    var doc = document;
    var bodyDiv = doc.body,
        theFirstChild = bodyDiv.firstChild,
        pullDownEl = doc.createElement('div'),
        pullUpEl = doc.createElement('div');
    pullDownEl.id = 'pullDown';
    pullUpEl.id = 'pullUp';
    bodyDiv.insertBefore(pullDownEl, theFirstChild);
    bodyDiv.appendChild(pullUpEl);
    var strDown = '<img src="../images/load.gif">';
    var strUp = '<span>没有更多数据了</span>';
    pullDownEl.innerHTML = strDown;
    pullUpEl.innerHTML = strUp;
    var pullDownEl = doc.getElementById('pullDown'),
        pullDownElHeight = pullDownEl.clientHeight,
        movePoint,//移动点
        endPoint,
        startPointClientY,//相对屏幕的高度
        startPointPageY,//相对文档的高度
        documentHeight,//当前文档高度
        pullUpNum = 1;

    function pullDownAction() {//下拉刷新
        downData();
        pullUpNum = 1;
        setTimeout(function () {
            $('#pullDown').css('display', 'none');
            $('#pullDown').css('top', '-1rem');
        }, 500);
    }

    function pullUpAction() {//上拉加载
        pullUpNum++;
        upData(pullUpNum, pullUpNull);
    }

    function pullUpNull() {
        $('#pullUp').show();
        setTimeout(function () {
            $('#pullUp').hide();
        }, 1000);
    }

    function loaded() {
        doc.addEventListener('touchstart', touchStart, false);
        doc.addEventListener('touchmove', touchMove, false);
        doc.addEventListener('touchend', touchEnd, false);
        function touchStart(event) {
            documentHeight = doc.body.scrollHeight;
            startPointClientY = event.touches[0].clientY;
            startPointPageY = event.touches[0].pageY;
        }

        function touchMove(event) {
            movePoint = event.changedTouches[0].pageY;
            if ((startPointClientY == startPointPageY || startPointClientY < (startPointPageY - 10)) && movePoint > startPointPageY && startPointPageY <= startPointClientY) {//下拉
                if (movePoint - startPointPageY < pullDownElHeight) {
                    pullDownEl.style.display = 'block';
                    pullDownEl.style.top = movePoint - startPointPageY + 'px';
                }
                console.log(pullDownEl.style.top);
            }
            if (!event.cancelBubble) {
                if ((!event.defaultPrevented && (startPointClientY == startPointPageY || startPointClientY < (startPointPageY - 10)) && movePoint > startPointPageY && startPointPageY <= startPointClientY) || (event.defaultPrevented && (movePoint / documentHeight > 0.7 && movePoint < startPointPageY))) {
                    event.preventDefault();
                }
            }
        }

        function touchEnd(event) {
            endPoint = event.changedTouches[0].pageY;
            if ((startPointClientY == startPointPageY || startPointClientY < (startPointPageY - 10)) && endPoint > startPointPageY && startPointPageY <= startPointClientY) {//下拉
                pullDownAction();   // ajax call
            } else if (endPoint / documentHeight > 0.7 && endPoint < startPointPageY) {
                pullUpAction()
            } else {
                $('#pullDown').css('display', 'none');
                $('#pullDown').css('top', '-1rem');
            }
        }
    }

    setTimeout(loaded, 1000);
}

function nxlLogin(employeeInfo, onReady, onFail) {
    ajax("/public/company/vendor/login", employeeInfo, function (resp, status, xhr) {
        var companyMainColor = resp.company.vendor.mainColor;
        var companyBtnColor = resp.company.vendor.buttonColor;
        if (companyMainColor) {
            localStorage.setItem('companyMainColor', companyMainColor);
        } else {
            localStorage.setItem('companyMainColor', "#fcab55");
        }
        if (companyBtnColor) {
            localStorage.setItem('companyBtnColor', companyBtnColor);
        } else {
            localStorage.setItem('companyBtnColor', "#3f907e");
        }
        if (!employeeInfo.photo) {
            employeeInfo.photo = resp.photo;
        }
        if (!employeeInfo.name) {
            employeeInfo.name = resp.name;
        }
        localStorage.setItem('userInfo', JSON.stringify(employeeInfo));
        localStorage.setItem('company', getParam('thirdPartyName'));//标志是企业且企业名为getParam('thirdPartyName')
        var headers = xhr.getAllResponseHeaders();
        headers.split('\r\n').forEach(function (value) {
            if (value.indexOf('sid: ') > -1) {
                if (value.indexOf('=')) {
                    var sid = value.slice(value.indexOf('=') + 1);
                    localStorage.setItem('sid', sid);
                    setCookie('sid', sid);
                    return false;
                }
            }
        });
        if (onReady) {
            onReady();
        }
    }, null, function (status, text) {
        if (onFail) {
            onFail(status, text);
        }
    });
}

function initShareObj(obj) {
    window.shareObj=obj;
}

function loadPlugin(jsUrl, onReady, onBack, rightMenu, isLogin) {
    loadJS(jsUrl, function () {
        loadJS('/warm/js/mobile-detect.min.js', function () {
            init(onReady, onBack, rightMenu, isLogin);
        });
    })
}

//加载页面所属的环境需要的库和初始化方法
function loadEnv(onReady, onBack, rightMenu, isLogin) {
    var isEntry = getParam('isEntry');
    if (isEntry == '1') {
        localStorage.clear();
        //清空localStorage之后如果是微信重定向回来的还是要保存wxCode的，不保存，后面就无法获取openId了
        if (getParam('wx_code')) {
            localStorage.setItem('wxCode', getParam('code'));
        }
        window.isEntry = isEntry;
        var url = window.location.href;
        window.location.href = url.replace(/isEntry=1/img, 'isEntry=0');
    }
    var thirdPartyName = getParam('thirdPartyName'), company = localStorage.getItem('company'), seqKey = getParam('seqKey');
    if (seqKey) {
        localStorage.setItem('seqKey', seqKey);
    }
    if (!company) {
        localStorage.setItem('company', thirdPartyName);
    }
    if ((thirdPartyName == 'nxl' || company == 'nxl') && !browser.weixin) {
    	if (!seqKey || seqKey == null) {
            localStorage.setItem('seqKey', thirdPartyName || company);
        }
        loadPlugin('/warm/js/third_party/nxl.js', onReady, onBack, rightMenu, isLogin);
    } else if ((thirdPartyName == 'rrc' || company == 'rrc') && !browser.weixin) {
        if (!seqKey || seqKey == null) {
            localStorage.setItem('seqKey', thirdPartyName || company);
        }
        loadPlugin('/warm/js/third_party/rrc.js', onReady, onBack, rightMenu, isLogin);
    }else if ((thirdPartyName == 'gzq' || company == 'gzq') && !browser.weixin) {
        if (!seqKey || seqKey == null) {
            localStorage.setItem('seqKey', thirdPartyName || company);
        }
        loadPlugin('/warm/js/third_party/gzq.js', onReady, onBack, rightMenu, isLogin);
    } else if ((thirdPartyName == 's365' || company == 's365') && !browser.weixin) {
        if (!seqKey || seqKey == null) {
            localStorage.setItem('seqKey', thirdPartyName || company);
        }
        loadPlugin('/warm/js/third_party/s365.js', onReady, onBack, rightMenu, isLogin);
    } else if (browser.weixin) {
        if (!seqKey || seqKey == null) {
            localStorage.setItem('seqKey', 'xcx');
        }
        loadPlugin('/warm/js/third_party/wx.js', onReady, onBack, rightMenu, isLogin);
    } else if (browser.nuanApp) {
        if (!seqKey || seqKey == null) {
            localStorage.setItem('seqKey', 'app');
        }
        loadPlugin('/warm/js/third_party/nuanApp.js', onReady, onBack, rightMenu, isLogin);
    } else if ((thirdPartyName == 'axp' || company == 'axp') && !browser.weixin) {
    	// 测试页面
    	if (!seqKey || seqKey == null) {
            localStorage.setItem('seqKey', thirdPartyName || company);
        }
        loadPlugin('/warm/js/third_party/axp_test.js', onReady, onBack, rightMenu, isLogin);
    } else {
        if (!seqKey || seqKey == null) {
            localStorage.setItem('seqKey', 'app');
        }
        loadPlugin('/warm/js/third_party/browser.js', onReady, onBack, rightMenu, isLogin);
    }
}

//自定义弹框
function Toast(msg, duration) {
    duration = isNaN(duration) ? 3000 : duration;
    var m = document.createElement('div');
    m.innerHTML = msg;
    m.style.cssText = "width: 60%;min-width: 150px;opacity: 0.7;height: 30px;color: rgb(255, 255, 255);line-height: 30px;text-align: center;border-radius: 5px;position: fixed;top: 40%;left: 20%;z-index: 999999;background: rgb(0, 0, 0);font-size: 12px;";
    document.body.appendChild(m);
    setTimeout(function () {
        var d = 0.5;
        m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
        m.style.opacity = '0';
        setTimeout(function () {
            document.body.removeChild(m)
        }, d * 1000);
    }, duration);
}