const path = require('path');

/** webpack参数 */
const webpackConfig = {
    mode: "development",
    entry: path.resolve(__dirname, './src/Main.ts'),
    output: {
        path: path.resolve(__dirname, './bin/js'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: ['ts-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.(md|txt|glsl|vs|fs)$/,
                use: ["raw-loader"],
                exclude: /node_modules/
            },
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', 'glsl', 'md', 'txt', 'vs', 'fs'],
    },
    cache: true, // boolean
    // 禁用/启用缓存
    watch: true, // boolean
    // 启用观察
    watchOptions: {
        // 限制并行处理模块的数量
        aggregateTimeout: 1000, // in ms
        // 将多个更改聚合到单个重构建(rebuild)
        poll: true,
        poll: 500, // 间隔单位 ms
        // 启用轮询观察模式
        // 必须用在不通知更改的文件系统中
        // 即 nfs shares（译者注：Network FileSystem，最大的功能就是可以透過網路，讓不同的機器、不同的作業系統、可以彼此分享個別的檔案 ( share file )）
        ignored: /node_modules/, //忽略时时监听
    }
};

module.exports = webpackConfig;