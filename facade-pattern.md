外观模式
========

> Facade Pattern，外观模式，属于结构型模式。

> 在 jQuery 里也不胜枚举，比如 DOM 操作、比如 `$.getJSON()`，以及最出彩的——选择器。

我觉得，设计和实现 DOM API 的人很可能不写前端程序……美丑不论，早期的 DOM API 真的很难用，比如 `getElementById()`，意思倒是明确，但是拉拉撒撒写很长，能做的事情却很少。`getElementsByClassName()` 和 `getElementsByTagName()` 也差不多，而且，因为存在单复数的问题，在早期孱弱的编辑器里（早年甚至很多人用 Windows 自带的 记事本（Notepad）写代码），更是时不时就搞出些问题让人头痛。

如果只有一层选择器的话，其实还好，复合选择器会更难处理，比如 `#modal .model-footer button:first-child`。

但是使用 jQuery 就完全不用担心这些，你只需要把选择器通过 `$(selector)` 传给 jQuery，接下来就可以放心大胆的操作 DOM 了。

除此之外，jQuery 里还有很多外观模式的运用，极大的方便了我们操作 DOM，比如，`$('.selector').css('width', 100)` 可以直接将目标节点的宽度修改为 `100px`，而不需要手动加上 `px`，这极大的方便了我们计算数值。又或者改善我们从网络获取数据的体验，比如，在使用 `$.ajax()` 时传入参数 `dataType: 'jsonp'`，就能方便的启动 JSONP，而不需要我们手动添加代码。

优势
--------

从使用体验来说，外观模式和语法糖很像。使用外观模式，可以大大减少我们纠缠在语法实现的时间消耗，更容易专注于业务逻辑。

同样的，对于一些我们并不清楚内在逻辑的功能，外观模式还能赋予我们更强的实现能力，让我们更专注在自己负责的模块，提高团队协作的效率。

功能介绍
--------

以选择器为例，外观模式，会给子系统（比如 Web 中的 DOM）当中的一组接口（`getElementById()`，`getElementsByTagName()`, `getElementsByClassName()` 等）提供一个一致的界面（`$('#header .navbar .navbar-brand')`），这个接口使得这一子系统更加容易使用。

在团队协作时，我们每个人都会负责不同的模块，有些模块可能会被拆解成更多的子模块。不是模块负责人，可能很难搞清楚这些细碎的小模块要如何做合起来完成工作。这个时候，我们也可以提供外观模式的总接口，这样，负责其它模块的同事不需要搞清楚我的模块的内在逻辑，他只需要引用我的外观模式类，然后调用那个类里的方法，就能完成工作。

jQuery 实现
----------

外观模式主要是一种设计思路，在结构上并没有非常明显的特征。这里就拿 jQuery 里 jsonp 的实现当作例子，看看它是怎么封装这个功能的吧：

```js
// 在这一步，为了能够适用 jsonp，所以对 ajax 请求进行了一些封装
jQuery.ajaxSetup( {
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
} );

// 检查是否符合 jsonp 请求的特征，如果是的话，就增加 callback
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" &&
				( s.contentType || "" )
					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	// 检查是否使用函数处理回调，是否要传入其它参数值
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// 获取回调函数的名称，获取需要传入的其它参数
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// 把回调函数放入 URL
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// ....

		// 将回调函数放入全局上下文
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// ....

		// 将请求类型改为 script，因为 JSONP 请求得到的都是 script
		return "script";
	}
} );
```

简单补充下 JSONP 的知识。早年不存在跨域策略，所以浏览器跨域是严格禁止访问的。可是稍微大点的公司多半都有多个服务多个域名，那怎么才能跨域使用这些服务呢？一方面，可以用一台服务器作为代理，但是这样又会引发别的问题；另一种方案，就是 JSONP。

我们知道，通过 `<script>` 标签引入的 JS 是没有跨域问题的，那么，假如这个 `<script>` 标签的 `src` 指向一个动态生成的 JS，这个 JS 里是一个函数调用，原本需要远程加载的数据，通过参数传进去，跨域的问题不就解决了么？

JSONP 就是这样的方案，它的兼容性非常好。唯一的实施难点，就在于远程加载的 JS 运行在全局上下文，所以我们经常需要想办法暴露一个命令到 `window`，jQuery 实际上就帮我们完成这个工作。

JavaScript 和经典模式的区别
--------

在外观模式上，JS 的实现和经典模式没有什么特殊区别。

<adsense />

适用性
--------

遇到类似下面的需求，你应该考虑使用外观模式：

1. 某些操作局限在某个子系统当中，希望暴露给其它模块统一好用的接口
2. 你写了若干小模块，可以完成某个大功能，但日后常用的是大功能
2. 团队协作时，每个人最好都给自己的模块建立合适的外观
