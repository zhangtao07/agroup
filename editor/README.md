A Group 协同编辑器
=========

独立于主项目，需单独安装,启动


```
bower install
npm install
noder server.js
```


url 参数说明

```
http://localhost:3000/editor?group=a&file=%E7%A1%AC%E7%9A%84%E6%B8%B8%E6%88%8F%E5%BC%80%E6%94%BE%E5%B9%B3%E5%8F%B0.md&debug#
```

小组名称 group (必填: 目前为 a)
文件名称 file (必填: 目前为 硬的游戏开放平台.md)
是否开启调试 debug

清除AppCache缓存

```
chrome://appcache-internals/
```


更多详细文档,架构说明移步 

[英文上手指南](https://github.com/fex-team/agroup/blob/master/editor/doc/developer-guide.md)
