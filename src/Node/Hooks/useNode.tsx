import { useEffect, useState } from "react";
import { Node } from "../Node";
import useInput from "./useInput";
import useOutput from "./useOutput";
import { Timeseries } from "../../Timeseries";
import { NodeParam } from "../Params/NodeParam";
import NodeBox from "../../NodeBox/NodeBox";
import { NodeParamBox } from "../Params/NodeParamBox";
import { Editor } from "../../Editor/Editor";

type useNodeInput = {
    editor: Editor
    onChange: (v: Timeseries | null) => void,
}

function renderInput(inputNodes: {[k: string]: JSX.Element}) {
    return (
        (Object.keys(inputNodes).length > 0)
        ? <>({Object.values(inputNodes)})</>
        : <></>
    )
}

export default function useNode(
    { editor, onChange }: useNodeInput
) {
    const [node, setNode] = useState<Node>();
    const [paramSignature, setParamSignature] = useState<NodeParam>()
    const {
        inputValues,
        inputNodes,
        setInputSignature,
    } = useInput(editor)

    useOutput({
        onChange: onChange,
        inputValues: inputValues,
        node: node,
        paramSignature: paramSignature,
    })

    const onSetNode = (newNode: Node) => {
        setNode(newNode);
        setParamSignature(newNode.paramSignature)
        setInputSignature(newNode.inputSignature)
    }

    var paramRender = (paramSignature)
        ? <NodeParamBox nodeParam={paramSignature} onChange={setParamSignature}/>
        : <></>

    // Update the editor when a node is first initialized
    useEffect(() => {
        if (node) { editor.nodeFocused(paramRender) }
    }, [node])

    const onResetNode = () => {
        setNode(undefined)
        setInputSignature(undefined)
        setParamSignature(undefined)
    }

    return {
        setNode: onSetNode,
        resetNode: onResetNode,
        inputRender: <>{renderInput(inputNodes)}</>,
        paramRender: paramRender,
    }
}