var sid = getParam('sid');
if (sid != null && sid != 'null') {
    setCookie('sid', getParam('sid'));
}
if (!role) {
    var role = getParam('role');
}
if (!testIId) {
    var testIId = getParam('testIId');
}
var isS = getParam('isShare');
var vueData = {
    "data": "",
    "isShare": isS,
    "testIId": testIId,
    "role": role,
    "earnests": '',
    "serviceRecommend": {
        relationList: []
    },
    "nuanApp": browser.nuanApp == undefined,
    "isShowWarmTip": !(browser.nuanApp || localStorage.getItem('company'))
};
vueData.data = responseObj;
//调整二次分享
// parent.wxTitle = responseObj.testD.title;
// parent.wxDesc = responseObj.testD.simpleDescr;
// parent.iframeLoadConfig();
var vm = new Vue({
    el: "#resultMBTI",
    data: vueData,
    created: function () {
        $(".loading").css("display", "none");
        $("#resultMBTI").css("display", "block");
        //添加关联销售
        var recommendRequestData = {
            "recomedId": this.data.testId,
            "recomedType": "test"
        };
        ajax('/public/recommend/recomed', recommendRequestData, function (resp) {
            if (resp !== null) {
                vueData.serviceRecommend = resp;
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
        },
        testDescr: function () {
            return '<p>' + this.data.testD.descr.replace(/\n/g, '<br>') + '</p>';
        },
        hrColor: function () {
            var color = this.data.results[0].color ? this.data.results[0].color : '#3f907e';
            console.log(color);
            return 'background:' + color + ';border:' + color
        },
        titleBgColor: function () {
            var color = this.data.results[0].color ? this.data.results[0].color : '#3f907e';
            return 'background:' + color + ';color:' + color
        },
        titleTextColor: function () {
            var color = this.data.results[0].color ? this.data.results[0].color : '#3f907e';
            return 'background:' + color
        }
    },
    methods: {
        dyeing: function (color) {
            return color.colorRgb();
        },
        divisionLeftWidth: function (division) {
            if (division[0].score == 0) {
                return 'display:none';
            }
            var wid = division[0].score / (division[0].score + division[1].score) * 100 - 2;
            return 'width:' + wid + '%;background:' + division[0].color;
        },
        divisionRightWidth: function (division) {
            if (division[1].score == 0) {
                return 'display:none';
            }
            var wid = division[1].score / (division[0].score + division[1].score) * 100 - 2;
            return 'width:' + wid + '%;background:' + division[1].color;
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
feelGood();
function stretch() {
    $(".stretch").hide();
    $(".test-result-describe").show();
    $(".test-result-dimension").show();
}
//ios用的 获取分享的url
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
//iOS用的 获取getPrice的方法 客户端调用
function getPrice() {
    if (vueData.data.testDPrice) {
        return vueData.data.testDPrice.salePrice
    } else {
        return vueData.data.testD.price
    }
}