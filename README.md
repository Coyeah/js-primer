# 学习JS的各种各种~

## 设计模式 （designMode）

### 单例模式

单例就是保证一个类只有一个实例。

实现方法一般是先判断实例存在与否，如果存在直接返回，如果不存在就创建了再返回，这就确保了一个类只有一个实例对象。

在JavaScript里，单例作为一个命名空间提供者，从全局命名空间里提供一个唯一的访问点来访问该对象。

模式作用：

* 模块间通信
* 系统中某个类的对象只能存在一个
* 保护自己的属性和方法

注意事项：

* 注意this的使用
* 闭包容易造成内存泄露，不需要的要赶快干掉
* 注意new的成本。（继承）

单例常用场景:

只需要生成一个唯一对象的时候，比如说页面登录框，只可能有一个登录框，那么你就可以用单例的思想去实现他，当然你不用单例的思想实现也行，那带来的结果可能就是你每次要显示登陆框的时候都要重新生成一个登陆框并显示（耗费性能），或者是不小心显示出了两个登录框（等着吃经理的40米长刀吧）。

### 工厂模式

工厂模式创建对象（视为工厂里的产品）时无需指定创建对象的具体类。

工厂模式定义一个用于创建对象的接口，这个接口由子类决定实例化哪一个类。该模式使一个类的实例化延迟到了子类。而子类可以重写接口方法以便创建的时候指定自己的对象类型。

目的：在于判断接口最终用哪个类实例化（故与接口密不可分）。

最终效果：多态，和类与类之间的松耦合。

* 简单工厂模式

一个专门生产某个产品的类，通过不同Type进行区分不同的品牌；

![图解](https://github.com/Coyeah/js-primer/blob/master/resource/factory-1.jpg)

* 工厂模式

工厂模式把类变成父类，不同品牌通过继承实现，生产产品通过接口；

![图解](https://github.com/Coyeah/js-primer/blob/master/resource/factory-2.jpg)

* 抽象工厂模式

抽象工厂模式则是全面化了工厂模式，一样的父类一样的继承一样的接口，可以让不同的品牌生产不同的产品；

![图解](https://github.com/Coyeah/js-primer/blob/master/resource/factory-3-1.jpg)

如果要新添一个工厂；

![图解](https://github.com/Coyeah/js-primer/blob/master/resource/factory-3-2.jpg)

如果要新添一个产品；

![图解](https://github.com/Coyeah/js-primer/blob/master/resource/factory-3-3.jpg)

### 命令模式

命令模式是一种封装方法调用的方式。它可以用来对方法调用进行参数化处理和传送，经过这样处理的方法调用可以在任何需要的时候执行。

可以用来消除调用操作的对象和实现操作的对象之间的耦合。具有极大的灵活性。

命令模式最常用的应用场景是：有时候需要向某些对象发送请求，但是并不知道请求的接收者是谁，也不知道被请求的操作是什么。此时希望用一种松耦合的方式来设计程序，使得请求发送者和请求接收者能够消除彼此的耦合关系。

就订餐而言，客人需要向厨师发送请求，但是完全不知道这些厨师的名字与联系方式。

因此命令模式把请求封装成command对象，这个对象可以在程序中四处传递，解开了调用者与接收者之间的耦合关系

### 职责链模式

它是一种链式结构，每个节点都有可能两种操作，要么处理该请求停止该请求操作，要么把请求转发到下一个节点，让下一个节点来处理请求；可以理解成一个有序车站。

该模式定义了一些可能的处理请求的节点对象，请求的起点跟顺序都可能不一样，处理的节点根据请求的不一样而不同；请求者不必知道数据处理完成是由谁来操作的，内部是一个黑箱的操作过程。

解决了请求的发送者和请求的接受者之间的耦合，通过职责链上的多个对象对分解请求流程，实现请求在多个对象之间的传递，直到最后一个对象完成请求的处理。

*职责链可不等于链表哦，因为职责链可以在任何一个节点开始往下查找，而链表，则必须从头结点开始往下查找。比如，DOM事件机制中的冒泡事件就属于职责链，而捕获事件则属于链表。*

![图解](https://github.com/Coyeah/js-primer/blob/master/resource/chainOfResponsibility.png)

纯的职责链：要求请求在这些对象链中必须被处理，而且一个节点处理对象，要么只处理请求，要么把请求转发给下个节点对象处理；

不纯的职责链：要求在职责链里不一定会有处理结构，而且一个节点对象，即可以处理部分请求，并把请求再转发下个节点处理；

### 适配器模式

将一个类（对象）的接口转换成客户希望的另外一个接口。使类（对象）之间接口的不兼容问题通过适配器得以解决。

适配器模式中被适配的接口和适配成为的接口是没有关联的，也就是说，两者中的方法既可以相同，也可以不同。极端情况下两个接口里面的方法可能是完全不同的，也可能完全相同。

### 桥接模式

在系统沿着多个纬度变化的同时，又不增加其复杂度并已达到解耦。说人话，将抽象部分与它的实现部分分离，使它们都可以独立地变化。

### 观察者模式（发布-订阅者模式）

定义对象间的一种一对多的依赖关系，以便当一个对象的状态发生改变时，所有依赖于它的对象都得到通知并自动刷新，也被称为是发布订阅模式。

它需要一种高级的抽象策略，以便订阅者能够彼此独立地发生改变，而发行方能够接受任何有消费意向的订阅者。

![图解](https://github.com/Coyeah/js-primer/blob/master/resource/Observer.jpg)

接近生活的例子——博客，例如A、B、C都订阅了某人的博客，如果该博客有更新时，就会统一发布邮件给这三个人，就会通知到这些订阅者。

模式流程：

1. 确定谁是发布者。
2. 然后给发布者添加一个缓存列表，用于存放回调函数来通知订阅者。
3. 发布消息，发布者需要遍历这个缓存列表，依次触发里面存放的订阅者回调函数。
4. 退订。

关于优缺点：
* 优点：时间上解耦，对象上解耦。
* 缺点：创建这个函数同样需要内存，过度使用会导致难以跟踪维护。

---

## 模拟餐厅运营 （oop-restaurant)

学习JavaScript面向对象编程。

### 需求：

> 我们现在要开一个餐厅啦，餐厅里面有服务员，有厨师，有顾客。学习面向对象，为餐厅和几个角色创建自己的类吧。
> 餐厅可以招聘或者解雇职员，职员越多，就越能够满足更多的顾客需求，从而赚取更多的钱
> 餐厅里的容量是有限的，当顾客坐满了，其他顾客需要排队
> 服务员的工作有两个职责，一个是负责点菜，另外一个是上菜
> 厨师的职责就一个，烹饪食物
> 顾客可以做两件事情，一个是点菜，一个是吃


[Github中的项目与知识点](https://github.com/Coyeah/js-primer#oop-restaurant)

[演示](http://www.coyeah.top/playroom/restaurant)

[复盘](http://www.coyeah.top/2018/06/28/%E6%B5%85%E6%9E%90%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1%E5%BC%80%E5%8F%91/)

*【持续更新 & 有待完善】*

---

## asynchronous

### AJAX

简单的 AJAX 封装

```javascript
function ajax (method, url, data, callback) {
  var xhr = null;
  try {
    xhr = new XMLHttpRequest();
  } catch (e) {
    xhr = new ActiveXobject('Microsoft.XMLHTTP');
  }
  if (!method || method == 'GET') {
    method = 'GET';
    if (data) {
      url = url + '?' + data;
    }
    xhr.open(method, url, true);
    xhr.send();
  } else if (method == 'POST') {
    method = 'POST';
    xhr.open(method, url, true);
    if (data) {
      xhr.send(JSON.stringify(data));
    } else {
      xhr.send();
    }
  }
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var data = JSON.parse(xhr.responseText);
      callback && callback(xhr);
    }
  }
}
```

### promise

为了解决回调地狱嵌套带来的问题，在 EcmaScript 6 中新增了一个 API：Promise。

#### callback hell

![callback-hell](http://odssgnnpf.bkt.clouddn.com/ad51ce297e8dd51850842ff012bdc3cb.jpg)

#### promise 状态

* Pending
* Resolved
* Rejected

promise 的状态只能由 `Pending` 转变为 `Resolev`/`Rejected`，不可逆。

---

## 关于 javascript 的方法应用

### 算法 （algorithm）

+ quickSort - 快速排序
+ bubbleSort - 冒泡排序
+ enumeration - 枚举法
+ binarySearch - 二分法查询
+ deepCopy - 深拷贝

### 数组去重 （distinct）

+ demo01 - 利用 ES6 Set 去重
+ demo02 - 利用 for 嵌套 for，然后 splice 去重
+ demo03 - 利用 indexOf 去重
+ demo04 - 利用 sort()
+ demo05 - 利用对象的属性不能相同的特点进行去重
+ demo06 - 利用 includes
+ demo07 - 利用 hasOwnProperty
+ demo08 - 利用 filter
+ demo09 - 利用递归去重
+ demo10 - 利用 Map 数据结构去重
+ demo11 - 利用 reduce + includes
+ demo12 - [...new Set(arr)]

---

## 系统项目的模块 （systemModules）

### Can - 前端权限管理模块

### Request - 请求模块

---
