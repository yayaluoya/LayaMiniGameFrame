const { watch, task, src } = require("gulp");
const { exec } = require("child_process");
const { server, reload } = require("gulp-connect");
const rev = require("gulp-rev-append");
const gulpfileConst = require("./gulpfileConst");
//是否正在编译
let _ifCompile = false;
//主页地址
let _homePage;
//记录时间
let _time = 0;
//记录自动唤醒编译时间
let _awakeTime = 0;

//创建一个名称为compile的gulp任务
task("compile", function () {
    console.log('\033[35m', '开始自动编译。。。', '\033[0m');
    //自动编译
    compile((code, signal) => {
        console.log('\033[35m', '编译成功，正在创建服务。。。', '\033[0m');
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
                console.log(' ----▷ 配置参数：\n', gulpfileConst);
                console.log(' ----▷');
                console.log('\033[34m', '----▶ ' + _homePage, '\033[0m');
                console.log(' --');
                console.log('\033[33m', ' ----▷ 按 F5 键启动 DeBug浏览器，并打开 游戏主页 地址', '\033[0m');
                console.log(' -');

                /**
                 * @ 监听src目录下的所有子目录的所有文件，
                 * @ //
                 * @ 监听生效后执行的函数
                 */
                watch(gulpfileConst.watchFileList, undefined, watchCompile);

                //创建一个自动编译
                autoCompile();
            },
        });
    });
});

/** 监听编译 */
function watchCompile(cb) {
    let _onTime = (new Date()).getTime();
    // console.log(_onTime - _time);
    if (_onTime - _time >= gulpfileConst.watchFileDelay) {
        console.log('\033[35m', '开始编译。。。', '\033[0m');
        _time = _onTime;
        _awakeTime = gulpfileConst.autoAwakeCompileTime;
    } else {
        return;
    }
    //开始编译
    compile((code, signal) => {
        console.log('\n ----▷ 编译完成');
        console.log(code, signal);
        //抛出提示
        console.log('\033[34m', '----▶ ' + _homePage, '\033[0m');
        if (gulpfileConst.ifAutoUpdate) {
            //重新刷新页面
            src(gulpfileConst.indexPage)
                .pipe(rev())
                .pipe(reload());
        }
        //
        cb();
    });
}

/** 自动编译 */
function autoCompile() {
    if (!gulpfileConst.ifAutoAwakeCompile) {
        return;
    }
    //
    _awakeTime = gulpfileConst.autoAwakeCompileTime;
    //开启自动唤醒计时器
    setInterval(_autoCompile, 100);
}
//配合自动编译
function _autoCompile() {
    //判断是否正在编译中
    if (_ifCompile) { return; }
    _awakeTime -= 100;
    // console.log(_awakeTime);
    if (_awakeTime <= 0) {
        _awakeTime = gulpfileConst.autoAwakeCompileTime;
        console.log('\n ----▷ 自动唤醒编译');
        compile((code, signal) => {
            console.log('\n ----▷ 自动唤醒编译完成');
            console.log(code, signal);
            //抛出提示
            console.log('\033[34m', '----▶ ' + _homePage, '\033[0m');
        });
    }
}

/** 编译代码 */
function compile(_back) {
    if (_ifCompile) {
        console.log('\033[31m', '正在编译中。。。', '\033[0m');
        return;
    }
    _ifCompile = true;
    //执行编译命令 layaair2-cmd compile 
    let process = exec("layaair2-cmd compile");
    process.stdout.on("data", (data) => {
        console.log(data);
    });
    process.stderr.on("data", (data) => {
        console.log(data);
    });
    process.on("exit", (code, signal) => {
        _ifCompile = false;
        _back(code, signal);
    });
}