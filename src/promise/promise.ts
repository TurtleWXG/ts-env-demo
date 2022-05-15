import type { Executor, ResolveType, RejectType, PromiseStatus } from './type'

class Promise<T = any> {
  private resolve!: ResolveType
  public reject!: RejectType
  public status!: PromiseStatus

  public resolveValue!: any
  public rejectValue!: any

  public resolveThenCallbacks: (() => void)[] = []
  public rejectThenCallbacks: (() => void)[] = []
  constructor(executor: Executor) {
    this.status = 'pending'

    this.resolve = value => {
      console.log('进入 resolve =>', value)
      if (this.status === 'pending') {
        this.status = 'fulfilled'
        this.resolveValue = value
        this.resolveThenCallbacks.forEach(callback => callback())
      }
    }
    this.reject = value => {
      console.log('进入 reject =>', value)
      if (this.status === 'pending') {
        this.status = 'rejected'
        this.rejectValue = value
        this.rejectThenCallbacks.forEach(callback => callback())
      }
    }
    try {
      executor(this.resolve, this.reject)
    } catch (error: any) {
      this.status = 'pending'
      this.reject(error.toString())
      console.error('executor error =>', error.toString())
    }
  }

  public then(resolveThen: ResolveType, rejectThen: RejectType) {
    return new Promise((resolve, reject) => {
      console.log('this: ', this)
      let result
      if (this.status === 'fulfilled') {
        result = resolveThen(this.resolveValue)
        if (isPromise(result)) {
          result.then(resolveSuccess => {
            resolve(resolveSuccess)
          }, rejectSuccess => {
            reject(rejectSuccess)
          })
        } else {
          resolve(result)
        }
      }
      if (this.status === 'rejected') {
        result = rejectThen(this.rejectValue)
        reject(result)
      }
      if (this.status === 'pending') {
        this.resolveThenCallbacks.push(() => {
          result = resolveThen(this.resolveValue)
          resolve(result)
        })
        this.rejectThenCallbacks.push(() => {
          result = rejectThen(this.rejectValue)
          reject(result)
        })
      }
    })
  }

  public static all(promises: Promise[]): Promise {
    return new Promise((resolve, reject) => {
      let allPromiseResolveSuccessValue: any[] = []
      promises.forEach((promise, index) => {
        promise.then(resolveSuccess => {
          ProcessData(resolveSuccess, index)
        }, rejectSuccess => {
          reject(rejectSuccess)
          return
        })
      })

      function ProcessData(resolveSuccess: any, index: number) {
        allPromiseResolveSuccessValue[index] = resolveSuccess
        if (index === promises.length - 1) {
          resolve(allPromiseResolveSuccessValue)
        }
      }
    })
  }
}

function isPromise(val: any): val is Promise {
  return typeof val === 'object' && typeof val.then === 'function'
}

export default Promise
