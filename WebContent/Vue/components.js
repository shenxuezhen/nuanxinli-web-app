Vue.component('myComponent', {
    props: ["item"],
    template: '<li class="test-list-test-card" v-on:click="startTest(item.id,item.title)">' +
    '<div>' +
    '<img :src="item.img">' +
    '<p class="test-list-fs-2-640" v-if="item.payState==1">已购买</p>' +
    '</div>' +
    '<article>' +
    '<p class="test-list-fs-3-640">{{item.title}}</p>' +
    '<p class="test-list-fs-4-640">{{item.simpleDescr}}</p>' +
    '<p class="test-list-test-other-info">' +
    '<span class="test-list-fs-5-640">' +
    '<img src="../images/test/test_persons.png">&nbsp;' +
    '<span>{{item.testCountVirtual}}</span>&nbsp;&nbsp;&nbsp;&nbsp;' +
    '<img v-if="item.remValidDays" src="../images/test/test_daojishi.png">&nbsp;' +
    '<span>{{item.remValidDays?item.remValidDays:""}}</span>' +
    '</span>' +
    '<span class="test-list-fs-5-640">' +
    '<span style="text-decoration:line-through" v-if="item.showPrice">{{price(item.showPrice)}}</span>&nbsp;&nbsp;' +
    '<span class="test-list-fs-6-640">{{price(item.isSalePrice===1?item.testDPrice.salePrice:item.price)}}' +
    '</span>' +
    '</span>' +
    '</p>' +
    '</article>' +
    '</li>',
    methods: {
        startTest: function (index, title) {
            $('.warm-shade').css('width', document.documentElement.clientWidth).css('height', document.documentElement.clientHeight).css('position', 'absolute').css('left', '0');
            zhuge.track('测评card点击', {
                '测评名称': title
            });
            window.location.href = '/warm/test/start_normal.html?testDId=' + index;
        },
        price: function (str) {
            return transitionPrice(str);
        }
    }
});
Vue.component('magazineComponent', {
    props: ["item"],
    template: '<div class="magazine-list-magazine-content" v-on:click="magazineDeatilClick(item.detailUrl,item.content,item.id,1)">' +
    '<div v-if="item.typeName==\'箴言\'" class="magazine-list-admonition-card">' +
    '<div class="magazine-list-magazine-header">' +
    '<span class="magazine-list-magazine-tag" v-if="item.partName"><span>{{item.partName}}</span></span>' +
    '<span v-else><span></span></span>' +
    '<span class="magazine-list-date">{{magazineTime}}</span>' +
    '</div>' +
    '<div class="magazine-list-admonition-icon">' +
    '<img src="../images/magazine/biaoqqian_bj.png">' +
    '<p>{{item.typeName}}</p>' +
    '<div class="magazine-list-admonition-tag"><img v-bind:src="item.image"></div>' +
    '</div>' +
    '<p class="magazine-list-admonition-title">{{item.title}}</p>' +
    '<div class="magazine-list-hot"><img src="../images/magazine/redu.png"><span>{{item.hotrank}}</span></div>' +
    '</div>' +
    '<div v-if="item.typeName!=\'箴言\'" class="magazine-list-magazine-card">' +
    '<div class="magazine-list-magazine-header">' +
    '<span class="magazine-list-magazine-tag" v-if="item.partName"><span>{{item.partName}}</span></span>' +
    '<span v-else><span></span></span>' +
    '<span class="magazine-list-date">{{magazineTime}}</span>' +
    '</div>' +
    '<div class="magazine-list-magazine-body">' +
    '<div class="magazine-list-magazine-text">' +
    '<p style="color: #393932">{{item.typeName}} | {{item.title}}</p>' +
    '<div class="magazine-list-hot"><img src="../images/magazine/redu.png"><span>{{item.hotrank}}</span></div>' +
    '</div>' +
    '<div class="magazine-list-magazine-img"><img v-bind:src="item.image"></div>' +
    '</div>' +
    '</div>' +
    '</div>',
    computed: {
        magazineTime: function () {
            var str = this.item.postTime;
            var ary = str.substr(0, str.indexOf(' ')).split(/\-/ig);
            var createTime = '';
            for (var i = 0; i < ary.length; i++) {
                if (i == 0) {
                    createTime += ary[0] + '年';
                } else if (i == 1) {
                    createTime += ary[1] + '月';
                } else if (i == 2) {
                    createTime += ary[2] + '日';
                }
            }
            return createTime;
        }
    },
    methods: {
        magazineDeatilClick: function (detailUrl, content, id, isCollected) {
            var url;
            if (detailUrl) {
                url = detailUrl + "?id=" + id + '&isCollected=' + isCollected;
                window.location.href = url;
            } else {
                url = content;
                if (url.indexOf('/resource/sift/article/') > -1) {
                    window.location.href = url + "?id=" + id + '&isCollected=' + isCollected;
                } else {
                    window.location.href = '/warm/magazine/third_detail.html?url=' + encodeURIComponent(url);
                }
            }
        }
    }
});
Vue.component('audioComponent', {
    props: ["item"],
    template: '<div class="audio-list-cell" v-on:click="audioDetailClick(item.id,item.title)">' +
    '<div class="audio-list-audioDiv">' +
    '<img class="audio-list-audioImg" v-bind:src="item.image" alt="">' +
    '<img class="audio-list-spImg"  src="../images/audio/pausebutton_small.png" alt="">' +
    '</div>' +
    '<div class="audio-list-title">{{item.title}}</div>' +
    '<div class="audio-list-content">{{item.descr}}</div>' +
    '</div>',
    methods: {
        audioDetailClick: function (id, title) {
            var url = "/warm/audio/audio_detail.html" + "?id=" + id + '&title=' + title;
            window.location.href = url;
        }
    }
});
Vue.component('bbsComponent', {
    props: ["item"],
    template: '<div class="bbs-list-cell"  v-on:click="bbsDetailClick(item.id)">' +
    '<img v-if="item.isAnonymous==1" class="bbs-list-userPhoto" :src="nimingHeader(item.isAnonymous)">' +
    '<img v-else class="bbs-list-userPhoto" v-bind:src="item.userPhoto" alt="">' +
    '<div class="bbs-list-userName">{{item.userAlias}}</div>' +
    '<div class="bbs-list-typeDiv">' +
    '<div class="bbs-list-color"></div>' +
    '<div class="bbs-list-text">{{item.partName}}</div>' +
    '</div>' +
    '<div class="bbs-list-title">{{item.title}}</div>' +
    '<div class="bbs-list-content">{{item.content}}</div>' +
    '<div class="bbs-list-bottom">' +
    '<div class="bbs-list-time">{{deleteSecondTime(item.createTime)}}</div>' +
    '<div class="bbs-list-rank">' +
    '<img class="bbs-list-rankimge" src="../images/bbs/Seen.png" alt="">' +
    '<div class="bbs-list-ranktext">{{item.hotrank}}</div>' +
    '<img class="bbs-list-rankimge" src="../images/bbs/comment_gray.png" alt="">' +
    '<div class="bbs-list-ranktext">{{item.replyCount}}</div>' +
    '</div>' +
    '</div>' +
    '</div>',
    methods: {
        nimingHeader: function (value) {
            if (value === 1) {
                return bbsNiming();
            }
        },
        bbsDetailClick: function (id) {
            var url = "../bbs/bbs_revert.html" + "?postId=" + id;
            window.location.href = url;
        },
        deleteSecondTime: function (time) {
            subTime(time);
        }
    }
});
Vue.component('course-list', {
    props: ["item"],
    template: '<li class="course-list-course-card" v-on:click="courseDetailClick(item)">' +
    '<div class="course-list-course-card-top">' +
    '<div class="course-list-course-card-top-left">' +
    '<img class="course-list-course-cover" :src="item.cover">' +
    '<div class="course-list-hasBuy" v-show="item.hasBuyCode===1">' +
    '<span>{{item.hasBuyDescr}}</span>' +
    '</div>' +
    '<img class="course-list-play-img" src="../images/audio/pausebutton_small.png">' +
    '</div>' +
    '<div class="course-list-course-card-top-right">' +
    '<div class="course-list-course-name">{{item.name}}</div>' +
    '<div class="course-list-course-description course-list-ellipsis"><span v-html="item.description"></span></div>' +
    '</div>' +
    '</div>' +
    '<div class="course-list-course-card-bottom">' +
    '<span class="course-list-course-card-bottom-duration">' +
    '<span v-if="item.isSeries===1">系列 · 共{{item.itemAmount}}节</span>' +
    '<span v-if="item.isSeries===0">单节 · 时长: {{item.durationStr}}</span>' +
    '</span>' +
    '<span>' +
    '<img class="course-list-img-days" v-if="item.isFee===1 && item.hasBuyCode===1" src="../images/checked.png">' +
    '<span class="course-list-course-card-bottom-days" v-if="item.isFee===1 && item.hasBuyCode===1">{{item.countDown}}天</span>' +
    '<span class="course-list-course-card-bottom-price" v-if="item.isFee===1">{{price(item.salePrice)}}/{{item.priceUnit}}</span>' +
    '<span class="course-list-course-card-bottom-price" v-if="item.isFee===0">免费</span>' +
    '</span>' +
    '</div>' +
    '</li>',
    methods: {
        courseDetailClick: function (item) {
            var detailUrl = "/warm/course/course_detail.html?courseId=" + item.id;
            var ownUrl = "/warm/course/course_own.html?courseId=" + item.id;
            var playUrl;
            if (item.isSeries === 0) {
                playUrl = '/warm/course/course_play.html?courseId=' + item.id + '&itemId=' + item.items[0].id;
            }
            if (item.isSeries === 1) {
                if (item.isFee === 1) {
                    if (item.hasBuyCode === 1) {
                        window.location.href = ownUrl;
                    } else if (item.hasBuyCode === 0) {
                        window.location.href = detailUrl;
                    } else {
                        console.error('数据异常。课程hasBuyCode的值应该是0或者1。');
                    }
                } else if (item.isFee === 0) {
                    window.location.href = detailUrl;
                } else {
                    console.error('数据异常。课程isFee的值应该是0或者1。');
                }
            } else if (item.isSeries === 0) {
                if (item.isFee === 1) {
                    if (item.hasBuyCode === 1) {
                        window.location.href = playUrl;
                    } else if (item.hasBuyCode === 0) {
                        window.location.href = detailUrl;
                    } else {
                        console.error('数据异常。课程hasBuyCode的值应该是0或者1。');
                    }
                } else if (item.isFee === 0) {
                    window.location.href = playUrl;
                } else {
                    console.error('数据异常。课程isFee的值应该是0或者1。');
                }
            } else {
                console.error('数据异常。课程isSeries的值应该是0或者1。');
            }
        },
        price: function (str) {
            return transitionPrice(str);
        }
    }
});
Vue.component('menu-list', {
    props: ["item", "index"],
    template: '<li class="pure-menu-item" v-on:click="itemListClick(item.code, index)" :list-type="index">' +
    '<a class="pure-menu-link">{{item.name}}</a>' +
    '<span class="pure-menu-item-span">' +
    '</li>',
    methods: {
        itemListClick: function (type, no) {
            var listType = $("ul[class='pure-menu-list'] li:eq(" + no + ")").attr("list-type");
            listType = +listType;
            if (listType !== currIndex) {
                $("ul[class='pure-menu-list'] li > a").removeClass("pure-menu-link-white");
                $("ul[class='pure-menu-list'] li > span").removeClass("under-line-black");
                $("ul[class='pure-menu-list'] li:eq(" + no + ") > a").addClass("pure-menu-link-white");
                $("ul[class='pure-menu-list'] li:eq(" + no + ") > span").addClass("under-line-black");
                $('.top').css('position', 'fixed');
                $('.pure-menu').css('top', '5.5rem');
                $('.content').css('top', 0);
                $('.minirefresh-wrap').css('top', '6.9rem');
                if (type !== 'bbs') {
                    $('.per-head-portrait').hide();
                } else if (type === 'bbs') {
                    $(".per-head-portrait").fadeIn("slow");
                }
                postDataForCategoryList.content = type;

                document.querySelector('#minirefresh' + currIndex).classList.add(CLASS_HIDDEN);
                document.querySelector('#minirefresh' + listType).classList.remove(CLASS_HIDDEN);

                currIndex = listType;

                if (!miniRefreshArr[currIndex]) {
                    initMiniRefreshs(currIndex);
                }
            }
        }
    }
});
Vue.component('collect-component', {
    props: ["item"],
    template: '<div class="magazine-list-magazine-content" v-on:click="magazineDeatilClick(item.detailUrl,item.content,item.siftId,1)">' +
    '<div v-if="item.typeName==\'箴言\'" class="magazine-list-admonition-card">' +
    '<div class="magazine-list-magazine-header">' +
    '<span class="magazine-list-magazine-tag" v-if="item.partName"><span>{{item.partName}}</span></span>' +
    '<span v-else><span></span></span>' +
    '<span class="magazine-list-date">{{item.collectTime}}</span>' +
    '</div>' +
    '<div class="magazine-list-admonition-icon">' +
    '<img src="../images/magazine/biaoqqian_bj.png">' +
    '<p>{{item.typeName}}</p>' +
    '<div class="magazine-list-admonition-tag"><img v-bind:src="item.image"></div>' +
    '</div>' +
    '<p class="magazine-list-admonition-title">{{item.title}}</p>' +
    '<div class="collect-button-div">' +
    '<img class="collect-button-delete" src="../images/magazine/collectionDelete.png" v-on:click="deleteClick(item.siftId,event)">' +
    '<img class="collect-button-share" src="../images/magazine/pinkshare.png" v-on:click="shareClick(event)">' +
    '</div>' +
    '</div>' +
    '<div v-if="item.typeName!=\'箴言\'" class="magazine-list-magazine-card">' +
    '<div class="magazine-list-magazine-header">' +
    '<span class="magazine-list-magazine-tag" v-if="item.partName"><span>{{item.partName}}</span></span>' +
    '<span v-else><span></span></span>' +
    '<span class="magazine-list-date">{{deleteSecondTime(item.collectTime)}}</span>' +
    '</div>' +
    '<div class="magazine-list-magazine-body">' +
    '<div class="magazine-list-magazine-text">' +
    '<p style="color: #393932">{{item.typeName}} | {{item.title}}</p>' +
    '<div class="collect-button-div">' +
    '<img class="collect-button-delete" src="../images/magazine/collectionDelete.png" v-on:click="deleteClick(item.siftId,event)">' +
    '<img class="collect-button-share" src="../images/magazine/pinkshare.png" v-on:click="shareClick(event)">' +
    '</div>' +
    '</div>' +
    '<div class="magazine-list-magazine-img"><img v-bind:src="item.image"></div>' +
    '</div>' +
    '</div>' +
    '</div>',
    methods: {
        shareClick: function () {
            stopBubbling(event);
            Toast('分享功能暂未开放！', 2000);
        },
        deleteClick: function (id, event) {
            stopBubbling(event);
            $().showAlert("确定要删除吗？", function () {
                var obj = {'isCollected': 0};
                ajax('/public/sift/' + id + '/collect', obj, function (resp) {
                    console.log(resp);
                    lastId = null;
                    Toast('删除成功！', 2000);
                    getCollectList(collectUrl, 1);
                }, '获取类型列表：');
            }, true);
        },
        magazineDeatilClick: function (detailUrl, content, id, isCollected) {
            var url;
            if (detailUrl) {
                url = detailUrl + "?id=" + id + '&isCollected=' + isCollected;
                window.location.href = url;
            } else {
                url = content;
                if (url.indexOf('/resource/sift/article/') > -1) {
                    window.location.href = url + "?id=" + id + '&isCollected=' + isCollected;
                } else {
                    window.location.href = '/warm/magazine/third_detail.html?url=' + encodeURIComponent(url);
                }
            }
        },
        deleteSecondTime: function (time) {
            time = time.slice(0, time.length - 3);
            return time;
        }
    }
});
Vue.component('recommendation-component', {
    props: ["item"],
    template: '<div class="recommendation">' +
    '<div class="recommendation-head"><span class="recommendation-head-span">您可能需要</span><hr class="recommendation-head-hr"></div>' +
    '<div class="recommendation-content">' +
    '<ul class="recommendation-content-ul">' +
    '<li class="recommendation-content-li" v-for="recom in item.relationList" v-on:click="recommendationDetailClick(recom)">' +
    '<div class="recommendation-content-li-left">' +
    '<img v-if="recom.recomData.image" class="recommendation-content-li-img" :src="recom.recomData.image">' +
    '<img v-if="recom.recomData.img" class="recommendation-content-li-img" :src="recom.recomData.img">' +
    '<img v-if="recom.recomData.cover" class="recommendation-content-li-img" :src="recom.recomData.cover">' +
    '</div>' +
    '<div class="recommendation-content-li-right">' +
    '<p class="recommendation-content-li-right-title">{{recom.dataName}}</p>' +
    '<p class="recommendation-content-li-right-content">' +
    '<span v-if="recom.recomType === \'test\'" >{{partName(recom.recomData.partCode)}} / 测评</span>' +
    '<span v-if="recom.recomType === \'course\'" >{{partName(recom.recomData.partCode)}} / {{IsSeries(recom.recomData.isSeries)}}课程</span>' +
    '<span v-if="recom.recomType === \'audio\'" >{{partName(recom.recomData.partCode)}} / 音频</span>' +
    '<span v-if="recom.recomType === \'sift\'" >{{partName(recom.recomData.partCode)}} / 杂志</span>' +
    '</p>' +
    '<p class="recommendation-content-li-right-bottom">' +
    '<span v-if="recom.recomType === \'test\'" class="recommendation-content-li-right-bottom-amount">{{recom.recomData.testCountVirtual}}人测过</span>' +
    '<span v-if="recom.recomType === \'course\'" class="recommendation-content-li-right-bottom-amount">共{{recom.recomData.itemAmount}}节</span>' +
    '<span v-if="recom.recomType === \'test\' && recom.recomData.showPrice" class="recommendation-content-li-right-bottom-price">{{textPrice(recom.recomData.showPrice)}}</span>' +
    '<span v-if="recom.recomType === \'course\' && recom.recomData.price" class="recommendation-content-li-right-bottom-price">{{coursePrice(recom.recomData.price,recom.recomData.validDays)}}</span>' +
    '<span v-if="recom.recomType === \'test\' && recom.recomData.price" class="recommendation-content-li-right-bottom-sale-price">{{textPrice(recom.recomData.price)}}</span>' +
    '<span v-if="recom.recomType === \'course\' && recom.recomData.salePrice" class="recommendation-content-li-right-bottom-sale-price">{{coursePrice(recom.recomData.salePrice,recom.recomData.validDays)}}</span>' +
    '</p>' +
    '</div>' +
    '</li>' +
    '</ul>' +
    '</div>' +
    '</div>',
    methods: {
        partName: function (partCode) {
            if (partCode === 'health') {
                return '情绪压力'
            } else if (partCode === 'intimacy') {
                return '婚恋情感'
            } else if (partCode === 'sex') {
                return '性心理'
            } else if (partCode === 'growing') {
                return '自我成长'
            } else if (partCode === 'relationship') {
                return '人际关系'
            } else if (partCode === 'parenting') {
                return '亲子教育'
            } else if (partCode === 'working') {
                return '职场问题'
            } else if (partCode === 'knowledge') {
                return '知识讨论'
            } else if (partCode === 'sleep') {
                return '睡眠障碍'
            } else {
                return ''
            }
        },
        IsSeries: function (isSeries) {
            if (isSeries === 0) {
                return '单节'
            } else if (isSeries === 1) {
                return '系列'
            } else {
                return ''
            }
        },
        recommendationDetailClick: function (recom) {
            if (!recom.recomType) {
                console.log('recomType:' + recom.recomType + ', recomId:' + recom.recomId);
                alert('请求的资源找不到。');
                return;
            }
            var url;
            if (recom.recomType === 'audio') {
                url = '/warm/audio/audio_detail.html?id=' + recom.recomId + '&title=音频';
                loadHtml(url);
            } else if (recom.recomType === 'sift') {
                if (recom.recomData.detailUrl) {
                    url = recom.recomData.detailUrl + '?id=' + recom.recomId + '&isCollected=' + recom.recomData.isCollected;
                    //window.location.href = url;
                } else {
                    url = recom.recomData.content;
                    if (url.indexOf('/resource/sift/article/') > -1) {
                        url = url + '?id=' + recom.recomId + '&isCollected=' + recom.recomData.isCollected;
                    } else {
                        url = '/warm/magazine/third_detail.html?url=' + encodeURIComponent(url);
                    }
                }
                loadHtml(url);
                return;
            } else if (recom.recomType === 'test') {
                url = '/warm/test/start_normal.html?testDId=' + recom.recomId;
                if (browser.nuanApp) {
                    browser.nuanApp.openTest(recom.recomId);
                } else {
                    loadHtml(url);
                }
            } else if (recom.recomType === 'course') {
                url = this.$options.methods.courseDetailClick.bind(this)(recom.recomData);
                loadHtml(url);
            } else {
                console.log('出现未知类型：' + recom.recomType);
                alert('请求的资源找不到。');
                return;
            }
            //window.location.href = url;
        },
        courseDetailClick: function (item) {
            var detailUrl = "/warm/course/course_detail.html?courseId=" + item.id;
            var ownUrl = "/warm/course/course_own.html?courseId=" + item.id;
            var playUrl;
            if (item.isSeries === 0) {
                playUrl = '/warm/course/course_play.html?courseId=' + item.id + '&itemId=' + item.items[0].id;
            }
            if (item.isSeries === 1) {
                if (item.isFee === 1) {
                    if (item.hasBuyCode === 1) {
                        return ownUrl;
                    } else if (item.hasBuyCode === 0) {
                        return detailUrl;
                    } else {
                        console.error('数据异常。课程hasBuyCode的值应该是0或者1。');
                    }
                } else if (item.isFee === 0) {
                    return detailUrl;
                } else {
                    console.error('数据异常。课程isFee的值应该是0或者1。');
                }
            } else if (item.isSeries === 0) {
                if (item.isFee === 1) {
                    if (item.hasBuyCode === 1) {
                        return playUrl;
                    } else if (item.hasBuyCode === 0) {
                        return detailUrl;
                    } else {
                        console.error('数据异常。课程hasBuyCode的值应该是0或者1。');
                    }
                } else if (item.isFee === 0) {
                    return playUrl;
                } else {
                    console.error('数据异常。课程isFee的值应该是0或者1。');
                }
            } else {
                console.error('数据异常。课程isSeries的值应该是0或者1。');
            }
        },
        textPrice: function (str) {
            return transitionPrice(str);
        },
        coursePrice: function (str, validDays) {
            if (validDays % 365 === 0) {
                validDays = validDays / 365 + '年';
            } else if (validDays === 180) {
                validDays = '半年';
            } else {
                validDays = validDays + '天'
            }
            return transitionPrice(str) + "/" + validDays;
        }
    }
});
Vue.component('coupon-list', {
    props: ["item"],
    template: '<div class="coupon_list" v-if="item.serviceType==\'test\' || item.serviceType==\'common\'" @click="userCoupon(item)">' +
    '<div class="coupon">' +
    '<div class="coupon_price" :style="{color:themeColor(item)}">' +
    '<p>￥</p><p>{{item.amount}}</p>' +
    '</div>' +
    '<div class="coupon_detail">' +
    '<p :style="{color:themeColor(item)}"><span class="serviceType">{{couponType(item.serviceType)}}</span>&nbsp;&nbsp;<span v-show="item.serviceType != \'common\'">{{couponName(item.serviceType,item.type)}}</span></p>' +
    '<div :style="{borderColor:themeColor(item)}">' +
    '<p><span>编码：</span><span>{{item.code}}</span></p>' +
    '<p :style="{background:themeColor(item)}"><span>有效期至</span><span>{{item.validityEnd}}</span></p>' +
    '</div>' +
    '<p>{{item.descr}}</p>' +
    '</div>' +
    '<div class="coupon_state" :style="{background:themeColor(item)}" v-html="couponState(item)"></div>' +
    '</div>' +
    '</div>',
    methods: {
        couponType:function (serviceType) {
            if(serviceType=='test'){
                return '测评';
            }else if(serviceType=='dream'){
                return '解梦';
            }else if(serviceType=='consulting'){
                return '咨询';
            }else if(serviceType=='live'){
                return '直播';
            }else if(serviceType=='common'){
                return '通用券';
            }
        },
        couponName:function (serviceType,type) {
            var serviceName,name;
            if(serviceType=='test'){
                serviceName='测评';
            }else if(serviceType=='dream'){
                serviceName='解梦';
            }else if(serviceType=='consulting'){
                serviceName='咨询';
            }else if(serviceType=='live'){
                serviceName='直播';
            }else if(serviceType=='common'){
                serviceName='通用券';
            }
            if(type=='integral'){
                name='积分兑换券';
            }else if(type=='taste'){
                name='抢鲜券';
            }else if(type=='comment'){
                name='评价有理券';
            }else if(type=='cash'){
                name='代金券'
            }

            return serviceName+name;
        },
        themeColor:function (data) {
            if(data.serviceType == 'test' && data.state=='1-valid'){
                return '#60B2E1';
            }else if(data.serviceType == 'common' && data.state=='1-valid'){
                return '#AF9A45';
            }if((data.serviceType == 'test' || data.serviceType == 'common') && data.state=='2-expired'){
                return '#cccccb';
            }else if((data.serviceType == 'test' || data.serviceType == 'common') && data.state=='3-used'){
                return '#9a9a97';
            }
        },
        couponState:function (data) {
            if(data.state=='1-valid'){
                return '待&nbsp;使&nbsp;用';
            }else if(data.state=='2-expired'){
                return '已&nbsp;过&nbsp;期';
            }else if(data.state=='3-used'){
                return '已&nbsp;使&nbsp;用';
            }
        },
        userCoupon:function (data) {
            if(data.serviceType=='test' || data.serviceType=='common'){
                localStorage.setItem('coupon',JSON.stringify(data));
                if(getParam('serviceType') && getParam('serviceType')=='test'){
                    window.location.href='/warm/order/test_order_details.html?customerIsOrg='+localStorage.getItem('customerIsOrg')+'&coupon='+data.amount;
                }
            }
        }
    }
});