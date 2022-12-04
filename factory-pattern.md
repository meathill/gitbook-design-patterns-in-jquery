工厂方法模式
========

> Factory Method Pattern，工厂方法模式，经常简称为“工厂模式”，属于对象创建型模式

> 对应 jQuery 中的 `jQuery()/$()` 方法。

用过 jQuery 的同学应该都会对 `$()` 的用法印象深刻，几乎所有东西都可以当参数传进去。参考[官方文档](http://api.jquery.com/jQuery/)，它支持如下参数类型：

1. 选择器。这个应该是最常用的，可以从当前 DOM 中查找所有符合选择器的节点，并返回一个 jQuery 对象。
2. DOM 节点或者一个包含很多节点的数组。这个也比较常见，用于将 DOM 转换成 jQuery 对象方便接下来的操作，比如在事件响应函数里的 `$(this)`。
3. `window`，`document` 等系统内建对象。主要用来获取宽高和绑定事件。
4. 字符串，多半是一段 HTML 代码，jQuery 会先构建出 DOM，然后返回包含它的 jQuery 对象。
5. jQuery 对象，可以生成一个新的、包含同样 DOM 节点的对象。
6. 函数，将会在 `DOMContentLoaded` 触发时执行。
7. Plain Object，（别说这个功能我还真没用过……）主要用来实现全局事件总线。

从 v1.4 之后，jQuery 甚至支持不传任何参数，直接使用 `$()` 构建一个实例，然后再通过 `.add()` 之类的方法来组合需要的 DOM 节点。

优势
--------

jQuery 将各种可能都放在 `$()` 里，可以大大降低开发者的学习成本：反正用 jQuery 就是要操作 DOM，所有疑似 DOM 的东西都可以扔到 `$()` 里，然后它就是 DOM 了，然后你就可以对它进行操作了，实在是简单的令人发指。

这就是工厂方法模式带来的好处。

功能介绍
--------

实际开发当中，很多时候，我们并不确定应该怎样实例化对象、实例化哪些对象。比如操作 DOM，有时候我们只知道选择器、有时候我们只知道 `this`、有时候我们已经掌握了一些节点，这个时候，如果不同的参数要用不同的构建方式，就会令使用者困惑，也增加出问题的几率。

工厂方法模式（Factory Method）在这里就可以发挥作用。它可以把具体的实例化操作延后，先进行一些计算，判断出应该怎么处理参数、应该实例化哪些对象，这样对使用者而言，初始化工作就很简单，使用的时候也可以忽略很多细节。可以更多地关注业务逻辑。

还有一点。面向对象讲究继承和多态，很多时候，我们只知道要用哪个大类，但是并不知道该用哪个子类。比如前文中的工资计算程序，我们只知道该用员工类，并不知道该用开发、销售、还是行政，这种问题只能通过工厂模式来解决。

jQuery 实现
----------

jQuery 的实现在 [GitHub](https://github.com/jquery/jquery/blob/master/src/core/init.js) 上可以找到，代码格式清晰，有注释，建议大家好好读一下。

以下代码摘自最新的 [cf84696](https://github.com/jquery/jquery/blob/master/src/core/init.js#L21-L118)，去掉了一些和本文不相关的部分，去掉了具体实现，只保留对参数类型和数量的判断，注释也根据工厂方法模式的：

```javascript
init = jQuery.fn.init = function( selector, context, root ) {
  var match, elem;

  // 前文说过，v1.4 之后，可以创建不包含任何 DOM 节点的空 jQuery 对象
  if ( !selector ) {
    return this;
  }

  // 处理字符串
  if ( typeof selector === "string" ) {
    // 处理 HTML 字符串，特征是 `<tag>....</tag>`
    if ( selector[ 0 ] === "<" &&
      selector[ selector.length - 1 ] === ">" &&
      selector.length >= 3 ) {

      // ....

    // 其它字符串，当作选择器处理
    } else {
      match = rquickExpr.exec( selector );
    }

    // ....

  // 处理 DOM 节点 $(DOMElement)
  } else if ( selector.nodeType ) {
    // ....

  // 处理函数: $(function)
  } else if ( typeof selector === "function" ) {
    // ....
  }

  // 处理其它情况
  return jQuery.makeArray( selector, this );
};
```

大体上，工厂方法模式需要实现一个方法。在方法中，根据参数类型和数量的不同，拼装出需要的实例或实例组。

JavaScript 与经典模式的区别
--------

经典版工厂方法模式需要构造一个工厂类，然后实现“工厂方法”。而在 JavaScript 中，我们有独特的模块管理 API，所以不一定需要“工厂方法模式类”，大多数时候，我们只需要一个“工厂方法”：

```js
import SomeBigClass from './some-big-class';

export default SomeBigClassFactory(arg1, arg2, ...args) {
  if (arg1) {
    return new SomeBigClass(arg1);
  }

  arg2 = doChange(arg1);
  if (arg2 === 'some value') {
    return new SomeBigClass(arg2);
  }

  // ...其它操作
}
```

<adsense />

实用性
--------

在以下情况你应该考虑使用工厂方法模式：

1. 你有一个功能强大的类，它提供很多功能、覆盖了很多场景
2. 在不同场合，这个类可以接受不同的参数，构建不太一样的功能
3. 它还衍生出一些子类，可以实现更多更复杂的功能
