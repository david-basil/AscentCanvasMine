/**
 * This file contains the `useOutput` hook, which provides a simple interface
 * through which to compute the result of a node and update the program accordingly.
 */
import { useEffect } from "react"
import { Node } from "../Node"
import { Timeseries } from "../../Timeseries"
import { NodeParam } from "../Params/NodeParam"

/**
 * The type info for the `useInput` hook's input fields.
 */
type useInput_ParameterType = {
    onChange: (v: Timeseries | null) => void,
    inputValues: {[k: string]: Timeseries},
    node?: Node,
    paramSignature?: NodeParam,
}

/**
 * Use the `inputValues` for the given `node` to compute that node's result;
 * Then, call the `onChange` function with the given result.
 * If the node was not provided or some of the inputValues are `null`, the <`onChange`>
 * function will still be called with a `null` value for the result. 
 * @param onChange the function to call with the result of the computation.
 * @param inputValues The values for the node's inputs.
 * @param node The node that defines the function to be called on the input.
 */
export default function useOutput(
    { onChange, inputValues, node, paramSignature }: useInput_ParameterType
): void {
    const everyValueIsReady = (
        Object.values(inputValues)
        .every((value) => value !== null)
    )

    useEffect(() => {
        onChange(
            (node && paramSignature && everyValueIsReady)
            ? node.apply(inputValues, paramSignature)
            : null
        );
    })
}