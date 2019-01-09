$(function () {
    /*初始化滑动区域*/
    mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
        scrollY: true, //是否竖向滚动
        scrollX: false, //是否横向滚动
        indicators: false, //是否显示滚动条
        bounce: true //是否启用回弹
    });

    /*初始化自动轮播*/
    mui('.mui-slider').slider({
        interval: 2000
    });
});
