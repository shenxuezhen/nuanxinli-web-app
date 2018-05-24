loadJS('//cdn.bootcss.com/jquery/3.2.1/jquery.min.js', function () {
    loadJS('js/highcharts.js', function () {
        loadJS('js/exporting.js', function () {
            loadJS('js/grid-light.js', function () {
                if (browser.isAndroid) {
                    $("#container").hide();
                } else {
                    drawDISC(responseObj);
                }
            });
        })
    });
});
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
    "earnests": [],//测谎结果
    "results": [],
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
    if (conclusion[i].testIResultAnalysisList) {
        if (!conclusion[i].color) {
            conclusion[i].color = '#3f907e';
        }
        vueData.divisions.push(conclusion[i]);
    } else {
        if (conclusion[i].isLieDetector) {
            //earnest[0].isEarnest 1认真0不认真
            vueData.earnests.push(conclusion[i]);
        } else {
            if (!conclusion[i].color) {
                conclusion[i].color = '#3f907e';
            }
            vueData.results.push(conclusion[i]);
        }
    }
}
//调整二次分享
// console.dir(vueData);
// parent.wxTitle = responseObj.testD.title;
// parent.wxDesc = responseObj.testD.simpleDescr;
// parent.iframeLoadConfig();
var vm = new Vue({
    el: "#resultArrange",
    data: vueData,
    created: function () {
        $(".loading").css("display", "none");
        $("#resultArrange").css("display", "block");
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
            if (this.$data.data.testD.testCount / 10000 > 1) {
                return Math.floor(this.$data.data.testD.testCount / 10000) + '万';
            } else {
                return this.$data.data.testD.testCount;
            }
        }
    },
    methods: {
        dyeing: function (color) {
            return color.colorRgb();
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