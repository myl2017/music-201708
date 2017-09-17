module.exports = {
    entry: {
	"homeBundle":'./src/home.js',
        "playlistBundle":'./src/list.js',
	"songBundle":'./src/play.js'
    },
    output: {
       filename: './dist/[name].js'
    },
    module: {
       rules: [
          {
            test: /\.css$/,
	    use: ['style-loader','css-loader','autoprefixer-loader']
          },
	  {
            test: /\.js$/,
            exclude: /node_modules/,
	    loader: 'eslint-loader',
            options: {}
	  }
       ]
   }
}
