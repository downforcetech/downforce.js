import type {Io} from '../fn/fn-type.js'
import {clamp} from '../number/number-mix.js'

export function createScaleLinear(
    inputRange: [number, number],
    outputRange: [number, number],
): Io<number, number> {
    const [inputRangeStart, inputRangeEnd] = inputRange
    const [outputRangeStart, outputRangeEnd] = outputRange

    function map(inputUnbound: number) {
        const input = clamp(inputRangeStart, inputUnbound, inputRangeEnd)
        const inputRangeDistance = Math.abs(inputRangeStart - inputRangeEnd)
        const outputRangeDistance = Math.abs(outputRangeStart - outputRangeEnd)

        if (outputRangeDistance === 0) {
            return outputRangeStart
        }
        if (inputRangeDistance === 0) {
            return Infinity
        }

        const inputRatio = Math.abs(inputRangeStart - input) / inputRangeDistance
        const outputRangeDirection = Math.sign(outputRangeEnd - outputRangeStart)
        const output = outputRangeStart + outputRangeDirection * (inputRatio * outputRangeDistance)

        return output
    }

    return map
}
