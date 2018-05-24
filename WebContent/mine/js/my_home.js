/**
 * Created by yx on 2017/10/30.
 */
loadEnv(function () {
    pushToHistory(window.location.href);
}, function () {
    popToHistory(window.location.href)
}, null);
initShareObj({
    title: '暖心理', // 分享标题
    content: '暖心理，温暖世界温暖你', // 分享描述
    shareUrl: window.location.origin + '/warm/home/home.html?isEntry=1',
    iconUrl: window.location.origin + '/warm/images/logo120.png',
});
var userInfo = JSON.parse(localStorage.getItem('userInfo'));
if (userInfo != null && userInfo.photo) {
    $('#userPhoto').attr('src', userInfo.photo);
    $('#userName')[0].innerHTML = userInfo.name;
    $('.loading').hide();
    $('.test-person-header').show();
}
function myTestClick() {//我的测评结果
    window.location.href = '../test/test_person_history.html';
}
function myCollectClick() {//我的收藏
    window.location.href = '../magazine/magazine_person_collect.html';
}
function myCoursesClick() {//我的课程
    window.location.href = '../course/course_list.html?mine=Y';
}
function myHeartClick() {//我的心事
    window.location.href = '../bbs/bbs_person_history.html';
}
function myCouponClick() {
    window.location.href = '../coupon/coupon_list.html';
}