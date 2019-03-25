---
title: 前端性能监控Performance
tags:
- 前端
- HTML5
- JavaScript
---
# Web Performance

前端开发越来越注重性能上的要求，在开发过程中就开始得开始思考 JavaScript 运行的效率问题。我在开发的时候往往搞不清楚我的 JavaScript 代码运行了多长时间，感觉很长，又感觉还可以。这样的情况经常发生，没有一个指标或者数值可以作为参考和观察。

HTML5 中的 window.performance 就是为了解决这个问题。

> Web Performance API允许网页访问某些函数来测量网页和Web应用程序的性能，包括 Navigation Timing API和高分辨率时间数据。—— MDN

解读与记录下这个对象中的每一个字段。`console.log(window.performance)`把这个对象打印出来。

[performance 对象](/image/performance.png)

# window.Performance

## memory

memory 是 chrome 拓展的字段，唯 chrome 浏览器独有。

+ **jsHeapSizeLimit**：内存大小限制
+ **totalJSHeapSize**：可使用的内存
+ **usedJSHeapSize**：JavaScript 对象占用的内存

## navigation

navigation 主要记录的是页面导航的信息，

+ **redirectCount**：页面加载前重定向的次数
+ **type**: 页面加载的导航类型，0-页面第一次加载，1-页面进行过重载，2-页面通过“后退”或“前进”打开的

## timing

timing 中记录的是在页面从点击回车到加载完成后不同事件所记录下的时间戳。

从请求发生到加载完成整个过程中的时间流程如下图：

[从请求发生到加载完成整个过程中的时间流程](/image/performance_timing.png)

### redirect
+ **redirectStart**：当前页面重定向的开始时间。若重定向页面与当前页面跨域，则为0。
+ **redirectEnd**：当前页面重定向的结束时间。若重定向页面与当前页面跨域，则为0。

### fetch
+ **fetchStart**：浏览器准备好发起HTTP GET获取页面的时间。

### domainLookUp
+ **domainLookUpStart**：查询当前页面 DNS 开始时间。若使用本地缓存或持久连接则与`fetchStart`相同。
+ **domainLookUpEnd**：查询当前页面 DNS 结束时间。若使用本地缓存或持久连接则与`fetchStart`相同。

### connect
+ **connectStart**：浏览器尝试连接服务器的时间。
+ **secureConnectionStart**：浏览器尝试以 SSL 方式连接服务器的时间。若不使用 SSL 方式连接则为0。
+ **connectEnd**：浏览器成功连接服务器的时间。

### request & response
+ **requestStart**：浏览器开始请求页面的时间。
+ **responseStart**：浏览器接受到页面第一个字节的时间。
+ **responseEnd**：浏览器接受到页面所有内容的时间。

### unloadEvent
+ **unloadEventStart**：前一个页面 unload 事件开始时间。若前一个页面与当前页面跨域，则为0。
+ **unloadEventEnd**：前一个页面 unload 事件结束时间。若前一个页面与当前页面跨域，则为0。

### dom
+ **domLoading**：开始解析 DOM 树的时间，即 document.readyState 变为 “loading”。
+ **domInteractive**：完成解析 DOM 树的时间，即 document.readyState 变为 “interactive”。
+ **domContentLoadedEventStart**：开始加载页面内资源的时间，即发生 DOMContentLoaded 事件的时间。
+ **domContentLoadedEventEnd**：页面内资源加载完成的时间，即 DOMContentLoaded 事件已经发生且执行完所有事件处理程序的时间。
+ **domComplete**：DOM 树解析完成、页面内资源准备就绪的时间，即 document.readyState 变为 “complete”。

### loadEvent
+ **loadEventStart**：发生 load 事件的时间，也是 load 事件回调函数开始执行的时间。
+ **loadEventEnd**：load 事件已经完成且执行完所有事件处理程序的时间。

*在实际情况下，通过 performance.timing 属性可以找到 domInteractive、domContentLoadedEventStart、domContentLoadedEventEnd、domComplete、loadEventStart 和 loadEventEnd 这6个值。但是在单独获取的情况下，这6个值都为0。*

## getEntries()

该方法返回一个数组类型，包含页面中所有的HTTP资源请求。*IE8不支持*

+ **duration**：加载时间。
+ **name**：资源的绝对路径。
+ **entryType**：资源类型。
+ **initiatorType**：发起请求的标签。

## now()

该方法返回从页面初始化到调用该方法时的毫秒数。*IE9不支持*

performance.now() 与 Date.now() 不同的是，返回了以微秒为单位的时间，更加精准。并且与 Date.now() 会受系统程序执行阻塞的影响不同，performance.now() 的时间是以恒定速率递增的，不受系统时间的影响（系统时间可被人为或软件调整）。

Date.now()输出的是 UNIX 时间，即距离1970年1月1日0点的时间，而 performance.now() 输出的是相对于 performance.timing.navigationStart（页面初始化）的时间。

```JavaScript
var t0 = window.performance.now();
doSomething();
var t1 = window.performance.now();
console.log("doSomething函数执行了" + (t1 - t0) + "毫秒.")
```

# 性能指标

通过 `performance.timing` 提供的各种时间戳，就可以知道从页面开始加载到完成这个过程中的每一步骤的用时，清楚的知道哪些耗时过长影响性能。

+ 重定向时间 = redirectEnd - redirectStart;
+ DNS 查询时间 = domainLookUpEnd - domainLookUpStart;
+ TCP 握手时间 = connectEnd - connectStart;
+ HTTP 响应时间 = responseEnd - responseStart;

```JavaScript
(function() {

  handleAddListener('load', getTiming)

  function handleAddListener(type, fn) {
    if (window.addEventListener) {
      window.addEventListener(type, fn)
    } else {
      window.attachEvent('on' + type, fn)
    }
  }

  function getTiming() {
    try {
      var time = performance.timing;
      var timingObj = {};

      var loadTime = (time.loadEventEnd - time.loadEventStart) / 1000;

      if (loadTime < 0) {
        setTimeout(function() {
          getTiming();
        }, 200);
        return;
      }

      timingObj['重定向时间'] = (time.redirectEnd - time.redirectStart) / 1000;
      timingObj['DNS解析时间'] = (time.domainLookupEnd - time.domainLookupStart) / 1000;
      timingObj['TCP完成握手时间'] = (time.connectEnd - time.connectStart) / 1000;
      timingObj['HTTP请求响应完成时间'] = (time.responseEnd - time.requestStart) / 1000;
      timingObj['DOM开始加载前所花费时间'] = (time.responseEnd - time.navigationStart) / 1000;
      timingObj['DOM加载完成时间'] = (time.domComplete - time.domLoading) / 1000;
      timingObj['DOM结构解析完成时间'] = (time.domInteractive - time.domLoading) / 1000;
      timingObj['脚本加载时间'] = (time.domContentLoadedEventEnd - time.domContentLoadedEventStart) / 1000;
      timingObj['onload事件时间'] = (time.loadEventEnd - time.loadEventStart) / 1000;
      timingObj['页面完全加载时间'] = (timingObj['重定向时间'] + timingObj['DNS解析时间'] + timingObj['TCP完成握手时间'] + timingObj['HTTP请求响应完成时间'] + timingObj['DOM结构解析完成时间'] + timingObj['DOM加载完成时间']);

      for (item in timingObj) {
        console.log(item + ":" + timingObj[item] + '毫秒(ms)');
      }

      console.log(performance.timing);

    } catch (e) {
      console.log(timingObj)
      console.log(performance.timing);
    }
  }
})();
```

**参考资料**

[web计时机制——performance对象](http://www.cnblogs.com/xiaohuochai/p/6523397.html)
[window.performance](https://www.jianshu.com/p/447d90911e71)
[使用performance进行网页性能监控](https://www.cnblogs.com/yuqing6/p/8463113.html)
