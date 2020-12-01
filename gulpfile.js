const { watch, task, src } = require("gulp");
const { exec } = require("child_process");
const { server, reload } = require("gulp-connect");
const rev = require("gulp-rev-append");
const gulpfileConst = require("./gulpfileConst");
//主页地址
let _homePage;
//
function compile(cb) {
    //执行编译命令 layaair2-cmd compile 
    let process = exec("layaair2-cmd compile");
    process.stdout.on("data", (data) => {
        console.log(data);
    });
    process.stderr.on("data", (data) => {
        console.log(data);
    });
    process.on("exit", (code, signal) => {
        console.log("success");
        console.log(code, signal);
        //抛出提示
        console.log('\n ----▷ 编译完成');
        console.log('\033[34m', '----▶ ' + _homePage, '\033[0m');
        if (gulpfileConst.ifAutoUpdate) {
            //重新刷新页面
            src(gulpfileConst.indexPage)
                .pipe(rev())
                .pipe(reload());
        }
        //
        cb();
    })
}

//创建一个名称为compile的gulp任务
task("compile", function () {
    //主页地址
    _homePage = '游戏主页: http://localhost:' + gulpfileConst.port + gulpfileConst.homepage;
    //新建一个服务
    server({
        name: gulpfileConst.itemName,//项目名字
        livereload: gulpfileConst.livereload,//
        port: gulpfileConst.port,//端口
        root: gulpfileConst.root,//默认路径
        //建立服务完成
        serverInit: (_server) => {
            //
            console.log(' ----▷');
            console.log('\033[34m', '----▶ ' + _homePage, '\033[0m');
            console.log(' ----▷');
        },
    });

    //跳转到某个页面

    /**
     * @ 监听src目录下的所有子目录的所有文件，
     * @ 延迟1000毫秒，才执行下次监听，避免手欠的同学，因连续保存触发多次连续编译
     * @ 监听生效后执行的函数
     */
    watch(gulpfileConst.watchFileList, { delay: gulpfileConst.watchFileDelay }, compile);
});