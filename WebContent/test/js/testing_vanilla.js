//setCookie('sid', getParam('sid'));
var questionIndex = 0;//当前测评题
var questions,//测评题
    choiceList;//测评题答案
var createTime = getCurrentTime();//获取当前时间
var testIId;
var isOnce;
if (!needUserInfo) {
    var needUserInfo = null;
}
doubleClick();
var vueData;
//区分扫码还是app打开的本页面。1：扫码；0：app，缺省是0
$.ajax({
    url: '/public/test-d/' + getParam("testDId"),
    async: true,
    type: 'GET',
    dataType: 'json',
    ContentType: 'application/json',
    success: function (res) {
        questions = res.questions;//测评题列表
        generalChoices = res.choices;
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
        res.questions = null;
        res.choices = null;
        vueData = {
            "el": '#testing',
            data: {
                "testObj": res,
                "questionIndex": questionIndex,
                "question": questions[questionIndex],
                "questionLength": questions.length
            },
            created: function () {
                $(".loading").css("display", "none");
                $("#testing").css("display", "block");
            },
            methods: {
                onSelectChoice: function (choiceIndex) {
                    var oneTest = this.question;
                    if (oneTest.type == "single" || oneTest.type == "lie") {
                        for (var i = 0; i < oneTest.choices.length; i++) {
                            var choice = oneTest.choices[i];
                            choice.checked = (i === choiceIndex) ? true : false;
                        }
                        if (this.isSelect() && (this.questionIndex < this.questionLength - 1)) {
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
                            "role":role
                        },
                        "companyId": getParam('companyId')
                    } : {
                        "testId": this.testObj.id,
                        "createTime": createTime,
                        "endTime": getCurrentTime(),
                        "answers": answers
                    };
                    postAnswers(paramObj, isOnce);
                }
            }
        };
        vue = new Vue(vueData);
    }
});
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
    $.ajax({
        url: '/public/test-i/create',
        type: 'POST',
        dataType: "json",
        contentType:"application/json",
        data: JSON.stringify(paramObj),
        async: true,
        success: function (data) {
            testIId = data.id;
            if (browser.ios) {
                $("#iosIfram").attr('src', "changeTitleAndHiddenButton");
            } else {
                if (window.appInterface) {
                    window.appInterface.changeTitle();
                }
            }
            $("#testing").load('result_vanilla_agent.html');
        },
        error: function (XMLHttpRequest, textStatus) {
            alert(XMLHttpRequest.responseText);
        }
    });
}

function onTouchStart(event) {
    event.target.style.background = '#3F907E';
    event.target.style.color = '#ffffff';
}

function onTouchEnd(event) {
    event.target.style.background = '#ffffff';
    event.target.style.color = '#393932';
}
