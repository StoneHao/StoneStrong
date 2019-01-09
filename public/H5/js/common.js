window.LT = {};
/*获取url参数数据*/
LT.getUrlParams = function () {
    let search = window.location.search;//获取字符串
    /*需要把字符串转换成对象  便于开发使用*/
    let params = {};
    /*是否以?开头*/
    if (search.indexOf('?') === 0) {
        search = search.substr(1);//清除?号
        /*["key1=value1", "key2=value2"]*/
        let arr = search.split('&');//如果有多个参数就分割成多个数组
        for (let i = 0; i < arr.length; i++) {//遍历数组
            /*itemArr "key1=value1"  ----> [key1,value1]*/
            let itemArr = arr[i].split('=');
            params[itemArr[0]] = itemArr[1];
        }
    }
    return params;
};
/*需要登录的ajax请求*/
LT.loginUrl = '/H5/user/login.html';
LT.cartUrl = '/H5/user/cart.html';
LT.userUrl = '/H5/user/index.html';
LT.loadAjax = function (param) {
    $.ajax({
        type: param.type || 'get',
        url: param.url || '#',
        data: param.data || '',
        dataType: param.dataType || 'json',
        success: function (data) {
            //1 未登录的处理 {error: 400, message: "未登录！"} 所有的需要登录的接口 没有登录返回这个数据
            if (data.error === 400) {
                //2 跳到登录页  把当前地址传递给登录页面  当登录成功按照这个地址跳回来
                location.href = LT.loginUrl + '?returnUrl=' + location.href;
            } else {
                //3 请求成功 回调函数执行
                param.success && param.success(data);
            }
        },
        error: function () {
            //4 错误信息的提示
            mui.toast('服务器繁忙');
        }
    })
};

