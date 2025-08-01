import {deserializeStructAsync, deserializeStructSync, serializeStructAsync, serializeStructSync} from '@downforce/std/serial'
import Assert from 'node:assert'
import {describe, test} from 'node:test'

describe('@downforce/std/serial', (ctx) => {
    const dateString = '2000-01-01T00:00:00.000Z'
    const regexpString = 'a|b([a-z]+)'
    const date = new Date(dateString)
    const regexp1 = new RegExp(regexpString)
    const regexp2 = /a|b([a-z]+)/gi
    const objectLeaf = {key: 'val', date: date, regexp: regexp1}

    const data = [{
        'Hello World': {
            1: [
                null,
                true,
                1,
                date,
                regexp1,
                regexp2,
                {
                    map: new Map<number | string, any>([
                        ['a', date],
                        ['b', regexp1],
                        ['c', regexp2],
                        [1, objectLeaf],
                        [2, [objectLeaf]],
                    ]),
                    set: new Set<any>([
                        null,
                        true,
                        1,
                        date,
                        regexp1,
                        regexp2,
                        objectLeaf,
                    ]),
                },
            ],
        },
    }]

    const dataSerialized = '[{"Hello World":{"1":[null,true,1,946684800000,"/a|b([a-z]+)/","/a|b([a-z]+)/gi",{"map":[["a",946684800000],["b","/a|b([a-z]+)/"],["c","/a|b([a-z]+)/gi"],[1,{"key":"val","date":946684800000,"regexp":"/a|b([a-z]+)/"}],[2,[{"key":"val","date":946684800000,"regexp":"/a|b([a-z]+)/"}]]],"set":[null,true,1,946684800000,"/a|b([a-z]+)/","/a|b([a-z]+)/gi",{"key":"val","date":946684800000,"regexp":"/a|b([a-z]+)/"}]}]}}]'
    const metaSerialized = '[["Date",[0,"Hello World","1",3]],["RegExp",[0,"Hello World","1",4]],["RegExp",[0,"Hello World","1",5]],["Date",[0,"Hello World","1",6,"map",0,1]],["RegExp",[0,"Hello World","1",6,"map",1,1]],["RegExp",[0,"Hello World","1",6,"map",2,1]],["Date",[0,"Hello World","1",6,"map",3,1,"date"]],["RegExp",[0,"Hello World","1",6,"map",3,1,"regexp"]],["Date",[0,"Hello World","1",6,"map",4,1,0,"date"]],["RegExp",[0,"Hello World","1",6,"map",4,1,0,"regexp"]],["Map",[0,"Hello World","1",6,"map"]],["Date",[0,"Hello World","1",6,"set",3]],["RegExp",[0,"Hello World","1",6,"set",4]],["RegExp",[0,"Hello World","1",6,"set",5]],["Date",[0,"Hello World","1",6,"set",6,"date"]],["RegExp",[0,"Hello World","1",6,"set",6,"regexp"]],["Set",[0,"Hello World","1",6,"set"]]]'
    const payloadSerialized = `{"data":${dataSerialized},"meta":${metaSerialized}}`

    test('serializeStructSync()', async (ctx) => {
        Assert.strictEqual(serializeStructSync(data), payloadSerialized)
    })

    test('deserializeStructSync()', async (ctx) => {
        Assert.deepStrictEqual(deserializeStructSync(payloadSerialized), data)
    })

    test('serializeStructAsync()', async (ctx) => {
        Assert.strictEqual(await serializeStructAsync(data), payloadSerialized)
    })

    test('deserializeStructAsync()', async (ctx) => {
        Assert.deepStrictEqual(await deserializeStructAsync(payloadSerialized), data)
    })
})
