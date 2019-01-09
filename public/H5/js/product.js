$(function () {
    /*0 移除loading*/
    $('.loading').remove();

    /*1 根据productId初始化渲染*/
    let productId = LT.getUrlParams().productId;//获取url字符串数据

    /*2 利用Ajax发送请求获取数据*/
    getProductData(productId, function (data) {
        /*3 获取数据 动态渲染*/
        $(".mui-scroll").html(template("product", data));

        /*4 初始化scroll组件和轮播图自动播放*/
        mui('.mui-scroll').slider({
            interval: 3000 //自动轮播周期，若为0则不自动播放，默认为0；
        });
        mui('.mui-scroll-wrapper').scroll({
            scrollY: true, //是否竖向滚动
            scrollX: false, //是否横向滚动
            startX: 0, //初始化时滚动至x
            startY: 0, //初始化时滚动至y
            indicators: false, //是否显示滚动条
            deceleration: 0.0006, //阻尼系数,系数越小滑动越灵敏
            bounce: true //是否启用回弹
        });

        /*5 尺码的的选择*/
        $(".p_size span").on("tap", function () {
            $(this).addClass("now").siblings().removeClass("now");
        });

        /*6 数量的选择加减 线性先渲染元素 再注册事件*/
        let $input = $(".p_number input");
        let $maxNum = Number($input.attr('data-max'));//获取库存存量
        $(".p_number span").on("tap", function () {
            let $num = Number($input.val());//获取数量 注意是string类型需要转化成Num类型
            if ($(this).hasClass("jian")) {
                if ($num <= 0) {
                    mui.toast("数量不可以在少了");
                    return false;
                }
                $num--;
            } else {
                if ($num >= $maxNum) {
                    //由于位置问题 发生点击穿透 需要延迟一下显示Toast
                    setTimeout(function () {
                        mui.toast('库存不足');
                    }, 100);
                    return false;
                }
                $num++;
            }
            $input.val($num);
        });

        /*7 加入购物车*/
        $(".btn_addCart").on("tap", function () {
            //1 数据的校验
            let $changeBtn = $('.btn_size.now');//查看是否点击选择了尺码
            if (!$changeBtn.length) {
                mui.toast('请您选择尺码');
                return false;
            }
            let num = $input.val();//获取当前数量
            if (num <= 0) {
                mui.toast('请您选择数量');
                return false;
            }
            //2 发送Ajax请求 将物品添加到购物车 需要判断是否登录的情况 单独封装一个Ajax函数
            LT.loadAjax({
                url: "/cart/addCart",
                type: "post",
                data: {
                    productId: productId,
                    num: num,
                    size: $changeBtn.html()
                },
                dataType: "json",
                success: function (data) {
                    if (data.success === true) {
                        //3 弹出对话框 提示用户
                        mui.confirm('添加成功，去购物车看看？', '温馨提示', ['是', '否'], function (e) {
                            if (e.index === 0) {
                                //4 点击确定跳转到购物车界面 点击否默认操作
                                location.href = LT.cartUrl;
                            }
                        })
                    }
                }
            })
        });
    });
});
/*获取产品数据*/
let getProductData = function (productId, callback) {
    $.ajax({
        type: "get",
        url: '/product/queryProductDetail',
        data: {id: productId},
        dataType: 'json',
        success: function (data) {
            callback && callback(data)
        }
    })
};

