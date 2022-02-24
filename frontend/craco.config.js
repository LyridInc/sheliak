const CompressionWebpackPlugin = require('compression-webpack-plugin');

module.exports = {
	webpack: {
		plugins: [
			// new BundleAnalyzerPlugin(),
			new CompressionWebpackPlugin({
				filename: '[path][base].gz',
				algorithm: 'gzip',
				test: /\.js$|\.css$|\.html$/,
				threshold: 1024,
				minRatio: 0.8,
			}),
		],
	},
};
