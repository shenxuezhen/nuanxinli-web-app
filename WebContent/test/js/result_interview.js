var testInfo={
    "title":vueData.data.testObj.title,
    "type":vueData.data.testObj.type,
    "testCount":vueData.data.testObj.testCount
};
var vm=new Vue({
    el:"#resultInterview",
    data:testInfo,
    created:function () {
        $('.loading').hide();
        $('#resultInterview').show();
    },
    computed:{
        testcount: function () {
            if (this.$data.testCount / 10000 > 10) {
                return Math.floor(this.$data.testCount / 10000) + '万';
            } else {
                return this.$data.testCount;
            }
        }
    }
});