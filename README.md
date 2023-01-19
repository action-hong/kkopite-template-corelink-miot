## 简介

该项目是一个米家插件开发的模板，集成了一些常用功能，方便快速开发米家插件。

## 模板的目录结构

```
│  index.ios.js(ios入口)
│  index.js(android入口)
│  package.json
│  project.json
│  ratio.js(尺寸适配相关)
│  README.md (说明文档)
│  style.js(通用样式文件)
|  main.js(主函数，声明主组件以及各个页面)
|
├─api
|      index.js(封装miot提供的属性读写、action执行的函数)
|
├─assets(存放资源文件)
|      images(图片资源)
│  
├─component(通用组件文件夹)
|      AppText.js(自带传入默认的字体样式的Text组件)
│ 
├─constant(常量文件夹，统一通过index导出)
|      index.js
|      miot.js(对应产品的一些prop、action定义以及一些通用定义)
|
├─hook(顾名思义，存放一些hook函数的文件，统一通过index.js导出)
|      index.js
|      miot.js
|
├─i18n(语言适配, 如果要加其他语言, 自行添加并在index.js引入)
│      en.json
│      index.js(导出函数`t`，使用它实现国际化)
│      ko.json
│      zh-hk.json
│      zh-tw.json
│      zh.json
|      localized.js(语言国际化实现逻辑)
│   
├─mock(mock属性读写, 订阅等)
|   
├─page(页面文件夹, 需要的可自行再添加)
│      CommonSetting.js(通用设置页面, 已处理好米家规范内所需添加的内容, 以及固件升级的提示等)
|      ErrorPage.js(简易的显示多条错误提示的页面，可以不用)
│      MainPage.js(首页)
|
├─theme(插件主题色、基础尺寸的一些配置)
|      index.js
│          
└─util(一些工具类集合)
        index.js(统一导出所有工具类)
        task.js(封装一些计时执行工具)
```

## 注意

### 关于隐私协议相关的

目前隐私、用户协议均直接在后台配置即可，不需要插件内置了

### 关于语言国际化

```jsx
// 引入
import { t } from 'path/to/i18n'

// 使用
function Hello() {
  return (<Text>{t('hello')}</Text>)
}
```

假设当前的语言是中文(`zh`)，且对应的`path/to/i18n/zh.json`内容如下：

```json
{
  "hello": "你好"
}
```

则`t('hello')`会返回`你好`

- 默认语言为en，如果找不到对应语言、对应字条时，则显示英文
- [更多的语言模板用法点击查看](https://github.com/stefalda/ReactNativeLocalization)
### 关于设置中固件升级

- 已处理好设置界面中固件升级的**小红点显示/隐藏**, 具体代码见`./page/CommonSetting.js`


### 关于mock(Deprecated)

**由于现在米家后台提供了虚拟设备，可以模拟调试、查看设备的各个属性变化，因此该模块没有什么必要了**

与做普通的前端项目时后端接口尚未实现, 插件开发会碰到硬件尚未完成亦或是设备刚好被借走, 这时候就可以通过mock对设备属性的读写, 订阅等功能, 来快速验证前端的业务逻辑. **默认是不开启的**

```js
// mock/index.js

// 启用mock
const USE_MOCK = true
// /关闭mock
const USE_MOCK = false
```

> **切记打包前请关闭mock, 该功能仅限于硬件未完成时使用, 硬件功能完成后要使用真实设备来开发**

mock属性的默认值需要手动添加

```js
// mock/index.js

obj['prop.2.1'] = true
```

mock订阅采用的是在mock内部建一个定时器, 定时去通知订阅者, 一开始是去代理`mockObj`, 监听其属性变化后再去通知, 这样实时性好, 但是貌似`react native`有限制, 在`console`里面调用`setState`是不会去更新的, 而这种做法也是相当于在`console`调用更新

因此当前的做法便是不断去轮询属性, 而后判断是否需要通知(会记录上传通知的值), 避免更多的通知

> 当然其实是无所谓的, 因为mock模块只会在开发时使用

> 米家后台的功能定义中, **各个客户的属性填写的值不规范, 没办法直接编写脚本来获取生成**, 所以当前只能通过手动添加

### 关于`Text`组件

使用默认的`Text`组件会导致在部分小米手机上文字显示不全, 需要添加字体样式或者设置文字宽度

因此该模板提供一个带有默认字体的`Text`组件, 省去传入字体样式的麻烦

```js
import Text from 'root/component/AppText'


function Hello() {
  // 使用方法的React native提供的Text组件一样
  return (<Text>hello world</Text>)
}
...
```

## 关于标题栏再切换页面时, 会出现变化的问题

首页的状态栏是白字的, 进入设置界面或其他界面, 状态栏是黑字的, **此时首页收到订阅通知, 没做变化直接更新**, 引起render后, 会重新渲染出白字的状态栏, 导致再当前界面状态栏出现错乱, 之前的很多bug都是这个引起的

同时, 没法返回首页后, 需要重新设置下状态栏的颜色, 字体(如果首页和其他页面的状态栏字体是一样的, 就不用)

## 关于宽度自适应

`ratio.js`提供了`vw`方法，提供你根据视图大小调整宽度的功能，例如手机设备实际视图有`100px`，则：

- `vw(375)`结果为`100`
- `vw(1)`结果为`1/375*100`

```js
import { vw } from 'path/to/ratio.js'

console.log(vw(100))
```

所以使用时，你只需要将设计稿的宽度设为375，这样看到的尺寸的多大，传入给`vw`方法的参数就多大。

