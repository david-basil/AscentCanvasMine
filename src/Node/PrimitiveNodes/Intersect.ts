/**
 * This file describes the parameter signature for intersecting two nodes.
 * Note that while this is not exactly a node, we keep it here for when
 *  it does get extended to one.
 */
import { NodeParam } from "../Params/NodeParam";

const _intersect_paramSignature: NodeParam = {
    id: 'intersection_type', 
    type: 'option', 
    selectedField: 'strict', 
    fields: [ { id: 'strict', type: 'empty' }, { id: 'other (@temp)', type: 'number', value: 0} ]
}

export function intersect_paramSignature() {
    return structuredClone(_intersect_paramSignature);
}