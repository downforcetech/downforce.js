import {mergedState, useMergeState, type StateWriterArg} from '@downforce/react/state'

type State = {a: number, b: string}
function setState(state: StateWriterArg<State>) {
}

const patch = useMergeState(setState)
patch({a: 1})
// @ts-expect-error
patch({a: 1, b: undefined})
// @ts-expect-error
patch({a: 1, c: 123})

const merge1 = mergedState({a: 123})
const merge2 = mergedState({a: 123, b: undefined})
const merge3 = mergedState({a: 123, c: ''})
const merge1r = merge1(undefined as any as State)
// @ts-expect-error
const merge2r = merge2(undefined as any as State)
// @ts-expect-error
const merge3r = merge3(undefined as any as State)
setState(mergedState<State>({a: 123}))
// @ts-expect-error
setState(mergedState<State>({a: 123, b: undefined}))
// @ts-expect-error
setState(mergedState<State>({a: 123, c: ''}))
