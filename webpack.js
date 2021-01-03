const path = require('path');

/** webpack参数 */
module.exports = {
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
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(md|txt|glsl|vs|fs)$/,
                use: "raw-loader",
                exclude: /node_modules/
            },
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', 'glsl', 'md', 'txt', 'vs', 'fs'],
    },
};