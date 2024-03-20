/**
 * This file describes the parameter signature for rolling a node over 
 *  its inputs.
 * Note that while this is not exactly a node, we keep it here for when
 *  it does get extended to one.
 */
import { NodeParam } from "../Params/NodeParam";

const DEFAULT_WINDOW_SIZE = 7;
const DEFAULT_WINDOW_OFFSET = 0;

const _roll_paramSignature: NodeParam = {
    id: 'rolling_window',
    type: 'list',
    fields: [
        {
            id: 'window_size',
            type: 'number',
            value: DEFAULT_WINDOW_SIZE,
            constraint: {'mustBeInteger': true, 'lowerBound': 1}
        },
        {
            id: 'window_offset',
            type: 'number',
            value: DEFAULT_WINDOW_OFFSET,
            constraint: {'mustBeInteger': true, 'lowerBound': 0} /** @note Upper bound is not expressible as a Constraint */
        }
    ]
}

/** @todo there must be a better way to create a fresh copy of a nodeparam */
export function roll_paramSignature() {
    return structuredClone(_roll_paramSignature);
}