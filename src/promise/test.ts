import Promise from './promise'

const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('成功了')
  }, 1000)
})
const promise1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('成功了1')
  }, 1000)
})

Promise.all([promise, promise1]).then(
  res => {
    console.log('Promise.all => res', res)
  },
  err => {
    console.log('Promise.all => err', err)
  }
)

// promise.then(
//   res => {
//     console.log('then 1 res', res)
//     return 'ok 1'
//   },
//   err => {
//     console.log('then 1 err', err)
//     return 'error 1'
//   }
// ).then(
//   res => {
//     console.log('then 2 res', res)
//     return new Promise((resolve, reject) => {
//       setTimeout(() => {
//         reject('失败了')
//       }, 1000)
//     })
//   },
//   err => {
//     console.log('then 2 err', err)
//     return 'error 2'
//   }
// )
