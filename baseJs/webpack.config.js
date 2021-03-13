const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  // 指定入口文件
  entry: './src/index.js',
  // 配制输出文件
  output: {
    // 生成文件名
    filename: 'main.[hash:8].js',
    // 生成文件地址(系统绝对地址)
    path: path.resolve(__dirname, 'dist')
  },
  // 配制开发环境服务
  devServer: {
    // 默认 8080
    port: 8080, 
    // 设置进度条
    progress: true,
    // 指定文件地址
    contentBase: './dist'
  },
  plugins: [
    // 打包前，先移除之间打包的dist
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      // 输出文件名
      filename: 'index.html',
      minify: {
        // 移除双引号
        removeAttributeQuotes: true,
        // 折叠换行
        collapseWhitespace: true
      },
      hash: true
    })
  ]
}