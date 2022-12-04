享元模式
========

> Flyweight Pattern，享元模式，属于结构型模式。

> 因为 jQuery 使用组合模式作为其 API 的基础，所以享元模式也被大量使用，尤其在插件开发时。

jQuery 成功的地方，还在于它提供了非常好的插件体系，很多常用的功能都可以通过插件实现，复用性非常强，用法非常简单。比如在著名前端框架 Bootstrap 中，就大量使用这种插件，比如 [弹窗（Model）](https://getbootstrap.com/docs/4.3/components/modal/#via-javascript)：

```js
$('#myModal').modal(options);
```

这样可以把 `id` 为 `myModel` 的 DOM 实例化成一个弹窗。前面的选择器可以是 `id`，也可以是 `class`，找到的 DOM 节点都会被作为弹窗处理。

优势
--------

在网页里，存在大量相似的节点，它们功能一致，结构相似。如果我们针对每个节点都创建一个独立的功能对象，将消耗大量的系统资源。这个时候，我们可以把相似的节点交给一个享元对象处理，它们的外部数据都通过享元对象存储和提取。避免极为类似的数据存储多份浪费空间。


功能介绍
--------

享元模式一般有一个享元对象，还有若干元素对象。元素对象的外部状态应该是一致的，然后搬运到享元对象，然后从元素对象中删除。

接下来的操作，应该避免访问某个特定的元素对象，都交给享元对象处理。

如果某个元素需要独立变化，那么最好把它移出之前的享元对象，然后创建新的享元对象并放入。

jQuery 实现
-----------

jQuery 里面能直接体现享元模式的代码不太多，所以我摘抄 [jQuery 教学：如何创建插件（jQuery Learn: How to Create a Basic Plugin）](https://learn.jquery.com/plugins/basic-plugin-creation/) 里的一段范例代码。jQuery 插件其实很好的体现了享元模式的效果：

1. 单一环境中大量使用
2. 外部状态非常相似
3. 方便批量处理

```js
(function ( $ ) {

  $.fn.greenify = function( options ) {

    // 处理插件参数，这些参数，无论包含什么样的内容，都只存在一份
    // 可以在元素间共享，只占用一份空间
    var settings = $.extend({
      color: "#556b2f",
      backgroundColor: "white"
    }, options );

    // 使用 `.each` 处理所有插件
    return this.each(function () {
      this.css({
        color: settings.color,
        backgroundColor: settings.backgroundColor
      });
    });
  };

}( jQuery ));
```

JavaScript 和经典模式的区别
--------

经典模式里，数据结构和垃圾回收都是值得关注的内容。但是在 JS 里，这两方面都不受我们控制。JS 里所有东西都是对象，我们对 Web 的操作会由浏览器映射到屏幕上，所以大部分时候，我们要关注的是数据的引用和处理。

<adsense />

适用性
--------

当你遇到类似下面的需求，应该考虑使用享元模式：

1. 使用大量对象
2. 如果对每个对象初始化，可能造成大量的内存浪费
3. 这些对象大部分状态是外部状态，或者说可以通过外部访问
4. 这些对象的外部对象基本都一致，可以共享
5. 对象本身不需要被个体识别
