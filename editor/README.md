A Group 协同编辑器
=========

准备工作

```
bower install
npm install
```

启动Server

```
make
```

压缩，编译
```
make build
```

url 参数说明

```
http://localhost:3000/editor?group=a&file=硬的游戏开放平台.md&debug
```

小组名称 group (必填: 目前为 a)   
文件名称 file (必填: 目前为 硬的游戏开放平台.md)   
是否开启调试 debug


清除Chrome AppCache缓存

```
chrome://appcache-internals/
```


架构说明:

[英文上手指南](https://github.com/fex-team/agroup/blob/master/editor/doc/developer-guide.md)
