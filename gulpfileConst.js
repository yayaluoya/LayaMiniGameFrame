/**
 * 自动编译配置
 */
let gulpfileConst = {
    /** 名字 */
    itemName: 'LayaMiniGame',

    /** */
    livereload: true,

    /** 端口 */
    port: Math.floor(Math.random() * (9999 - 1000)) + 1000,
    // port: 3300,

    /** 默认路径 */
    root: '',

    /** 默认首页 */
    indexPage: './bin/index.html',

    /** 是否自动刷新 */
    ifAutoUpdate: true,

    /** 监听文件列表 */
    watchFileList: ['src/**'],

    /** 监听文件延迟时间 */
    watchFileDelay: 1000,

    //主页
    homepage: '/bin/index.html',
}

//导出
module.exports = gulpfileConst;