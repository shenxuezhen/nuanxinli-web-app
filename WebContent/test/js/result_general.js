debugger;
var sid = getParam('sid');
if (sid != null && sid != 'null') {
    setCookie('sid', getParam('sid'));
}
if (!testIId) {
    var testIId = getParam('testIId');
}
if (!role) {
    var role = getParam('role');
}
var isS = getParam('isShare');
var vueData = {
    "data": {},
    "divisions": [],//维度
    "results": [],//总结果
    "earnests": [],//测谎结果
    "role": role,
    "testIId": testIId,
    "isShare": isS,
    "serviceRecommend": {
        relationList: []
    },
    "nuanApp": browser.nuanApp,
    "isShowWarmTip": !(browser.nuanApp || localStorage.getItem('company'))
};
vueData.data = responseObj;
var conclusion = responseObj.results;
for (var i = 0; i < conclusion.length; i++) {
    if (conclusion[i].divisionId) {
        vueData.divisions.push(conclusion[i]);
    } else {
        if (conclusion[i].isLieDetector) {
            vueData.earnests = conclusion[i];
        } else {
            if (!conclusion[i].color) {
                conclusion[i].color = '#3f907e';
            }
            vueData.results = conclusion[i];
        }
    }
}

console.log(vueData);
//调整二次分享
// parent.wxTitle = responseObj.testD.title;
// parent.wxDesc = responseObj.testD.simpleDescr;
// parent.iframeLoadConfig();
var vm = new Vue({
    el: "#resultGeneral",
    data: vueData,
    created: function () {
        $(".loading").css("display", "none");
        $(".general-div").css("display", "block");
        //添加关联销售
        var recommendRequestData = {
            "recomedId": this.data.testId,
            "recomedType": "test"
        };
        ajax('/public/recommend/recomed', recommendRequestData, function (resp) {
            if (resp !== null) {
                vueData.serviceRecommend.relationList = resp;
            }
        });
    },
    computed: {
        testcount: function () {
            if (this.data.testD.testCount / 10000 > 10) {
                return Math.floor(this.data.testD.testCount / 10000) + '万';
            } else {
                return this.data.testD.testCount;
            }
        }
    },
    methods: {
        isSCL:function (str) {
            str.trim();
            if(str==('中学生心理健康量表'|| '心理健康体检'|| '员工心理健康体检')){
                return true;
            }
        },
        moreThanInfo: function (data) {
            if (data >= 50) {
                return '您比' + data + '%的用户更健康哦~';
            } else {
                return (100 - data) + '%的用户比您更健康哦~';
            }
        },
        divisionWidth: function (a) {
            for (var i = 0; i < this.divisions.length; i++) {
                if (a == this.divisions[i].id) {
                    var wid = this.divisions[i].score;
                    var col = this.divisions[i].color;
                    return 'width:' + wid / (this.divisions.length ) * 15 + '%;background:' + col;
                }
            }
        },
        payBtn: function () {
            localStorage.setItem('serviceType', 'test');
            placeOrder();
        },
        shareF:function () {
            loadEnv(function () {
                shareApp();
            })
        }
    }
});
//直接显示
feelGood();
isShare(vueData);
//iOS用的 获取url的方法 客户端调用
function getShareUrl() {
    return "/warm/test/start_employee.html?testDId=" + responseObj.testD.id;
}
//iOS用的 获取TestIId的方法 客户端调用
function getTestIId() {
    return vueData.data.id;
}
//iOS用的 获取TestDId的方法 客户端调用
function getTestDId() {
    return vueData.data.testId;
}
function getPrice() {
    if (vueData.data.testDPrice) {
        return vueData.data.testDPrice.salePrice
    } else {
        return vueData.data.testD.price
    }
}
