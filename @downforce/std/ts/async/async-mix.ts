import {times} from '../iter/iter-mix.js'
import {assertDefined} from '../optional/optional-assert.js'

export function wait(delay: number): Promise<void> {
    const promise = new Promise<void>((resolve) =>
        setTimeout(resolve, delay)
    )

    return promise
}

export async function mapAsync<I, O>(
    inputs: Array<I>,
    mapInput: (input: I, idx: number) => Promise<O>,
    concurrency: number,
): Promise<Array<O>> {
    const inputsSize = inputs.length
    const outputs = new Array<O>(inputsSize)

    let currentIdx = 0

    async function startConsumer(taskId: number): Promise<void> {
        while (currentIdx < inputsSize) {
            const inputIdx = currentIdx
            const input = inputs[currentIdx]
            currentIdx += 1

            assertDefined(input)

            outputs[inputIdx] = await mapInput(input, inputIdx)
        }
    }

    await Promise.all(times(concurrency).map(startConsumer))

    return outputs
}
