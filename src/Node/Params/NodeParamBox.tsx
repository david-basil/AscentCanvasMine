import "./Style/NodeParamBox.css"
import React, { useEffect } from "react";
import { NodeParam } from "./NodeParam";
import { InputFieldControls, useInputField } from "../../Editor/useInputField";
import { fitsConstraint, getMaximalConstraint } from "./Constraint";
import { useSelectionField } from "../../Editor/useSelectionField";

/**
 * Return a JSX render of the given <nodeParam>.
 * 
 * @precondition nodeParam.type == 'number'
 */
function NumberParamBox(
    { nodeParam, onChange }: { 
        nodeParam: NodeParam, 
        onChange: (newNodeParam: NodeParam) => void,
    }
): React.JSX.Element {
    if (nodeParam.type !== 'number') throw Error

    const handleSubmit = (inputTerm: string, controls: InputFieldControls) => {
        const value = parseFloat(inputTerm);
        if (Number.isNaN(value) || !fitsConstraint(getMaximalConstraint(value), nodeParam.constraint)) {
            controls.setInputInvalid();
        } else {
            controls.setInputValid();
            onChange({...nodeParam, value: value});
        } 
    }

    const { inputFieldRender, controls } = useInputField({
        onSubmit: handleSubmit,
        placeholder: nodeParam.id,
        defaultValue: nodeParam.value.toString()
    })

    // The current parameters should always be valid
    useEffect(() => {controls.setInputValid()}, [])

    return inputFieldRender;
}

function createSubParam(nodeParam: NodeParam, subParamIndex: number, onChange: (n: NodeParam) => void) {
    if (nodeParam.type !== 'list' && nodeParam.type !== 'option') throw Error;

    const handleFieldChange = (newField: NodeParam) => {
        nodeParam.fields[subParamIndex] = newField;
        onChange({...nodeParam});
    }
    const subParam = nodeParam.fields[subParamIndex];

    return <NodeParamBox nodeParam={subParam} onChange={handleFieldChange}/>
}

/**
 * Return a JSX render of the given <nodeParam>.
 * 
 * @precondition nodeParam.type == 'list'
 */
function ListParamBox(
    { nodeParam, onChange }: { 
        nodeParam: NodeParam, 
        onChange: (newNodeParam: NodeParam) => void,
    }
): React.JSX.Element {
    if (nodeParam.type !== 'list') throw Error

    const fieldRenders = nodeParam.fields.map((field, index) =>
         <li className="NodeParamBox" key={index}><label> {field.id} {createSubParam(nodeParam, index, onChange)} </label></li>
    )
    return <ul>{fieldRenders}</ul>
}

/**
 * Return a JSX render of the given <nodeParam>.
 * 
 * @precondition nodeParam.type == 'list'
 */
function OptionParamBox(
    { nodeParam, onChange }: { 
        nodeParam: NodeParam, 
        onChange: (newNodeParam: NodeParam) => void,
    }
): React.JSX.Element {
    if (nodeParam.type !== 'option') throw Error

    const handleSelect = (selectionID: string) => {
        onChange({...nodeParam, selectedField: selectionID})
    }

    const selection = useSelectionField(Object.fromEntries(
        nodeParam.fields.map(
            (field, index) => [field.id, createSubParam(nodeParam, index, onChange)]
        )
    ), nodeParam.selectedField, handleSelect)

    return selection;
}

export function NodeParamBox(
    { nodeParam, onChange }: { 
        nodeParam: NodeParam, 
        onChange: (newNodeParam: NodeParam) => void,
    }
): React.JSX.Element {
    if (nodeParam.type === 'empty') { return <></> }

    switch (nodeParam.type) {
        case "number":
            return <NumberParamBox nodeParam={nodeParam} onChange={onChange}/>
        case "list":
            return <ListParamBox nodeParam={nodeParam} onChange={onChange}/>
        case "option":
            return <OptionParamBox nodeParam={nodeParam} onChange={onChange}/>
    }
}