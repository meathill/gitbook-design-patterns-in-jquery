组合模式
========

> Composite Pattern，组合模式，属于结构型模式。

> 也是 jQuery 的基础 feature，所有 API 都基于这个模式工作。

使用原生 JS 获取 DOM 节点，然后修改属性，也是很常见的做法，因为很多最佳实践说：这样很快！Realy Fast！比 jQuery 快得多！但是如果因为某种原因，获取 DOM 的时候节点尚不存在，进行操作时就会报错，在古老的 IE 里，左下角会出现一个小红叉。更严重的问题是，JS 是单线程的，报错之后，后面的代码都不会执行。所以，有时候，一个无关紧要的小错误，会影响页面核心逻辑的执行，造成很大的事故。

使用 jQuery 就不用担心这个问题，无论节点是否存在，无论符合选择器的节点有几个，接下来的操作总是可行的，也不会报错。

优势
--------

我们前端大部分需求都是跟 DOM 打交道，有时候操作一个 DOM，有时候操作多个 DOM，但基本上操作方式是一样的。这个时候，使用组合模式，可以让使用者忽略单个对象和多个对象的区别，节省开发时间，增加程序弹性。

使用组合模式还方便我们增加新类型的组件。新增的组件可以很容易的加入组合，一起工作，而使用组合模式写出来的代码完全不需要修改。

功能介绍
--------

组合模式有两个重要的组成部分：组合（Composite），与元素（Leaf）。组合的实例都是 Array-like 的，任何操作，都会执行循环，遍历组合中的元素，分别执行具体方法。

元素可以是不同类型，比如在 jQuery 中，通过选择器在 DOM 中找到的节点，可以是 `<img>`，也可以是 `<div>`，它们有不同的属性和方法，但是都会实现一套接口，这样就可以一次性操作。

组合模式需要有 `.add()`，`.remove()` 等只操作组合的方法，方便在运行时调整它包含的元素集合。这些方法，如果和元素中的方法名重合，可以考虑将它们放在上一层的命名空间里（jQuery 没有这样做），或者加前缀。比如用 `Composite.remove(compositeInstance, item1, item2)`，或者 `composite.__selfAdd(item1)`。

组合模式要最大化组合的接口，即从元素的方法中取合集而不是交集，这样才可以尽可能复用组合，忽略具体元素。

jQuery 实现
-----------

每个 jQuery 实例都是组合模式对象，所以我们只需要在 `core` 中找一下，很快就能找到对应的实现。

以下代码来自于 [438b1a3](https://github.com/jquery/jquery/blob/master/src/core.js#L39-L118)，我摘抄了和组合模式相关的部分，它们基本上就是一些常规的维护集合的函数：

```js
jQuery.fn = jQuery.prototype = {
	constructor: jQuery,

	// 组合长度
	length: 0,

	// 转换成数组
	toArray: function() {
		return slice.call( this );
	},

	// 取出第 `num` 个元素
	get: function( num ) {
		// ....
	},

	// 取一些元素放入栈中并返回
	pushStack: function( elems ) {
		// ....
	},

	// 对本组合中所有元素执行特定 callback
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	// 对本组和中所有元素执行 callback，生成新的组合
	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	// 截取若干元素
	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	// 取第一个元素
	first: function() {
		return this.eq( 0 );
	},

	// 取最后一个元素
	last: function() {
		return this.eq( -1 );
	},

	// 取第 N 个元素
	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	// 取出栈里面的元素
	end: function() {
		return this.prevObject || this.constructor();
	},

	// 内部使用的函数
	push: push,
	sort: arr.sort,
	splice: arr.splice
};
```

操作元素的方法，会在具体的文件逐个赋给 jQuery.prototype，比如，CSS 操作就在 [`css.js`](https://github.com/jquery/jquery/blob/master/src/css.js) 里，大家可以自己慢慢看，因为并不涉及到组合模式，就不详细介绍了。

JavaScript 和经典模式的区别
--------

JS 里，我们不需要特意实现某种数据结构，Object 本身就可以存放任意类型的数据，并且数值本身也是合法的 `key`。所以我们可以像 jQuery 一样，在对象里实现操作“组合”的方法即可。

JS 使用原型链实现类的继承，所以我们只要实现一个 `Array-like` 的对象，然后把类的原型指向它即可。比普通面向对象语言要容易一些。

<adsense />

适用性
--------

当你遇到类似下面的需求，应该考虑使用组合模式：

1. 要操作一批类型接近、方法接近的元素
2. 需要维护集合和元素
