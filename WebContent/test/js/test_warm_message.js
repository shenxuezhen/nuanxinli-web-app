/**
 * Created by Administrator on 2017/8/10.
 */
new Vue({
    el:"#warm-content",
    data:test,
    created:function(){
        $('.title').text('暖·消息');
        ajax('/public/notification/my-list?pageNum=1&pageSize=5',null,function (resp) {
            test.warmMessage=resp;
        })
    },
    computed:{},
    methods:{}
});