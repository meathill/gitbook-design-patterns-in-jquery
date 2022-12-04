适配器模式
========

> Adapter Pattern，适配器模式，属于结构型模式

> 在 jQuery 中有很多例子，比如 Ajax，比如各种 DOM 操作。

一般认为，2005年，《网页重构》一书的诞生，标志着现代化 Web 前端的诞生。

当时，IE 凭借与操作系统绑定的优势，占据统治地位。Firefox 号称“标准浏览器”，也占有一些市场份额，尤其在专业人士群体里比较受欢迎。作为开发者（很多后端也会写前端代码，不过当时还没有的“全栈”的概念），必须兼容两种平台，不得不痛苦地和浏览器肉搏——没有文档、没有开发者工具、调试基本就靠 `alert()`。

所以 jQuery 出现后很快就取得了大家的好感。我们终于可以写一套代码，顺利的跑在两个平台上了！

优势
--------

jQuery 提供新的 API，虽然和原生的不太一样，不过都更简单更好用。而且重要的是，在所有平台上的表现一致。这样一来，我们可以只写一套代码，就能跑在所有浏览器里。

如果将来出现了新的浏览器，或者要兼容更多的浏览器，也不需要写更多的代码。

功能介绍
--------

适配器，其实还有一个不那么文邹邹的翻译：转接头，也就是下图这个东西：

![adapter](./img/adapter.jpg)

如果你有过出国旅行的经验，应该知道，很多国家的插座跟我们不一样，比如香港，采用的是英制的插头，也就是图中这一款。如果你带着自己的设备，想在国外插线充电，就必须用转接头。

事实上适配器模式的工作原理也差不多：比如有个类 A 提供若干个接口，跟我们预期的接口不一致，我们希望对这些接口进行修改，那么有两个方案：

1. 修改类 A，对于浏览器来说几乎不可能
2. 创建类 B，提供新的、符合要求的接口，计算后调用 A 的接口

适配器模式就是后者。

适配器可以方便我们和其它系统进行集成，尤其在新老系统交替的时候，可以达到平滑升级的效果。它也方便我们把程序移植到不同平台，在主程序保持稳定的基础上，我们只要调整适配器里的接口转换代码即可，可以大大提升开发效率、节省维护成本。

jQuery 实现
-----------

jQuery 里面有很多适配器代码，不过随着浏览器规范越来越统一（如今甚至连引擎都越来越统一……），这些代码不断减少，还真不太好找。所以我决定回到 v1.12 版本，为了兼容早期 IE，那个时期的 jQuery 里存在大量适配器代码，可以拿来当例子。这里我打算用 Ajax 的部分作为例子。

早年的 Ajax 在不同浏览器里有不同实现，IE 使用 ActiveX 机制，标准浏览器内建 XMLHttpRequest 模块。所以如果我们写原生，就要先判断当前浏览器类型，jQuery 替我们做了这个工作，我们可以直接使用 `$.ajax()` API 完成需要的操作。

这段代码位于 [a79ccf4](https://github.com/jquery/jquery/blob/1.12-stable/src/ajax/xhr.js)，我只摘抄了设计浏览器判断和返回实例的部分：

```js
// 这里的 `ActiveXObject` 是重点，如果存在 `ActiveXObject`，说明是 IE
// 这个时候，就要用 `ActiveXObject` 完成请求；反之，则用 XHR
jQuery.ajaxSettings.xhr = window.ActiveXObject !== undefined ?

	// Support: IE6-IE8
	function() {

		// XHR 不能访问本地文件，这个时候还是要用 `ActiveXObject`
		if ( this.isLocal ) {
			return createActiveXHR();
		}

		// IE 9 之后，同时支持两种用法，我们尽量用标准做法
		if ( document.documentMode > 8 ) {
			return createStandardXHR();
		}

		// Support: IE<9
		return /^(get|post|head|put|delete|options)$/i.test( this.type ) &&
			createStandardXHR() || createActiveXHR();
	} :

	// 其它浏览器，使用标注 XMLHttpRequest 对象
	createStandardXHR;

function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch ( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject( "Microsoft.XMLHTTP" );
	} catch ( e ) {}
}
```

JavaScript 与经典模式的区别
--------

在适配器模式上，JS 的表现与经典模式的表现比较一致，没有特别需要说明的。

<adsense />

适用性
--------

在以下情况你应该考虑使用适配器模式：

1. 在一个项目当中，需要同时支持多个不同版本的接口或 API
2. 需要临时兼容某个库或者框架
