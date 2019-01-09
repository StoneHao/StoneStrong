$(function () {

    /*0 初始化滑动区域*/
    mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
        scrollY: true, //是否竖向滚动
        scrollX: false, //是否横向滚动
        indicators: false, //是否显示滚动条
        bounce: true //是否启用回弹
    });

    /*1.页面初始化的时候：关键字在输入框内显示 通过URL地址获取*/
    let key = LT.getUrlParams().key || "";
    /*1.2 拼接可能出现多个参数的时候的字符串*/
    let text = "";
    for (let i in key) {
        text += key[i];
    }
    key = text;//给key赋新值;
    /*1.3 中文出现乱码 需要转码*/
    key = decodeURI(key);
    /*1.4 写入输入框 */
    $(".letao-search .search-input").val(key);


    /*2.页面初始化渲染：根据关键字查询第一页数据4条 动态渲染*/
    // getSearchData({
    //     proName: key,
    //     page: 1,
    //     pageSize: 4
    // }, function (data) {
    //     $('.letao-product').html(template("product", data))
    // });

    /*3.当前页搜索 用户点击搜索的时候 根据新的关键字搜索商品 重置排序功能*/
    $('.search-btn').on('tap', function () {
        /*判断是否输入新的内容*/
        let empty = isEmpty();
        if (!empty) return;//直接返回 不在执行逻辑
        /*去掉排序样式 恢复初始值*/
        $('[data-type].now').removeClass('now').find('span').removeClass('fa-angle-up').addClass('fa-angle-down');
        /*显示加载*/
        $('.letao-product').html('<div class="loading"><span class="mui-icon mui-icon-spinner"></span></div>');

        /*3.1 获取当前点击对象的data-type的值 这个值是排序的参数之一 根据箭头方向的类判断升序还是降序的参数 1 、2 */
        render();
    });


    /*4 点击排序按键 进行排序逻辑*/
    $(".letao-order a").on("tap", function () {
        /*4.1 判断是否输入了内容 如果没有直接return*/
        let empty = isEmpty();
        if (!empty) return;//直接返回 不在执行逻辑

        //4.1 默认是没有now的类样式 箭头朝下 点击按键以后 判断是否存在now样式
        //没有的加上now样式其余清除now样式所有的span箭头默认朝下
        let $this = $(this);
        //不存在now样式
        if (!$this.hasClass("now")) {
            $this.addClass("now").siblings().removeClass("now")
                .find("span").removeClass('fa-angle-up').addClass('fa-angle-down');
        }
        //存在now样式点击箭头toggle
        else {
            /*改当前的箭头方向*/
            if ($this.find('span').hasClass('fa-angle-down')) {
                $this.find('span').removeClass('fa-angle-down').addClass('fa-angle-up');
            } else {
                $this.find('span').removeClass('fa-angle-up').addClass('fa-angle-down');
            }
        }

        /*4.3 获取当前点击对象的data-type的值 这个值是排序的参数之一 根据箭头方向的类判断升序还是降序的参数 1 、2 */
        render();
    });


    /*5 下拉刷新和上拉加载*/
    mui.init({
        pullRefresh: {
            container: "#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            /*下拉刷新*/
            down: {
                height: 50,//可选,默认50.触发下拉刷新拖动距离,
                auto: true,//可选,默认false.首次加载自动下拉刷新一次
                contentdown: "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
                contentover: "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
                contentrefresh: "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
                callback: function () {
                    /*组件对象*/
                    let that = this;
                    isEmpty();//提示输入关键字
                    /*排序功能初始化*/
                    $(".letao-order a").removeClass("now").find("span").removeClass("fa-angle-up").addClass("fa-angle-down");

                    setTimeout(function () {
                        render();//渲染数据
                        that.endPulldownToRefresh();//关闭上拉刷新栏
                        //重置上拉加载
                        mui('#refreshContainer').pullRefresh().refresh(true);
                    }, 1000);

                }
            },
            /*上拉加载*/
            up: {
                height: 50,//可选.默认50.触发上拉加载拖动距离
                auto: false,//可选,默认false.自动上拉加载一次
                contentrefresh: "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
                contentnomore: '没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
                callback: function () {
                    /*组件对象*/
                    let that = this;
                    window.page++;
                    let key = $.trim($('.search-input').val());
                    if (!key) {
                        mui.toast('请输入关键字');
                        return false;
                    }
                    //保留排序 不重置排序样式
                    let $data = $('[data-type].now');//既要有[data-type]属性和now样式类
                    let order = $data.attr("data-type");
                    let orderVal = $data.find('span').hasClass('fa-angle-up') ? 1 : 2;
                    let params = {
                        proName: key,
                        page: window.page,
                        pageSize: 4
                    };
                    params[order] = orderVal;
                    getSearchData(params, function (data) {
                        setTimeout(function () {
                            $('.letao-product').append(template("product", data));//数据需要追加不是更新
                            if (data.data.length === 0) {
                                /*注意：停止上拉加载*/
                                that.endPullupToRefresh(true);
                            } else {
                                that.endPullupToRefresh();
                            }
                        }, 1000);

                    })
                }
            }
        }
    });


});

/*获取产品列表数据*/
function getSearchData(params, callback) {
    $.ajax({
        type: "get",
        url: "/product/queryProduct",
        data: params,
        dataType: "json",
        success: function (data) {
            if (data.data.length === 0) mui.toast('没有相关商品');
            window.page = data.page;//保存当前页数，下次上拉加载需要自增
            callback && callback(data)
        }
    });
}

/*判断搜索框是否有值 根据值排序并重新渲染*/
function render() {
    let $data = $('[data-type].now');//既要有[data-type]属性和now样式类
    let order = $data.attr("data-type");
    let orderVal = $data.find('span').hasClass('fa-angle-up') ? 1 : 2;
    let key = $.trim($('.search-input').val());
    let params = {
        proName: key,
        page: 1,
        pageSize: 4
    };
    params[order] = orderVal;
    /*如果是点击搜索按钮重新搜索的 由于先清除了样式 $data获取不到元素 不影响排序参数变化 */
    /*3.2 获取数据重新渲染*/
    getSearchData(params, function (data) {
        $('.letao-product').html(template("product", data));
    });
}

/*判断是否输入了内容*/
function isEmpty() {
    let key = $.trim($('.search-input').val());
    if (!key) {
        mui.toast('请输入关键字');
        return false;
    }
    return true;
}
