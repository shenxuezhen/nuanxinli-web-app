/**
 * 整理支付思路
 */
var testI = {}, serviceObj = {}, paymentObj = {}, sid = localStorage.getItem('sid');
function placeOrder() {

    var serviceType = localStorage.getItem('serviceType');

    if (serviceType === 'test') {
        testI.price = localStorage.getItem('orderTotalPrice') == 'undefined' ? localStorage.getItem('orderPrice') : localStorage.getItem('orderTotalPrice');
        testI.testDId = localStorage.getItem('testDId');
        testI.customerIsOrg = !localStorage.getItem('customerIsOrg') ? 0 : (localStorage.getItem('customerIsOrg') == 'person' ? 0 : 1);
        testI.serviceValidTime = localStorage.getItem('createTime') ? localStorage.getItem('createTime') : '';
        testI.testIId = localStorage.getItem('testIId');
        testI.vendor = localStorage.getItem('company');
        testI.payMoment = localStorage.getItem('testTime');
        serviceObj = testI;
        serviceObj.serviceType = "test";
    } else if (serviceType === 'course') {
        serviceObj = JSON.parse(localStorage.getItem('course'));
        serviceObj.vendor = localStorage.getItem('company');
        serviceObj.price = course.salePrice;
        serviceObj.serviceType = "course";
    }

    serviceObj.openid = localStorage.getItem('openid');
    orderAndPay(paymentObj, serviceObj)
}

/**
 * 向后台下单
 * 获取订单号，订单id
 */
/*这个方法要区分提交的是整个企业的订单还是个人的订单*/
function orderAndPay(paymentObj, serviceObj) {
    var orderData = {}, postUrl = '';
    if (serviceObj.serviceType === 'course') {
        orderData = {
            "courseId": serviceObj.id,
            "price": '' + serviceObj.price
        };
        postUrl = '/public/course-service/order';
    } else if (serviceObj.serviceType === 'test') {
        /*
         * orderData = {
         "testDId": serviceObj.testDId,
         "price": '' + serviceObj.price,
         "customerIsOrg": serviceObj.customerIsOrg, 是否是企业订单
         "serviceValidTime": serviceObj.serviceValidTime  下单时间，从下单时间开始到有效期内的测评结果可以查看
         };
         */
        orderData = {
            "testDId": serviceObj.testDId,
            "price": '' + serviceObj.price,
            "customerIsOrg": serviceObj.customerIsOrg,
            "serviceValidTime": serviceObj.serviceValidTime
        };
        postUrl = '/public/test-service/order';
    } else {
        var errorMsg = '提交订单出现问题！';
        Toast(errorMsg, 2000);
        throw errorMsg;
    }
    //添加source参数，区分渠道，source值：thirdPartyName,wx,h5
    ajax(postUrl, orderData, function (resp) {
        /** 目前h5只有测评服务使用了优惠券。 */
        if (serviceObj.serviceType === 'test') {
            serviceObj.payAmount = localStorage.getItem('actualPrice');
        } else if (serviceObj.serviceType === 'course') {
            serviceObj.payAmount = serviceObj.price;
        }
        orderInfo = resp;
        orderNo = orderInfo.code;
        localStorage.setItem('orderNo', orderNo);
        loadPayment(orderInfo, serviceObj, paymentObj);
    }, '获取订单失败:');
}

function verifyIsPay(orderInfo, serviceObj, paymentObj) {
    orderId = orderInfo.id;
    if (orderInfo.state == 'paid') {
        if (serviceObj.serviceType === 'course') {
            var courseOwnUrl = '/warm/course/course_own.html?courseId=' + JSON.parse(localStorage.getItem('course')).id;
            var coursePlayUrl = '/warm/course/course_play.html?courseId=' + JSON.parse(localStorage.getItem('course')).id + '&itemId=' + JSON.parse(localStorage.getItem('course')).items[0].id;
            if (JSON.parse(localStorage.getItem('course')).isSeries === 0) {
                window.location.href = coursePlayUrl;
            } else {
                window.location.href = courseOwnUrl;
            }
        } else if (serviceObj.serviceType === 'test') {
            if (serviceObj.payMoment == 'testBefore') {
                alert('您已在其它途径支付此订单，将跳转开始测评页');
                paymentObj.startTest();
            } else if (serviceObj.payMoment == 'testAfter') {
                alert('您已在其它途径支付此订单，将跳转结果页');
                paymentObj.showResult();
            } else {
                alert('您已在其它途径支付此订单');
            }
        }
    } else {
        verifyCoupon(orderId, serviceObj, paymentObj)
    }
}

function verifyCoupon(orderId, serviceObj, paymentObj) {
    var coupon = JSON.parse(localStorage.getItem('coupon'));
    var couponId;
    if (!coupon) {
        couponId = '';
    } else {
        couponId = coupon.id;
    }
    ajax('/public/service-order/' + orderId + '/prepay', {
        id: orderId,
        couponIdList: couponId
    }, function (rep) {
        paymentObj.showPay(serviceObj);
    }, null, function () {
        failPayment(XMLHttpRequest.responseText);
    })
}
/*
//检查订单信息
function pay(serviceObj, paymentObj) {
    orderId = orderId ? orderId : localStorage.getItem('orderId');
    ajax('/public/service-order/' + orderId + '/prepay', {
        "id": orderId,
        "couponIdList": ''
    }, function (resp) {

    });
}*/


function failPayment(text) {
    alert("下单失败：" + text);
    $('#alipayWap').removeClass('alipayWap');
    $('.payBtn').css("pointer-events", '');
    $(".mask").hide();
}

/*
 //更新手机号接口
 function updatePhone() {
 $.ajax({
 url: "/public/consulting-service/character/update",
 type: 'POST',
 dataType: "json",
 data: JSON.stringify({
 consultingId:orderInfo.serviceId,
 cellPhone:localStorage.getItem('userPhone'),
 type:'test'
 }),
 contentType: 'application/json',
 success: function() {
 verifySignature();
 },
 error: function(XMLHttpRequest, textStatus, errorThrown) {
 $('.payBtn').css("pointer-events",'');
 alert('手机号更新失败:' + XMLHttpRequest.responseText);
 $(".mask").hide();
 }
 });
 }*/

function successPayment() {
    var isSuccess = 1, isPay;
    if (localStorage.getItem('serviceType') === 'course') {
        var courseDetailUrl = '/warm/course/course_detail.html?courseId=' + JSON.parse(localStorage.getItem('course')).id;
        var courseOwnUrl = '/warm/course/course_own.html?courseId=' + JSON.parse(localStorage.getItem('course')).id;
        var coursePlayUrl = '/warm/course/course_play.html?courseId=' + JSON.parse(localStorage.getItem('course')).id + '&itemId=' + JSON.parse(localStorage.getItem('course')).items[0].id;
    }
    var url = window.location.href;
    if (url.indexOf('status') > -1 && url.slice(url.indexOf('status') + 7) == -1) {
        $(".mask").hide();
        if (localStorage.getItem('serviceType') === 'test') {
            var url = '/warm/order/test_order_details.html';
            loadHtml(url);
        } else {
            var url = '/warm/order/course_order.html';
            loadHtmlCloseOld(url)
        }
        return;
    }
    var timer = setInterval(function () {
        if (isSuccess >= 5 && isPay == 'true') {
            clearInterval(timer);
            $(".mask").hide();
            if (localStorage.getItem('serviceType') === 'test') {
                if (localStorage.getItem('testTime') == 'testBefore' || !localStorage.getItem('testIId')) {
                    loadHtml('/warm/test/start_normal.html?testDId=' + localStorage.getItem('testDId'));
                } else if (localStorage.getItem('testTime') == 'testAfter' || localStorage.getItem('testIId')) {
                    loadHtml('/warm/test/result_agent.html?testIId=' + localStorage.getItem('testIId'));
                }
            } else if (localStorage.getItem('serviceType') === 'course') {
                if (JSON.parse(localStorage.getItem('course')).isSeries === 0) {
                    loadHtmlCloseOld(coursePlayUrl);
                } else {
                    loadHtmlCloseOld(courseOwnUrl);
                }
            }
        } else if (isSuccess >= 5 && isPay == 'false') {
            clearInterval(timer);
            $(".mask").hide();
            if (localStorage.getItem('serviceType') === 'test') {
                loadHtml('/warm/order/test_order_details.html');
            } else {
                loadHtmlCloseOld('/warm/order/course_order.html');
            }
        }
        ajax('/public/payment/checkpaystatus', {
            "code": orderNo
        }, function (resp) {
            isPay = resp.content;
            if (isPay == 'false') {
                isSuccess++;
            } else {
                if (localStorage.getItem('serviceType') === 'test') {
                    zhuge.track('支付完成', {
                        '测评前后': localStorage.getItem('testTime') == 'testAfter' ? '测评后' : '测评前',
                        '测评名称': localStorage.getItem('title'),
                        '金额': localStorage.getItem('orderTotalPrice'),
                        '支付方式': 'alipay'
                    });
                    if (localStorage.getItem('testTime') == 'testBefore' || !localStorage.getItem('testIId')) {
                        window.location.href = '/warm/test/start_normal.html?testDId=' + localStorage.getItem('testDId');
                    } else if (localStorage.getItem('testTime') == 'testAfter' || localStorage.getItem('testIId')) {
                        window.location.href = '/warm/test/result_agent.html?testIId=' + localStorage.getItem('testIId');
                    }
                } else if (localStorage.getItem('serviceType') === 'course') {
                    if (JSON.parse(localStorage.getItem('course')).isSeries === 0) {
                        loadHtmlCloseOld(coursePlayUrl);
                    } else {
                        loadHtmlCloseOld(courseOwnUrl);
                    }
                }
                clearInterval(timer);
            }
        }, null, function () {
            if (localStorage.getItem('serviceType') === 'test') {
                window.location.href = '/warm/test/start_normal.html?testDId=' + localStorage.getItem('testDId');
            } else if (localStorage.getItem('serviceType') === 'course') {
                alert('执行loadSpecifiedUrlFinish---------276');
                loadHtmlCloseOld(courseDetailUrl);
            }
        });
    }, 1000);
}
