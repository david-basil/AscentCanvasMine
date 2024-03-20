import { useState } from "react";
import { NodeInput } from "../Node";
import NodeBox from "../../NodeBox/NodeBox";
import { Timeseries } from "../../Timeseries";
import { Editor } from "../../Editor/Editor";

/**
 * Convert an array of specifications into a dictionary that maps each input node's id
 * to its result. 
 * @param signatures an array of specifications for what each input looks like.
 */
export function setupInputValues(
    signatures: NodeInput[]
) {
    return (
        Object.fromEntries(
            signatures
            .map((signature) => [signature.id, null])
        )
    )
}

/**
 * Create a function that allows input nodes to pass their results.
 * @param forSignature A specification of what the inputs look like.
 * @param setInputValues A setter function for a list of all the values of the nodes.
 */
export function getOnChange(
    forSignature: NodeInput,
    setInputValues: (func: (prev: {[k: string]: Timeseries | null}) => {[k: string]: Timeseries | null}) => void,
) {
    return (v: Timeseries | null) => {
        setInputValues((prev) => ({
            ...prev,
            [forSignature.id]: v
        }))
    }
}

/**
 * Convert a specification for the input nodes into a dictionary of the nodes' JSX elements.
 * @param inputSignature The specification to convert from
 * @param setInputValues The function that the input nodes should send their results to.
 * @returns A dictionary where keys correspond to the id's in the specification, and values
 *      to the JSX element for the node.
 */
function setupInputNodes(
    editor: Editor,
    inputSignature: NodeInput[],
    setInputValues: (func: (prev: {[k: string]: Timeseries | null}) => {[k: string]: Timeseries | null}) => void,
): {[k: string]: JSX.Element} {
    return Object.fromEntries(
        inputSignature
        .map((signature) => {
                return [ 
                    signature.id,
                    <NodeBox
                        key={signature.id}
                        editor={editor}
                        onChange={getOnChange(signature, setInputValues)}
                    />
                ]
            }
        )
    )
}

/**
 * The type of the value that is returned by the `useInput` node.
 */
type useInput_ReturnType= {
    inputValues: {[k: string]: any},
    inputNodes: {[k: string]: JSX.Element},
    setInputSignature: (s: NodeInput[] | undefined) => void
}

/**
 * A react hook that allows a node to specify a set of inputs that it requires. These inputs
 * will all return timeseries data, and there is no restriction on the values that are returned.
 * @returns the result of each input's computation (or null if it's not ready), the JSX element for each
 * input node, as well as a function to call to set a new input signature.
 */
export default function useInput(editor: Editor): useInput_ReturnType {
    const [inputValues, setInputValues] = useState<{[k: string]: Timeseries | null}>({})
    const [inputNodes, setInputNodes] = useState<{[k: string]: JSX.Element}>({})

    const onSetInputSignature = (newInputSignature: NodeInput[] | undefined) => {
        setInputValues(
            (newInputSignature)
                ? setupInputValues(newInputSignature)
                : {}
        )
        setInputNodes(
            (newInputSignature)
                ? setupInputNodes(editor, newInputSignature, setInputValues)
                : {}
        )
    }

    return {
        inputValues: inputValues,
        inputNodes: inputNodes,
        setInputSignature: onSetInputSignature,
    }
}