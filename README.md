# 函子（factor）

- 容器： 包含值和值变形关系（函数）；
- 函子： 是一个特殊的容器，通过一个普通对象来实现，该对象有 map 方法，map 方法可以运行一个函数对值进行处理；

```
  class Container{
    construcour(value) {
      this._value = value
    }
    map(fn) {
      return new Container(fn(this._value))
    }
  }
```
