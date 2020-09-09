const _ = require("lodash");
const { split } = require("lodash/fp");

// class Maybe {
//   constructor(value) {
//     this._value = value
//   }
//   static of(value) {
//     return new Maybe(value)
//   }
//   map(fn) {
//     return this.isNothing() ? Maybe.of(null) : Maybe.of(fn(this._value))
//   }
//   isNothing() {
//     return (this._value === null || this._value === undefined)
//   }
// }

// const { property } = require("lodash")

// class Left {
//   constructor(value) {
//     this._value = value
//   }
//   map(fn) {
//     return this._value
//   }
// }

// class Right {
//   constructor(value) {
//     this._value = value
//   }
//   static of(value) {
//     return new Right(value)
//   }
//   map(fn) {
//     return Right.of(fn(value))
//   }
// }

// class IO {
//   constructor(value) {
//     this._value = () => {
//       return value
//     }
//   }
//   static of(value) {

//   }
// }

// console.log(process)

// class Container{
//   constructor(value) {
//     this._value = value
//   }
// }

// class Maybe{
//   constructor(value) {
//     this._value = value
//   }
//   static of(value) {
//     return new Maybe(value)
//   }
//   map(fn) {
//     return this.isNothing() ? Maybe.of(null) : Maybe.of(fn(this._value))
//   }
//   isNothing() {
//     return this._value === null && this._value === undefined
//   }
// }

// const r = Maybe.of('hello world').map(x => x.toUpperCase()).map(x => x.split(' ')[0])

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

// class Right {
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
// function printJson(str) {
//   try {
//     return Right.of(JSON.parse(str))
//   } catch(e) {
//     return Left.of({error: e.message})
//   }
// }

// // const r = printJson('{ name: zhangsan}')

// const r = printJson('{ "name": "zhangsan"}')

// // r.map(x => x.name = 'lisi')

// console.log(r)

// IO 函子
// IO函子中_value值是一个函数，这里把函数作为值来处理
// IO函子可以把不纯的操作存储到_value 中， 延迟执行这个不纯的操作， 让当前操作是纯的
// 把不存的操作交给调用者来处理

// Monad 函子
// Monad是可以变扁的函子
// 一个函子如果具有join 和 of 两个方法并遵循一些定律就是一个Monad

const fs = require("fs");
const { flatMap } = require("lodash");

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

// function readFile(filename) {
//   return new IO(function() {
//     return fs.readFileSync(filename, 'utf-8')
//   })
// }

// function print(x) {
//   return new IO(function() {
//     return x
//   })
// }

// let cat = _.flowRight(print, readFile)

// console.log(cat('package.json')._value()._value())

// const r = readFile('package.json')
//              .map(x => x.toUpperCase())
//              .flatMap(print)
//              .join()

// const r = IO.of(process).map(x => x.fileName)

// console.log(r._value())

// class IO{
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

// function readFile(fileName) {
//   return new IO(function () {
//     return fs.readFileSync(fileName, 'utf-8')
//   })
// }

// function print(x) {
//   return new IO(function() {
//     return x
//   })
// }

// const cat = _.flowRight(print, readFile)

//  console.log(cat('package.json')._value()._value())

// const cat = readFile('package.json')
//                .map(x => _.toUpper(x))
//                .flatMap(print)
//                .join()

// console.log(cat)

// class MayBe{
//   constructor(value) {
//     this._value = value
//   }
//   static of(value) {
//     return new MayBe(value)
//   }
//   isNothing() {
//     return (this._value === null || this._value === undefined);
//   }
//   map(fn) {
//     return this.isNothing ? MayBe.of(null) : MayBe.of(fn(this._value))
//   }
// }

// const m = MayBe.of(null)

// console.log(m)

// class IO{
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

// function readFile(filename) {
//   return new IO(function() {
//     return fs.readFileSync(filename, 'utf-8')
//   })
// }

// function print(x) {
//   return new IO(function() {
//     return x
//   })
// }

// const cat = readFile('package.json')
//               .map(x => _.toUpper(x))
//               .flatMap(print)
//               .map(x => x.slice(0,10))
//               .join()

//            console.log(cat)

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



