//setCookie('sid', getParam('sid'));
loadEnv(function () {
        $('.test-btn-pay').css('background',buttonColor());
    }, function () {
        if (window.confirm('现在返回将不会保存之前的答案确定返回吗？')) {
            //确定
            popToHistory(window.location.href);
            return true;
        } else {
            //取消
            return false;
        }
    },
    {
        "type": "menu",
        "hide": false,
        "item": [
            {
                "text": "分享",
                "onClick": "share();"
            }
        ]
    });
var questionIndex = 0;//当前测评题
var questions,//测评题
    choiceList;//测评题答案
var createTime = getCurrentTime();//获取当前时间
var testIId;
var isOnce;
var isMove;
if (!needUserInfo) {
    var needUserInfo = null;
}
doubleClick();
var vueData;
//区分扫码还是app打开的本页面。1：扫码；0：app，缺省是0
if (!needUserInfo)var needUserInfo = null;
var url = needUserInfo ? '/public/test-d/' + testDId : '/public/test-d/service/' + testDId;
ajax(url, null, function (resp) {
    questions = resp.questions;//测评题列表
    generalChoices = resp.choices;
    for (var i = 0; i < questions.length; i++) {
        var question = questions[i];
        if (question.type == 'descr')continue;
        if (!question.choices) {
            question.choices = [];
            for (var j = 0; j < generalChoices.length; j++) {
                var generalChoice = generalChoices[j];
                var choice = {};
                $.extend(choice, generalChoice);
                question.choices.push(choice);
            }
        }
        for (var j = 0; j < question.choices.length; j++) {
            var choice = question.choices[j];
            choice.checked = false;
        }
    }
    resp.questions = null;
    resp.choices = null;
    initShareObj({
        title: resp.title,
        content: resp.descr,
        iconUrl: window.location.origin + resp.img,
        shareUrl: window.location.origin + '/warm/test/start_employee.html?testDId=' + resp.id
    });
    vue = new Vue(createVue(resp));
});
function createVue(resp) {
    return vueData = {
        "el": '#testing',
        data: {
            "testObj": resp,
            "questionIndex": questionIndex,
            "question": questions[questionIndex],
            "questionLength": questions.length
        },
        created: function () {
            $(".loading").css("display", "none");
            $("#testing").css("display", "block");
        },
        computed: {
            salePrice: function () {
                if (this.$data.testObj.isSalePrice && this.$data.testObj.isSalePrice == 1) {
                    return this.$data.testObj.testDPrice.salePrice;
                } else {
                    return this.$data.testObj.price;
                }
            },
            validDays: function () {
                if (this.$data.testObj.isSalePrice && this.$data.testObj.isSalePrice == 1) {
                    return this.$data.testObj.testDPrice.validDays;
                } else {
                    return this.$data.testObj.validDays;
                }
            }
        },
        methods: {
            onSelectChoice: function (choiceIndex) {
                if (isMove)return;
                var oneTest = this.question;
                if (oneTest.type == "single" || oneTest.type == "lie") {
                    for (var i = 0; i < oneTest.choices.length; i++) {
                        var choice = oneTest.choices[i];
                        choice.checked = (i === choiceIndex) ? true : false;
                    }
                    if (this.isSelect() && (this.questionIndex < this.questionLength - 1) && !isMove) {
                        this.next();
                    }
                } else {
                    oneTest.choices[choiceIndex].checked = !oneTest.choices[choiceIndex].checked;
                }
            },
            showProgress: function () {
                return ((this.questionIndex + 1) / this.questionLength) * 100 + '%';
            },
            showPlane: function () {
                var left = (this.questionIndex / this.questionLength) * 100 - 2 + '%';
                return left;
            },
            next: function () {
                if (!this.isSelect()) {
                    return;
                }
                var index = this.questionIndex;
                index++;
                this.questionIndex = index;
                this.question = questions[index];
                if (!this.question.choices) {
                    this.question.choices = choiceList
                }
            },
            prev: function () {
                var index = this.questionIndex;
                if (index == 0) {
                    setTimeout(function () {
                        $("#hint").hide();
                        $("#hint").text('请选择答案');
                    }, 3000);
                    return;
                }
                index--;
                this.questionIndex = index;
                this.question = questions[index];
                if (!this.question.choices) {
                    this.question.choices = choiceList
                }
            },
            isSelect: function () {
                var choices = this.question.choices;
                var type = this.question.type;
                if (type == "descr") {
                    return true;
                }
                for (var i = 0; i < choices.length; i++) {
                    var choice = choices[i];
                    if (choice.checked) {
                        return true;
                    }
                }
                setTimeout(function () {
                    hint.style.display = "none";
                }, 1000);
                hint.style.display = "block";
                return false;
            },
            normalSubmit: function () {
                localStorage.setItem('testTime', 'testAfter');
                $('#submit').css('background', '#b1afae').css('border', '1px solid #b1afae');
                if (!this.isSelect()) {
                    return isOnce = false;
                }
                if (isOnce)return;
                vue.$off(event, 'normalSubmit');
                var answers = [];
                for (var i = 0; i < questions.length; i++) {
                    var question = questions[i];
                    if (question.type == 'descr') {
                        continue;
                    }
                    var answer = {};
                    answer.questionId = question.id;
                    var choices = '';
                    for (var j = 0; j < question.choices.length; j++) {
                        var choice = question.choices[j];
                        if (choice.checked) {
                            if (choices.length > 0) {
                                choices += ',' + choice.id;
                            } else {
                                choices += choice.id;
                            }
                        }
                    }
                    answer.choices = choices;
                    answers.push(answer);
                }
                var paramObj = needUserInfo ? {
                    "testId": this.testObj.id,
                    "createTime": createTime,
                    "endTime": getCurrentTime(),
                    "answers": answers,
                    "user": {
                        "alias": username,
                        "cellPhone": tel,
                        "role": role
                    },
                    "companyId": getParam('companyId')
                } : {
                    "testId": this.testObj.id,
                    "createTime": createTime,
                    "endTime": getCurrentTime(),
                    "answers": answers
                };
                postAnswers(paramObj, isOnce);
            },
            closePromotion: function () {
                $('#test-select-pay').hide();
                $('#shade').hide();
            },
            getOrder: function (customerIsOrg) {//点击支付
                var that = this;
                localStorage.setItem('orderTotalPrice', (this.testObj.isSalePrice && this.testObj.isSalePrice == 1) ? this.testObj.testDPrice.salePrice : this.testObj.price);
                loadEnv(function () {
                    finishedToPay({
                        'type': 'test',
                        'po': {
                            'testIId': testIId,
                            'testDId': that.testObj.id,
                            'price': (that.testObj.isSalePrice && that.testObj.isSalePrice==1)  ? that.testObj.testDPrice.salePrice : that.testObj.price
                        }
                    }, customerIsOrg);
                });
            },
            price: function (str) {
                return transitionPrice(str);
            }
        }
    }
};
//选项是否是图片
function isImageChoice(question) {
    if (question.choices && question.choices[0].img) {
        return true;
    }
    return false;
}

//根据问题id找问题
function findQuestion(questionId) {
    var question = null;
    for (var i = 0; i < questions.length; i++) {
        if (questions[i].id == questionId) {
            question = questions[i];
        }
    }
    return question;
}

//判断是否跳题
function isJump(choice) {
    var str = "";//三种情况：1.false不跳题2.answer跳到答案3.id跳转问题的id
    var jumpToType = "";
    if (choice.jumpToType) {
        jumpToType = choice.jumpToType;
    }
    if ("Answer" == jumpToType) {
        str = "answer";
    } else if ("Question" == jumpToType) {
        str = choice.jumpTo;
    } else {
        str = "false";
    }
    return str;
}

//处理答案
function postAnswers(paramObj) {
    isOnce = true;
    var sid = getParam('sid');//页面的sid
    if (sid != null && sid != 'null') {
        setCookie('sid', sid);
    }
    ajax('/public/test-i/create', paramObj, function (resp) {
        testIId = resp.id;
        localStorage.setItem('testIId', testIId);
        if (resp.isValid == 1) {//已经支付
            loadEnv(function () {
                testState({"stateCode": "test_result", "stateDesc": "测评结束"});
            });
            $("#testing").load('result_agent.html');
        } else if (resp.isValid == 0) {
            if (testIRule=='team') {
                $("#testing").load('result_agent.html');
            } else {
                loadEnv(function () {
                    testState({"stateCode": "test_result", "stateDesc": "测评结束"});
                });
                $('#test-select-pay').show();
                $('#shade').show();
                window.scroll(0, 0);
                document.body.style.overflow = 'hidden';
            }
        }
    });
}

function onTouchStart(event) {
    event.target.style.background = '#3F907E';
    event.target.style.color = '#ffffff';
    return isMove = false;
}

function onTouchMove(ele) {
    return isMove = ele;
}

function onTouchEnd(event) {
    event.target.style.background = '#ffffff';
    event.target.style.color = '#393932';
}