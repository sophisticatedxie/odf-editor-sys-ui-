# odf-editor-sys-ui

**odf模板制作平台前端工程**




odf模板平台是由一体体育内部自行研发的可视化制作ODF(Open Document Format)模板的工具，整个系统采用前后端分离模式开发，本项目为前端项目，主要为开发人员提供可视化界面进行odf模板的动态拖拽配置生成，若本地开发需要配合后端项目 [odf-editor-sys-server](http://gitlab.onesport.com.cn/competition/odf-editor-sys/odf-editor-sys-server "odf-editor-sys-server").


![Pandao editor.md](https://images.gitee.com/uploads/images/2020/0917/111316_174e752c_2291825.jpeg "Pandao editor.md")

## 一、开发前阅读

##  更新日志

##v1.0.1(时间: 2020-9-27)
##新特性

1.odf标签支持条件表达式
2.解决了上个版本中xml生成时的html转义字符过多问题，现已全部清除掉。
3.解决了上个版本中无法多次切换模板的问题
4.新增新建模板功能
5.xml美化和换行
6.xml支持在线接口测试和数据填充

## V1.0.0（时间: 2020-9-17）
## 新特性

1. odf在线预览xml格式化
2. 实现odf数据模型和xml的递归算法
3. 项目依赖改造为按需引入，减小包体积

## 1.框架技术选型
>vue全家桶（vue2.0）

>cnpm(建议使用cnpm构建)

>线条工具-js-plumb

>可视化布局->canvas

>通信框架->axios

>ui框架->elementui(存在部分ant-design,后续会全部改为element)

>拖拽实现->jqueryui

------------

## 2.多环境配置

2.1 本地开发需要新建覆盖或者修改src目录下的env.json文件，用于配置后端api全局前置url:
```json
{
    "env":"local",
    "url":"http://localhost:8081//et_center/editor-api"
}
```

## 3.工程目录说明

```javascript
 |-odf-editor-sys-ui                    
      |-config            脚手架配置
	  |-build             打包配置
	  |-odf               现有odf模板文件
      |-src               项目核心模块
	    |-ant-design      ant按需组件定义
		|-components      自定义组件
		  |-flow
		    |-designer
			  |-assets    图片文件
			  |-conifg    节点参数配置
			  |-modules   模板组件集合
			  |-style     组件样式
			  |-util      组件工具类
		  |-FlowDesigner.vue  模板父级容器组件
	    |-elementui	      elementui按需组件定义
		|-mixins          混入文件
		|-restful         后端接口交互定义
		|-router          路由
		|-store           缓存
		|-util            全局工具类
		|-main.js         项目入口
		|-env.json        环境参数配置
	 |-static             静态文件
	 |-test               单元测试文件
     |-package.json       依赖管理
	 |-README.md          项目介绍
```

## 4.已完成/待完成
4.1 已完成


| 任务 | 完成时间 | 存在缺陷 |
| ------ | ------ | ------ |
| canvas绘制容器 | 2020/8/10 | 无 |
| 节点拖拽排列 | 2020/8/10  | 无 |
| 节点连线    |  2020/8/11  | 无   |
| 加密函数、工具包、页面渲染    |  2020/8/12  | 无   |
| 模板选择/渲染/保存    |  2020/8/12  | 无   |
| 节点属性展示、节点变量增删改表格、可编辑表格组件    |  2020/8/14  | 无   |
| 修改数据库字段、属性动态增删改、xml代码编辑器    |  2020/8/15  | 无   |
| js2xml算法    |  2020/8/16  | 无   |
| 生成xml    |  2020/9/17  | 无   |
|新建模板|2020/9/22|无|
|多次切换模板|2020/9/22|无|
|节点支持条件表达式|2020/9/25|无|

4.2 未完成

| 任务 | 预计开始 | 预计完成 |
| ------ | ------ | ------ |
| 完善登录界面 | |  |
| 在线测试odf数据    |   |    |
|后台配置管理|||
|引入权限管理|||
|模板文件在线导出|||
|模板支持一键复制|||
|模板文件的逆向转换|||

## 5.开发步骤
### 5.1.下载仓库代码:
```java
git clone http://gitlab.onesport.com.cn/competition/odf-editor-sys/odf-editor-sys-ui.git

git clone ssh://git@gitlab.onesport.com.cn:2222/competition/odf-editor-sys/odf-editor-sys-ui.git
```

### 5.2.确保安装cnpm,因canvas需要github下载c++库，速度过慢可能导致卡住:
```java
npm install -g cnpm --registry=https://registry.npm.taobao.org
```

### 5.3.安装依赖
```java
cnpm install
```

### 5.4.启动项目
```java
npm run dev
```

启动成功之后访问http://localhost:8080, 见到如下页面即可：

![](https://images.gitee.com/uploads/images/2020/0917/150553_36f02e5f_2291825.png)

## 二、项目预览


------------

### 赛程模板节点图:

![](https://images.gitee.com/uploads/images/2020/0917/150655_b314875e_2291825.png)

### 节点代码
![](https://images.gitee.com/uploads/images/2020/0917/151141_451694d0_2291825.png)

### xml生成预览
![](https://images.gitee.com/uploads/images/2020/0917/151210_586e8a3c_2291825.png)

### 模板选择
![](https://images.gitee.com/uploads/images/2020/0917/151218_e29c2368_2291825.png)

### 快捷键和帮助
![](https://images.gitee.com/uploads/images/2020/0917/151150_cd1de3af_2291825.png)

![](https://images.gitee.com/uploads/images/2020/0917/151201_4895de9f_2291825.png)
