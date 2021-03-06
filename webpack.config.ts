import webpack from 'webpack';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const config: webpack.Configuration = {
    mode: process.env.NODE_ENV == 'production' ? 'production' : 'development',
    entry: {
        'main': path.join(__dirname, '/src/main.ts'),
    },
    output: {
        path: path.join(__dirname, '/dist'),
        publicPath: process.env.PUBLIC_PATH ? process.env.PUBLIC_PATH : path.join(__dirname, '/dist'),
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: 'ts-loader',
            },
            {
                test: /\.(glsl)$/,
                loader: 'raw-loader',
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                loader: 'file-loader',
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            }
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            '#': path.join(__dirname, '/src'),
        }
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: 'assets/index.html',
            filename: 'index.html',
        }),
        new HtmlWebpackPlugin({
            template: 'assets/index.en.html',
            filename: 'index.en.html',
        }),
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        hot: true,
        port: 8080,
        open: true,
    }
};

export default config;
