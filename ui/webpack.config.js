var path = require('path');
var webpack = require('webpack');
var merge = require('webpack-merge');
var TARGET = process.env.TARGET;
var ROOT_PATH = path.resolve(__dirname);

var common = {
    entry: {
        app: [path.join(ROOT_PATH, 'app/App.js')],
        home: [path.join(ROOT_PATH, 'app/Home.js')]
    },
    output: {
        path: path.join(ROOT_PATH, 'public'),
        publicPath: '/public/',
        filename: "[name].js"
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery",
            "root.jQuery": "jquery",
            _:"underscore"
        }),//使jquery变成全局变量，不用在自己文件require('jquery')了
        new webpack.optimize.CommonsChunkPlugin('common.js')//第三方库打包生成的文件
    ],
    module: {
        loaders: [
            {
                test: /\.(gif|png|woff|eot|woff2|ttf|svg)$/,
                loader: 'url-loader?limit=100000'
            }
        ]
    },
    resolve: {
        extensions: ['', '.jsx', '.js'],
        modulesDirectories: [
            'node_modules',
            'node_modules_custom'
        ]
    }
};

var mergeConfig = merge.bind(null, common);

if(TARGET === 'build') {
    module.exports = mergeConfig({
        module: {
            loaders: [
                {
                    test: /\.jsx?$/,
                    loader: 'babel?sourceMaps&stage=1',
                    include: path.join(ROOT_PATH, 'app')
                },
                {
                    test: /\.css$/,
                    loader: "style?sourceMap!css"
                },

                // LESS
                {
                    test: /\.less$/,
                    loader: 'style?sourceMap!css?sourceMap!less?sourceMap'
                },

                { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
                { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }

            ]
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    // This has effect on the react lib size
                    'NODE_ENV': JSON.stringify('production')
                }
            }),
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false,
                    pure_funcs: [ 'console.debug' ]


                }
            })
        ]
    });
}

if(TARGET === 'dev') {
    var IP = 'localhost';
    var PORT = 8080;
    module.exports = mergeConfig({
        cache: true,
        debug: true,
        devtool: 'source-map' ,
        entry: {
            app: ['webpack-dev-server/client?http://' + IP + ':' + PORT, 'webpack/hot/only-dev-server'],
            home: ['webpack-dev-server/client?http://' + IP + ':' + PORT,'webpack/hot/only-dev-server'],
            stockExam: ['webpack-dev-server/client?http://' + IP + ':' + PORT,'webpack/hot/only-dev-server'],
            example: ['webpack-dev-server/client?http://' + IP + ':' + PORT, 'webpack/hot/only-dev-server']
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoErrorsPlugin(),
        ],
        module: {
            loaders: [
                {test: /\.jsx?$/,
                 loaders: ['react-hot', 'babel?sourceMaps&stage=1&compact=true'],
                 include: path.join(ROOT_PATH, 'app')

                },
                {
                    test: /\.css$/,
                    loader: "style?sourceMap!css?sourceMap"
                },

                // LESS
                {
                    test: /\.less$/,
                    loader: 'style?sourceMap!css?sourceMap!less?sourceMap'
                },

                { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
                { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }


            ]
        }
    });
}
