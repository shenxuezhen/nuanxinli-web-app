if (browser.alipay || browser.taobao) {
    alert('暂不支持支付宝、淘宝（安卓版）做测评，请使用其他浏览器');
}
var code = getParam('code');
loadEnv(function () {
    if (getParam('isTest')==0) {
        $('#inter-test').empty();
        $('#inter-test').hide();
        new Vue(createVue(""));
    } else {
        getTestDId();
    }
}, null, null, null);
function getTestDId() {
    ajax('/public/test-d/' + getParam('testDId'), null, function (resp) {
        var vm = new Vue(createVue(resp))
    });
}
function createVue(data) {
    return {
        el: "#start-employee",
        data: data,
        created: function () {
            $(".loading").css("display", "none");
            $("#start_normal").css("display", "block");
            ajaxPOST('/public/user/v2/verification/image','POST',null,function (resp) {
                $('#graphic').attr('src',resp.image)
            },'获取图形验证码失败');
        },
        computed: {},
        methods: {
            getCaptchaImg:function () {
                ajaxPOST('/public/user/v2/verification/image','POST','',function (resp) {
                    $('#graphic').attr('src',resp.image)
                },'获取图文验证码失败');
            },
            getCaptcha: function () {
                var cellPhone=$("#cellphone")[0].value;
                var graphValidate=$('#graphValidate')[0].value;
                if(!cellPhone){
                    $("#warn1").html("手机号不能为空").show();
                    setTimeout(function () {
                        $("#warn1").hide();
                    }, 1000);
                    return;
                }
                var reg1=/^\d+$/g;
                if(!reg1.test(cellPhone)){
                    $("#warn1").html("手机号为纯数字").show();
                    setTimeout(function () {
                        $("#warn1").hide();
                    }, 1000);
                    return;
                };
                var reg2=/^1[3|4|5|6|7|8|9]\d{9}$/g;
                if(!reg2.test(cellPhone)){
                    $("#warn1").html("请输入有效手机号").show();
                    setTimeout(function () {
                        $("#warn1").hide();
                    }, 1000);
                    return;
                }
                if(graphValidate==''){
                    $("#warn3").html("图形验证码不能为空").show();
                    setTimeout(function () {
                        $("#warn3").hide();
                    }, 1000);
                    return;
                }
                ajax('/public/user/v2/verification/web-check', {
                    "cellPhone": cellPhone,
                    "imageVerify":graphValidate
                }, function (resp) {
                    var captcha = $(".captcha");
                    captcha.css('borderColor', '#dcdcdc');
                    captcha.css('color', '#81807E');
                    var num = 60;
                    captcha.text(num + 's');
                    var timer1 = setInterval(function () {
                        $(".captcha").unbind(this.getCaptcha);
                        num--;
                        captcha.text(num + 's');
                        if (num < 1) {
                            captcha.css('borderColor', '#FCAB55');
                            captcha.css('color', '#FCAB55');
                            captcha.text('验证码');
                            clearInterval(timer1);
                            $(".captcha").bind(this.getCaptcha);
                        }
                    }, 1000);
                },null,function (status, text) {
                    $("#warn3").html(text).show();
                    setTimeout(function () {
                        $("#warn3").hide();
                    }, 1000);
                    if(status=='803'){
                        ajaxPOST('/public/user/v2/verification/image','POST',null,function (resp) {
                            $('#graphic').attr('src',resp.image)
                        },'获取图形验证码失败');
                    }
                });
            },
            nextClick: function () {
                var isTest = getParam('isTest');
                ajax('/public/user/v2/verification/check-user', {
                    "cellPhone": $("#cellphone")[0].value,
                    "content": $("#seccode")[0].value,
                    "source": isTest ? 'H5Test':'H5'
                }, function (resp, status, xhr) {
                    var headers = xhr.getAllResponseHeaders();
                    headers.split('\r\n').forEach(function (value) {
                        if (value.indexOf('sid: ') > -1) {
                            if (value.indexOf('=')) {
                                localStorage.setItem('sid', value.slice(value.indexOf('=') + 1));
                                //TODO: 究竟是不同环境有不同页面还是...
                                if (isTest==0) {
                                    window.location.href = '/warm/home/home.html?isEntry=0';
                                } else {
                                    $("#start-employee").load('start_normal.html');
                                }
                                return false;
                            }
                        }
                    });
                }, null, function () {
                    $("#warn2").show().html(XMLHttpRequest.text);
                    setTimeout(function () {
                        $("#warn2").hide();
                    }, 2000);
                });
            },
            tested: function () {
                $(".warningBox").show();
                $(".warning").show();
                var windowW = document.documentElement.clientWidth;
                var windowH = document.documentElement.clientHeight;
                $(".warningBox").css('width', windowW);
                $(".warningBox").css('height', windowH);
                $(".warningBox").addClass('warningBoxPosition');
                $("#down-warm-app").on('touchstart', function () {
                    var downA = document.getElementById('down-warm-app');
                    if (browser.ios) {
                        if (browser.weixin) {
                            downA.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.chocolate.warmapp&g_f=991653';
                        } else {
                            downA.href = 'https://itunes.apple.com/us/app/nuan-xin-li/id983939376';
                        }
                    } else {
                        if (browser.weixin) {
                            downA.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.chocolate.warmapp&g_f=991653';
                        } else {
                            downA.href = 'http://app.nuanxinli.com/warm/WarmApp.apk';
                        }
                    }
                });
                $("#close-down").on('touchstart', function () {
                    $(".warningBox").hide();
                    $(".warning").hide();
                })
            }
        }
    }
}