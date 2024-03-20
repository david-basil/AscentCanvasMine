/**
 * This file contains the `NodeBox` class which acts as a wrapper around the `Node` class.
 * Where `Node` instances define computational processes, `NodeBox` instances allow the user
 * to compose nodes with eachother, search for nodes and do other interfacing.
 */
import './Style/NodeBox.css'
import { useRef} from "react";
import { nodes } from "../Node";
import { Node } from "../Node/Node";
import { useStock } from "./useStock";
import useNode from "../Node/Hooks/useNode";
import { Timeseries } from '../Timeseries';
import { InputFieldControls, useInputField } from '../Editor/useInputField/useInputField';
import { Editor } from '../Editor/Editor';
import { Literal } from '../Node/PrimitiveNodes/Literal';


function filterSearch(
    searchTerm: string, 
): Node | null {
    const result = nodes.filter((node) => node.code === searchTerm);
    return (result.length > 0)
        ? result[0]
        : null
}

export default function NodeBox(
    {editor, onChange}: {editor: Editor, onChange: (value: Timeseries | null) => void},
) {
    /** @todo this function is too long. decompose it. */
    const {
        setNode,
        resetNode,
        inputRender,
        paramRender,
    } = useNode({ editor: editor, onChange: onChange })

    const nodeRef = useRef<HTMLDivElement>(null);

    const { setTicker } = useStock({ 
        onSuccess: (data) => {
            controls.setInputValid();
            setNode(Literal.fromDataframe(data));
        }, 
        onFailure: () => {
            controls.setInputInvalid();
            resetNode();
        }
    })
    
    const handleSubmit = (
        searchTerm: string, 
        controls: InputFieldControls
    ) => {
        switch(searchTerm.at(0)) {
            case '$':
                setTicker(searchTerm.slice(1))
                controls.setInputLoading()
                return;
            default:
                const searchResult = filterSearch(searchTerm);
                if(searchResult) {
                    controls.setInputValid()
                    setNode(searchResult)
                } else {
                    controls.setInputInvalid();
                    resetNode();
                }
        }
    }

    const setNodeColor = (color: string) => {
        if(nodeRef.current) nodeRef.current.style.backgroundColor = color;
    }
    const {
        inputFieldRender, 
        controls,
    } = useInputField({
        onFocus: () => { 
            editor.nodeFocused(paramRender); 
            setNodeColor('#4be0b649'); 
        },
        onBlur: () => setNodeColor('inherit'), 
        onSubmit: handleSubmit,
        placeholder: "search"
    })

    return (
        <div className='Node' ref={nodeRef}>
            {inputFieldRender} 
            <div className='Inputs'>
                {inputRender}
            </div>
        </div>
    )
}