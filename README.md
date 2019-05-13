从 jQuery 里学习设计模式
========

前言
========

jQuery 前些天陆续发布了 [3.4.0](https://blog.jquery.com/2019/04/10/jquery-3-4-0-released/) 和 [3.4.1](https://t.co/EsgL4kXTcP?amp=1) 版本，修复了一些问题，提升了性能。得知 jQuery 仍然健在，仍在持续开发、进化，我很高兴，只是，我已经不怎么用 jQuery 了。

如今，不止是我，整个前端界会选择 jQuery 搭建新产品的人寥寥无几。一方面，MVVM 已经证明了架构方面的巨大优势；另一方面，大量优秀的设计被原生 JS 吸收，甚至连 jQuery 都放弃 Sizzle 改用原生选择器。但是，jQuery 十几年的积淀绝非 `querySelector` 就能取代。

入行晚的同学可能不知道，当年 jQuery 绝对是统治级的基础类库。我记得当时看到一个数字，99+% 的网站使用 jQuery，甚至超过当时如日中天的 Flash Player，后者是一个商业软件，有完整的公司和团队在努力推广，而前者，则是广大开发者用脚投票的结果。jQuery 的 Slogen 是：“write less, do more”，翻译成汉语就是：代码量更少，功能更强大。jQuery 也是如此践行的，使用它对所有开发者都有巨大帮助，以致于很多开发者离开它都没法工作了。使用 jQuery，开发者可以更聚焦于业务逻辑当中，因为：

1. 少写很多兼容性判定代码
2. 更加方便地操作 DOM
3. 更加方便地管理事件
4. 不用担心目标不存在导致出错
5. 非常容易地创建和组织 DOM
6. 创建大量可复用的组件

其实上面这些杀手级 feature，几乎都和设计模式有着莫大的关系：

1. 使用适配器模式解决兼容性问题
2. 使用外观模式方便的操作 DOM
3. 基于浏览器自带的事件机制（享元模式），配合事件代理管理事件
4. 使用组合模式，让我们不用担心找不到对象的问题
5. 使用工厂模式，容纳一切 jQuery 创建的需求

我想结合自身的开发经验，以大家都熟悉的 jQuery 为例，教大家理解和使用更多设计模式，尤其是那些帮助 jQuery 取得卓越成就的设计模式。这样，起码大家在面试时不至于只知道单例和观察者，哈哈。当然，也能在工作中更加无往不利。

本次分享大纲如下：

1. 设计模式与面向对象
2. 享元模式
3. 外观模式
4. 组合模式
5. 工厂模式
6. 适配器模式


面向读者
--------

1. 中级开发者，熟悉 jQuery，熟悉原生 JS
2. 希望用设计模式武装自己

名词及约定
--------

1. 我假定所有读者都很熟悉 jQuery 的用法和 API，文中不再解释。
2. 文中的“模式”和“设计模式”基本上都指“设计模式”。
3. 所有模式的中文译名以《设计模式：可复用面向对象软件的基础》一书中为准。我会在章节开始处写明其英文名称。

其它约定：

1. 为节省时间，范例代码中的 HTML 会以 pug 书写，这种语言很容易阅读，文中也用不到高级语法，应该问题不大。另外，如果你还在写原生 HTML 或 CSS，我建议你尽快切换到新语言。
2. 范例代码以 ES6 为基础，也会使用 ES2017+ 新增语法，如果你对这些“新”语法不熟悉，附录里有一些资源方便你学习。

文中代码的目标环境：

1. jQuery >= 3.4.1
5. Node.js >= 10.15

作者介绍
-------

大家好，我叫翟路佳，花名“肉山”，这个名字跟 Dota 没关系，从高中起伴随我到现在。

我热爱编程，喜欢学习，喜欢分享，从业十余年，投入的比较多，学习积累到的也比较多，对前端方方面面都有所了解，希望能与大家分享。

我兴趣爱好比较广泛，尤其喜欢旅游，欢迎大家相互交流。

我目前就职于 OpenResty Inc.，定居广州。

你可以在这里找到我：

* [博客](https://blog.meathill.com)
* [微博](https://weibo.com/meathill)
* [GitHub](https://github.com/meathill)

或者通过 [邮件](mailto:meathill@gmail.com) 联系我。

--------

限于个人能力、知识视野、文字技术不足，文中难免有疏漏差错，如果你有任何疑问，欢迎在任何时间通过任何形式向我提出，我一定尽快答复修改。

[GitHub issue](https://github.com/meathill/gitchat-design-patterns-in-jquery/issues)。

再次感谢大家。
