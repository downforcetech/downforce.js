import type {TaskAsync, TaskSync} from './fn.js'

export async function measureAsync<R = void>(block: TaskAsync<R>): Promise<[PerfMeasureTime, R]> {
  const timeStart = performance.now()
  const result = await block()
  const timeEnd = performance.now()

  return [
    {
      start: timeStart,
      end: timeEnd,
      durationMs: timeEnd - timeStart,
    },
    result,
  ]
}

export function measureSync<R = void>(block: TaskSync<R>): [PerfMeasureTime, R] {
  const timeStart = performance.now()
  const result = block()
  const timeEnd = performance.now()

  return [
    {
      start: timeStart,
      end: timeEnd,
      durationMs: timeEnd - timeStart,
    },
    result,
  ]
}

// Types ///////////////////////////////////////////////////////////////////////

export interface PerfMeasureTime {
  start: number
  end: number
  durationMs: number
}
