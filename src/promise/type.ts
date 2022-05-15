type ResolveType = (value: any) => any
type RejectType = (value: any) => any
type Executor = (resolve: ResolveType, reject: RejectType) => any

type PromiseStatus = 'pending' | 'fulfilled' | 'rejected'

export { ResolveType, RejectType, Executor, PromiseStatus }
