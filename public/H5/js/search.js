/*获取数据*/
function getLocalStorage() {
    let content = localStorage.getItem("LeTaoHistory") || "[]";//存在数据返回数据，不存在数据放回数组类型字符串方便json解析
    return JSON.parse(content);
}

/*重新渲染*/
function templateAgain(storage, $letaoHistory) {
    /*4.存储数据*/
    window.localStorage.setItem('LeTaoHistory', JSON.stringify(storage));
    /*5.重新渲染*/
    $letaoHistory.html(template('historyTpl', {list: storage}));
}


$(function () {
    /*0 初始化区mui域滚动组件*/
    mui('.mui-scroll-wrapper').scroll({
        indicators: false
    });

    /*1 首先需要获取存储在localStorage中的数据 定义键值对 中的值 leTaoHistory*/
    let $letaoHistory = $(".letao-history");
    /*1.1 获取到了数据开始渲染列表*/
    let localStorage = getLocalStorage();
    $letaoHistory.html(template("historyTpl", {list: localStorage}));
    $('.search-input').val('');//置空

    /*2 点击搜索 获取输入框的值 判断是否为空 提醒用户*/
    $('.letao-search .search-btn').on('tap', function () {
        let key = $(".letao-search .search-input").val();
        if (!key) {
            //弹出提示框
            mui.toast('请输入关键字');
            return false;
        }

        /*2.1如果存在搜索信息 需要判断这次搜索是否已经存在 如果存在替换掉原来的信息 存入新信息
        * 2.2判断缓存的数据是否已经溢出（10条）如果溢出删除最后一条 增加新的数据
        * */
        let storage = getLocalStorage();//获取当前数据 准备比对
        let isHave = false;//默认不存在相同的数据
        let haveIndex = null;//先一条相同数据的索引
        for (let i = 0; i < storage.length; i++) {
            if (key === storage[i]) {
                //表示存在相同数据
                isHave = true;
                haveIndex = i;//存入相对index；
                break;
            }
        }
        if (isHave) {
            /*3.如果有相同记录*/
            /*删除*/
            storage.splice(haveIndex, 1);
            storage.push(key);//存入
        } else {
            //是否溢出
            if (storage.length >= 10) {
                /*已经10条记录*/
                /*清除第一条*/
                storage.splice(0, 1);
                storage.push(key);//把新的数据加进去;
            } else {
                /*1.在正常的10条 直接加入*/
                storage.push(key);
            }
        }
        /*storage 变量是一个js数组对象 需要转化成json字符串存入缓存*/
        let stringify = JSON.stringify(storage);
        window.localStorage.setItem("LeTaoHistory", stringify);
        /*跳转搜索列表*/
        location.href = 'searchList.html?key=' + key;

        /*在不跳转的前提下再次获取数据重新渲染*/
        $('.search-input').val('');
        templateAgain(getLocalStorage(), $letaoHistory);
    });

    /*3删除记录*/
    $letaoHistory.on('tap', '.mui-icon', function () {
        /*1.获取索引*/
        let index = $(this).attr('data-index');
        /*2.获取数据*/
        let storage = getLocalStorage();
        /*3.删除数据*/
        storage.splice(index, 1);
        /*4 重新渲染*/
        templateAgain(storage, $letaoHistory);
    });

    /*4清空记录*/
    $letaoHistory.on('tap', '.fa', function () {
        /*清空数据*/
        window.localStorage.setItem('LeTaoHistory', '');
        /*重新渲染*/
        $letaoHistory.html(template('historyTpl', {list: []}));
    });

});