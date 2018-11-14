const path = require('path');
const webpack = require('webpack');
const packageFile = require( "./package.json" );
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CssInlinePlugin = require('./css-inline-plugin');

const vendor = Object.keys(packageFile.dependencies);

/*@todo remove this*/
const productionEnv = process.env.NODE_ENV === "production";
const timestamp = Date.now();
const mainFilename = productionEnv ? `[name].js?${timestamp}`: '[name].js';
const chunkFilename = productionEnv ? `[name].chunk.js?${timestamp}` : '[name].chunk.js';

const BUILD_DIR = path.resolve( __dirname, "public" );
const APP_DIR = path.resolve(__dirname, 'src');

const htmlMinify = productionEnv ? {
        collapseWhitespace: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        removeComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true
    } : {};

const pathsToClean = [ 'public/dist/' ]               // the path(s) that should be cleaned
const cssPlugins = [
    require('postcss-mixins'),
    require('postcss-extend'),
    require('precss'),
    require('autoprefixer'),
    require('postcss-sorting')({
        'sort-order': 'csscomb',
    }),
    require('postcss-colormin'),
    require('postcss-assets')({
        cachebuster: true,
    }),
    require('postcss-minify-font-values'),
    require("postcss-import"),
    require('postcss-partial-import'),
    require('postcss-inherit'),
    require('postcss-position'),
    require('postcss-merge-selectors'),
];

const plugins = [
	new CleanWebpackPlugin(pathsToClean),         //Clean target folder before creating new build
	new webpack.DefinePlugin({
		'process.env': {
			NODE_ENV: JSON.stringify(process.env.NODE_ENV),
		}
	}),
	new webpack.optimize.CommonsChunkPlugin({
		names: ['app', 'vendor', 'manifest'],
		minChunks: Infinity,
	}),
	new webpack.optimize.CommonsChunkPlugin({
		children: true,
		async: 'common',
		minChunks: 2
	}),
	new HtmlWebpackPlugin({
		template: 'app/react/layouts/desktop.ejs',
		filename: 'desktop.html',
		inject: false,
        alwaysWriteToDisk: true,
        minify: htmlMinify
	}),
	new HtmlWebpackPlugin({
		template: 'app/react/layouts/mobile.ejs',
		filename: 'mobile.html',
		inject: false,
        alwaysWriteToDisk: true,
        minify: htmlMinify
	}),
	new HtmlWebpackPlugin({
		template: 'app/react/layouts/amp.ejs',
		filename: 'amp.html',
		inject: false,
        alwaysWriteToDisk: true,
        minify: htmlMinify
	}),
	new ExtractTextPlugin( {
        filename: '[name].css',
        allChunks: true,
    }),
    new CssInlinePlugin({
        files: [
    		{
    			template: BUILD_DIR+'/dist/desktop.html',
    			css: BUILD_DIR+'/dist/desktop.css'
    		},
    		{
    			template: BUILD_DIR+'/dist/mobile.html',
    			css: BUILD_DIR+'/dist/mobile.css'
    		},
    		{
    			template: BUILD_DIR+'/dist/amp.html',
    			css: BUILD_DIR+'/dist/amp.css'
    		}
    	],
    }),
];

if(productionEnv){
	cssPlugins.push(
        require('cssnano')({
            discardComments: {
                removeAll: true
            },
        })
    );
	plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                screw_ie8: true,
                conditionals: true,
                unused: true,
                comparisons: true,
                sequences: true,
                dead_code: true,
                evaluate: true,
                if_return: true,
                join_vars: true
            },
            output: {
                comments: false
            }
        })
	)
} else {
	plugins.push(
		//new BundleAnalyzerPlugin()
	)
}

var webpackConfig = {
	context: APP_DIR,

	entry: {
		app: "./client/index.js",
		vendor: vendor,
		mobile: "./styles/mobile/mobile.css",
        desktop: "./styles/desktop/desktop.css",
        amp: "./styles/amp/amp.css",
	},
	output: {
		path: BUILD_DIR+'/dist',
		filename: mainFilename,
		chunkFilename: chunkFilename,
		publicPath:'/dist/'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				use: 'babel-loader',
				exclude: /node_modules/
			},
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            query: {
                                sourceMap: false,
                                importLoaders: 2
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            query: {
                                sourceMap: false,
                                parser: require('postcss-scss'),
                                plugins: cssPlugins
                            }
                        },
                    ]
				})
			},
			{
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                exclude: /node_modules/,
                loader: 'file-loader?name=fonts/[name].[ext]&limit=1024',
            },
            {
                test: /\.(jpg|jpeg|gif|png|svg)$/i,
                exclude: /node_modules/,
                loader: 'file-loader?name=image/[name].[ext]&limit=1024',
            }
		]
	},
	resolve: {
        modules: [
            'node_modules',
            path.resolve(__dirname, '/src'),
        ],
        extensions: ['.js', '.json', '.jsx', '.css']
    },
	plugins
};

if(!productionEnv){
	webpackConfig['devtool'] = 'source-map';
}
module.exports = webpackConfig;

