module.exports = {
    context: __dirname,
    entry: ['babel-polyfill',"./index.js"],
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
    },
    output: {
        path: __dirname + "/dist",
        filename: "bundle.js"
    },
    //watch: true,
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'babel-loader',
            },
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'babel-loader',
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
        ]
    }
}