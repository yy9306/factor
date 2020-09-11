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

#### 总结：
 * 函数式编程的运算不直接操作值，而是由函子完成
 * 函子就是一个实现了map契约(方法)的对象
 * 我们可以吧函子想象成一个函子，这个盒子里封装了一个值
 * 想要处理盒子中的值，我们需要给盒子的map方法传递一个处理函数(纯函数)，由这个函数来对值进行处理
 * 最终map方法返回一个包含新值的盒子(函子)

## MayBe 函子
 - 我们在编程的过程中可能遇到很多错误，需要对这些信息做相应的处理；
 - MayBe函子的作用就是可以对外部的空值做处理（控制副作用在允许范围内）

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

## Either

- Either 两者中任何一个，类似于if.. else 的处理
- 异常只会让函数变得不纯，Either函子可用来做异常处理
```
  class Left{
    constructor(value) {
      this._value = value
    }
    static of(value) {
      return new Left(value)
    }
    map(fn) {
      return this
    }
  }

  class Right {
    constructor(value) {
      this._value = value
    }
    static of(value) {
      return new Right(value)
    }
    map(fn) {
      return Right.of(fn(this._value))
    }
  }

  function parseJSON(str) {
      try {
          return Right.of(JSON.parse(str))
      } catch(e) {
          return Left.of({ error: e.message })
      }
  }

```

## IO 函子
- IO函子中_value值是一个函数，这里把函数作为值来处理
- IO函子可以把不纯的操作存储到_value 中， 延迟执行这个不纯的操作， 让当前操作是纯的
- 把不存的操作交给调用者来处理

```
class IO{
  constructor(fn) {
    this._value = fn
  }
  static of(value) {
    return new IO(function() {
      return value
    })
  }
  join() {
    return this._value()
  }
  flatMap(fn) {
    return this.map(fn).join()
  }
  map(fn) {
    return new IO(_.flowRight(fn, this._value))
  }
}
```
总结： 我们给map传入的可能是一个不纯的操作，但是经过处理之后，我们保证了IO是以一个纯的操作，不纯的操作我们延迟到了调用_value时，也就达到了副作用在可控范围内。

## Monad 函子
- Monad是可以变扁的函子
- 一个函子如果具有join 和 of 两个方法并遵循一些定律就是一个Monad
```
class IO{
  constructor(fn) {
    this._value = fn
  }
  static of(value) {
    return new IO(function() {
      return value
    })
  }
  join() {
    return this._value()
  }
  flatMap(fn) {
    return this.map(fn).join()
  }
  map(fn) {
    return new IO(_.flowRight(fn, this._value))
  }
}
```


## task 函子

```
const { task } = require("folktale/concurrency/task");

function readeFile(filename) {
  return task(resover => {
    return fs.readFile(filename, 'utf-8', (err, data) => {
      if(err) resover.reject(err)
      return resover.resolve(data)
    })
  })
}

readeFile('package.json')
  .map(x => JSON.parse(x))
  .map(x => Object.keys(x))
  .map(x => x.slice(0, 4))
  .run()
  .listen({
    onRejected: err => console.log(err),
    onResolved: value => console.log(value)
  })
  ```


