"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var state_1 = require("@eviljs/react/state");
function setState(state) {
}
var patch = (0, state_1.useMergeState)(setState);
patch({ a: 1 });
patch({ a: 1, b: undefined });
patch({ a: 1, c: 123 });
var merge1 = (0, state_1.mergingState)({ a: 123 });
var merge2 = (0, state_1.mergingState)({ a: 123, b: undefined });
var merge3 = (0, state_1.mergingState)({ a: 123, c: '' });
var merge1r = merge1(undefined);
// @ts-expect-error
var merge2r = merge2(undefined);
// @ts-expect-error
var merge3r = merge3(undefined);
setState((0, state_1.mergingState)({ a: 123 }));
// @ts-expect-error
setState((0, state_1.mergingState)({ a: 123, b: undefined }));
// @ts-expect-error
setState((0, state_1.mergingState)({ a: 123, c: '' }));
