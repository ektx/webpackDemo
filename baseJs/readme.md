# Webpack

[toc]

# 安装

首先我们创建一个 base 项目，并添加 **src/index.js** 文件：

index.js

```js
console.log('hello webpack')
```

安装依赖与打包：

```js
// 安装 webpack 和 webpack-cli
yarn add webpack webpack-cli -D

// 打包
npx webpack
```

参考：[起步](https://webpack.docschina.org/guides/getting-started/)  

> Webpack 默认js入口：src/index.js。如果没有指定配制时，无此文件打包失败



# 配制

## 配制文件

在项目根目录下，添加 **webpack.config.js**

```js
const path = require('path')

module.exports = {
  // 指定入口文件
  entry: './src/index.js',
  // 配制输出文件
  output: {
    // 生成文件名
    filename: 'main.js',
    // 生成文件地址(系统绝对地址)
    path: path.resolve(__dirname, 'dist')
  }
}
```

使用配制文件生成：

```bash
npx webpack --config webpack.config.js
```

## 配制命令

在 package.json 中，我们可以添加自定义命令，来高效地运行打包

```diff
{
  "name": "base-js",
  "version": "1.0.0",
  "private": true,
+  "scripts": {
+    "build": "webpack --config ./webpack.config.js"
+  },
  "license": "MIT",
  "devDependencies": {
    "webpack": "^4.41.6",
    "webpack-cli": "^3.3.11"
  },
  "dependencies": {
    "lodash": "^4.17.15"
  }
}
```

然后，我们就可以在终端使用它来替换之间的方式：

```bash
yarn run build
```

> Scripts中的命令并不需要添加 npx。

# 开发环境

## 观察者模式

使用webpack观察者模式可以时时跟踪到文件的变化，并打包，**但是浏览器并不会自动刷新页面，需要用户自己刷新，可以在用户自己开发工具中使用**。

package.json

```diff
{
  "name": "base-js",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "build": "webpack --config ./webpack.config.js",
+   "watch": "webpack --watch"
  },
  "license": "MIT",
  "devDependencies": {
    "css-loader": "^3.4.2",
    "style-loader": "^1.1.3",
    "webpack": "^4.41.6",
    "webpack-cli": "^3.3.11"
  },
  "dependencies": {
    "lodash": "^4.17.15"
  }
}

```

## webpack-dev-server

`webpack-dev-server` 为你提供了一个简单的 web server，并且具有 live reloading(实时重新加载) 功能。设置如下：

```bash
npm install --save-dev webpack-dev-server
# or
yarn add webpack-dev-server -D
```

修改配置文件，告诉 dev server，从什么位置查找文件：

```diff
const path = require('path')

module.exports = {
  // 指定入口文件
  entry: './src/index.js',
  // 配制输出文件
  output: {
    // 生成文件名
    filename: 'main.js',
    // 生成文件地址(系统绝对地址)
    path: path.resolve(__dirname, 'dist')
  },
+ // 配制开发环境服务
+ devServer: {
+   // 默认 8080
+   port: 8080, 
+   // 设置进度条
+   progress: true,
+   // 指定文件地址
+   contentBase: './dist'
+ }
}
```



`webpack-dev-server` 具有许多可配置的选项。关于其他更多配置，请查看 [配置文档](https://webpack.docschina.org/configuration/dev-server)。

添加命令方式：

package.json

```diff
{
  "name": "base-js",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "build": "webpack --config ./webpack.config.js",
    "watch": "webpack --watch",
+   "dev": "webpack-dev-server --open" 
  },
  "license": "MIT",
  "devDependencies": {
    "css-loader": "^3.4.2",
    "style-loader": "^1.1.3",
    "webpack": "^4.41.6",
    "webpack-cli": "^3.3.11",
    "webpack-dev-server": "^3.10.3"
  },
  "dependencies": {
    "lodash": "^4.17.15"
  }
}

```

# HTML处理

## HtmlWebpackPlugin

使用 HtmlWebpackPlugin 来处理开发模板与生成文件。

首先安装插件，并且调整 `webpack.config.js` 文件：

```bash
npm install --save-dev html-webpack-plugin
# or
yarn add html-webpack-plugin -D
```

**webpack.config.js**

```diff
  const path = require('path')
+ const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  // 指定入口文件
  entry: './src/index.js',
  // 配制输出文件
  output: {
    // 生成文件名
    filename: 'main.js',
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
+ plugins: [
+   new HtmlWebpackPlugin({
+     template: './public/index.html',
+     filename: 'index.html' // 输出文件名
+   })
+ ]
}
```

>  **template** 不指定模板时，会自动生成了一个`index.html`文件。

### HTML调整

此时，我们需要将 `dist/index.html `文件，移动到 **public/** 目录下。

并调整其内容如下：

```diff
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>webpack base</title>
</head>
<body>
-  <script src="main.js"></script>
</body>
</html>
```

如果你想在打包时，对HTML也进行压缩，你可以添加以下代码：

**Webpack.config.js** 

```diff
...
module.exports = {
  ...
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      // 输出文件名
      filename: 'index.html',
+     minify: {
+       // 移除双引号
+       removeAttributeQuotes: true,
+       // 折叠换行
+       collapseWhitespace: true
+     }
    })
  ]
}
```

还可以看下 [`html-webpack-template`](https://github.com/jaketrent/html-webpack-template)，除了提供默认模板之外，还提供了一些额外的功能。



## 清理打包目录

```bash
yarn add clean-webpack-plugin -D
```

**webpack.config.js**

```diff
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
+ const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  ...
  plugins: [
+   // 打包前，先移除之间打包的dist
+   new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      ...
    })
  ]
}
```

更多的配制，可以访问：[`CleanWebpackPlugin`](https://www.npmjs.com/package/clean-webpack-plugin)  

# CSS 处理

处理css时，我们希望webpack能自动打包到我们的index.html文件之中。因此我们需要在js中引用css，好让webpack能处理。

## 安装依赖

```bash
yarn add style-loader css-loader -D
```

- style-loader 用户将生成的css插入到html的head标签之中
- css-loader 用于处理js中的css

# 参考

[官网](https://webpack.js.org/)   



