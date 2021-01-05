const path = require('path');

/** ts路径映射插件 */
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

/** webpack参数 */
const webpackConfig = {
    mode: "development",
    entry: './src/Main.ts',
    output: {
        path: path.resolve(__dirname, './bin/js'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: ['babel-loader', 'ts-loader'],
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
        plugins: [
            //TODO 这里有个大bug，ts文件结构过深时会使用非相对路径，这个时候就会出错，所以需要这个路径映射插件
            new TsconfigPathsPlugin()
        ]
    },
    // cache: true, // boolean
    // // 禁用/启用缓存
    // watch: true, // boolean
    // // 启用观察
    // watchOptions: {
    //     // 限制并行处理模块的数量
    //     aggregateTimeout: 1000, // in ms
    //     // 将多个更改聚合到单个重构建(rebuild)
    //     poll: true,
    //     poll: 500, // 间隔单位 ms
    //     // 启用轮询观察模式
    //     // 必须用在不通知更改的文件系统中
    //     // 即 nfs shares（译者注：Network FileSystem，最大的功能就是可以透過網路，讓不同的機器、不同的作業系統、可以彼此分享個別的檔案 ( share file )）
    //     ignored: /node_modules/, //忽略时时监听
    // }
};

module.exports = webpackConfig;