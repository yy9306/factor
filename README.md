# 函子（factor）

- 容器： 包含值和值变形关系（函数）；
- 函子： 是一个特殊的容器，通过一个普通对象来实现，该对象有 map 方法，map 方法可以运行一个函数对值进行处理；

```
class Container{
  constructor(value) {
    this._value = value
  }
  static of(value) {
    return new Maybe(value)
  }
  map(fn) {
    return Maybe.of(fn(this._value))
  }
}

const r = Container.of(5).map(x => x + 2).map(x => x * x)
```

## Maybe 函子

```
class Maybe{
  constructor(value) {
    this._value = value
  }
  static of(value) {
    return new Maybe(value)
  }
  map(fn) {
    return this.isNothing() ? Maybe.of(null) : Maybe.of(fn(this._value))
  }
  isNothing() {
    return this._value === null && this._value === undefined
  }
} 

```
