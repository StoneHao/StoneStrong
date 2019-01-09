$(function () {
    /*1 获取第一级分类数据动态渲染*/
    getTopCategoryData(function (data) {
        /*2 动态渲染一级菜单*/
        $(".letao-fl ul").html(template("firstCategory", data));
        /*3 需要传递一级菜单id作为参数获取二级菜单数据并且动态渲染 默认渲染第一个*/
        let id = data.rows[0].id;
        setSecondCategoryData(id);
    });

    /*2 点击相应的一级菜单 改变样式*/
    $(".letao-fl").find("ul").on("tap", "li", function () {
        if ($(this).hasClass("now")) return false;
        $(".letao-fl").find("li").removeClass("now");
        $(this).addClass("now");
        let id = $(this).attr("data-id");
        /*3 一级菜单中的id作为参数 获取数据切换数据*/
        setSecondCategoryData(id);
    });
});

/*获取第一级分类的数据*/
function getTopCategoryData(callback) {
    $.ajax({
        type: 'get',
        url: '/category/queryTopCategory',
        data: '',
        dataType: 'json',
        success: function (data) {
            callback && callback(data);
        }
    })
}
/*获取第二级分类的数据*/
function getSecondCategoryData(params, callback) {
    $.ajax({
        type: 'get',
        url: '/category/querySecondCategory',
        data: params,
        dataType: 'json',
        success: function (data) {
            callback && callback(data);
        }
    })
}
/*根据id设置二级菜单数据*/
function setSecondCategoryData(id) {
    getSecondCategoryData({id: id}, function (result) {
        $(".letao-fr ul").html(template("secondCategory", result));
})
}
