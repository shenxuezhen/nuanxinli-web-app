var isCollect;
var id;
var recomData = {
    serviceRecommend: {
        relationList: []
    }
};
loadJS2('//cdn.staticfile.org/jquery/3.2.1/jquery.min.js', function () {
    loadJS2("/warm/js/tools.js", function () {
        loadJS2("//cdn.staticfile.org/vue/2.2.6/vue.min.js", function () {
            loadJS2("/warm/Vue/components.js", function () {
                loadJS2("/warm/js/Decimal.js", function () {
                    loadJS2("/warm/js/flexible.js", function () {
                        loadCSS2('/warm/recommendation/css/recommendation.css', function () {
                            loadEnv(function () {
                                pushToHistory(window.location.href);
                                initShareObj({
                                    title: document.title,
                                    content: '暖心理，温暖世界温暖你',
                                    shareUrl: window.location.href,
                                    iconUrl: window.location.origin + '/warm/images/logo120.png'
                                });
                                if (getParam('id') !== null) {
                                    var wid = document.body.clientWidth;
                                    var body = document.body;
                                    var recommendation = document.createElement('div');
                                    recommendation.id = 'recommendation';
                                    body.appendChild(recommendation);
                                    recommendation.style.width = wid + 'px';
                                    recommendation.style.overflow = 'hidden';
                                    recommendation.innerHTML = '<recommendation-component v-if="serviceRecommend.relationList.length>0" :item="serviceRecommend"></recommendation-component>';
                                    // recomedId: 当前页面资源的id。recomedType: 资源类型。例如: test, course, audio, sift.
                                    var recommendRequestData = {
                                        "recomedId": getParam('id'),
                                        "recomedType": "sift"
                                    };
                                    var vm = new Vue({
                                        el: "#recommendation",
                                        data: recomData,
                                        created: function () {
                                            ajax('/public/recommend/recomed', recommendRequestData, function (resp) {
                                                if (resp !== null) {
                                                    recomData.serviceRecommend = resp;
                                                }
                                            });
                                        },
                                        mounted: function () {
                                        },
                                        computed: {},
                                        methods: {}
                                    });
                                }
                                isCollect = getParam('isCollected');
                                id = getParam('id');
                                if (isCollect && id) {
                                    var body = document.body;
                                    var bottom = document.createElement('div');
                                    bottom.className = 'bottom';
                                    body.appendChild(bottom);

                                    var collection_image = document.createElement('img');
                                    collection_image.className = 'collection_image';
                                    collection_image.src = '/warm/images/magazine/collection_cancel.png';
                                    bottom.appendChild(collection_image);

                                    var collection_text = document.createElement('div');
                                    collection_text.className = 'collection_text';
                                    collection_text.innerHTML = '点击收藏';
                                    bottom.appendChild(collection_text);


                                    // 解决关于点击有自身关联的收藏时的问题。
                                    var url = '/public/sift/' + id;
                                    ajax(url, null, function (resp) {
                                        isCollect = resp.isCollected;
                                        if (isCollect == 0) {
                                            collection_image.src = '/warm/images/magazine/collection_cancel.png';
                                            collection_text.innerHTML = '点击收藏';
                                        }
                                        else {
                                            collection_image.src = '/warm/images/magazine/collection_selected.png';
                                            collection_text.innerHTML = '收藏成功';
                                        }
                                        initShareObj({
                                            title: resp.title,
                                            content: resp.descr,
                                            shareUrl: window.location.href,
                                            iconUrl: window.location.origin + resp.image
                                        });
                                    });
                                    collection_image.onclick = function () {
                                        var obj;
                                        if (isCollect == 0) {
                                            collection_text.style.color = "#393932";
                                            collection_image.src = '/warm/images/magazine/collection_selected.png';
                                            collection_text.innerHTML = '收藏成功';
                                            collection_image.className = 'animateName';
                                            obj = {'isCollected': 1};
                                        } else {
                                            collection_text.style.color = "#B1AFAE";
                                            collection_image.src = '/warm/images/magazine/collection_cancel.png';
                                            collection_text.innerHTML = '点击收藏';
                                            collection_image.className = 'collection_image';
                                            obj = {'isCollected': 0};
                                        }
                                        ajax('/public/sift/' + id + '/collect', obj, function (resp) {
                                            console.log(resp);
                                            if (isCollect == 0) {
                                                isCollect = 1;
                                            }
                                            else {
                                                isCollect = 0;
                                            }
                                        }, '获取类型列表：');
                                    }
                                }
                            }, function () {
                                popToHistory(window.location.href)
                            }, null, 0);
                        });
                    });
                });
            });
        });
    });
});

/*loadJS2("/warm/js/tools.js", function () {
 loadJS2('//cdn.bootcss.com/jquery/3.2.1/jquery.min.js', function () {
 });
 });*/
//控制加载外部文件顺序
function loadJS2(url, success) {
    var domScript = document.createElement('script');
    domScript.src = url;
    success = success || function () {
        };
    domScript.onload = function () {
        success();
    };
    document.getElementsByTagName('head')[0].appendChild(domScript);
}
function loadCSS2(url, success) {
    var domSytle = document.createElement('link');
    domSytle.href = url;
    domSytle.rel = "stylesheet";
    success = success || function () {
        };
    domSytle.onload = function () {
        success();
    };
    document.getElementsByTagName('head')[0].appendChild(domSytle);
}
