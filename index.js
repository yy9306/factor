// IO 函子
// IO函子中_value值是一个函数，这里把函数作为值来处理
// IO函子可以把不纯的操作存储到_value 中， 延迟执行这个不纯的操作， 让当前操作是纯的
// 把不存的操作交给调用者来处理

// Monad 函子
// Monad是可以变扁的函子
// 一个函子如果具有join 和 of 两个方法并遵循一些定律就是一个Monad


const _ = require("lodash");
const { split, find } = require('lodash/fp');
const { task } = require('folktale/concurrency/task');
const fs = require('fs');


class Container{
  constructor(value) {
    this._value = value
  }
  static of(value) {
    return new Container(value)
  }
  map(fn) {
    return Container.of(fn(this._value))
  }
}

// const r = Container.of(null).map(x => x + 5).map(x => x * x);

// const map = _.curry((fn, factor) => {
//   return factor.map(fn)
// })

// const doSomeThing = map(_.flowRight(x => x * x, x => x + 5))

// const factor = Container.of(5)

// console.log(doSomeThing(factor))
// console.log(r)

// const r = Container.of(null).map(x => x.toUpperCase());

// console.log(r)

// class MayBe{
//   constructor(value) {
//     this._value = value
//   }
//   static of(value) {
//     return new MayBe(value)
//   }
//   isNothing() {
//     return (this._value === null || this._value === undefined)
//   }
//   map(fn) {
//     return this.isNothing() ? MayBe.of(null) : MayBe.of(fn(this._value))
//   }
// }

// const r = MayBe.of(null).map(x => x.toUpperCase());
// const r = MayBe.of('hello world').map(x => x.toUpperCase());

// console.log(r)


//Either 

// class Left{
//   constructor(value) {
//     this._value = value
//   }
//   static of(value) {
//     return new Left(value)
//   }
//   map(fn) {
//     return this
//   }
// }

// class Right{
//   constructor(value) {
//     this._value = value
//   }
//   static of(value) {
//     return new Right(value)
//   }
//   map(fn) {
//     return Right.of(fn(this._value))
//   }
// }

// const json = '{ "name": "TOM" }'

// function parseJson(str) {
//   try {
//     return Right.of(JSON.parse(str))
//   }catch(e) {
//     return Left.of({ error: e.message})
//   }
// }

// console.log(parseJson(json))


// IO 函子

// class IO {
//   constructor(fn) {
//     this._value = fn
//   }
//   static of(value) {
//     return new IO(function() {
//       return value
//     })
//   }
//   join() {
//     return this._value()
//   }
//   flatMap(fn) {
//     return this.map(fn).join()
//   }
//   map(fn) {
//     return new IO(_.flowRight(fn, this._value))
//   }
// }

// const r = IO.of(process).map(x => x.execPath)

// console.log(r._value())

// function readFile(filename) {
//   return new IO(() => {
//     return fs.readFileSync(filename, 'utf-8')
//   })
// }

// function print(x) {
//   return new IO(() => {
//     return x
//   })
// }

// const cat = readFile('package.json').map(print)

// console.log(cat._value()._value())

// const cat = readFile('package.json')
//               .flatMap(print)
//               .join()
// console.log(cat)      


//Task 函子

function readFile(filename) {
  return task(resolver => {
    return fs.readFile(filename, 'utf-8', (err, data) => {
      if (err) resolver.reject(error)
      return resolver.resolve(data)
    })
  })
}

readFile('package.json')
  .map(x => JSON.parse(x))
  .map(x => Object.keys(x))
  .run()
  .listen({
    onRejected: err => console.log(err),
    onResolved: value => console.log(value)
  })




























