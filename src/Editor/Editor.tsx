import './Style/Editor.css'
import NodeBox from '../NodeBox/NodeBox';
import { Graph } from '../Graph/Graph';
import { useState } from 'react';

export type Editor = {
    nodeFocused: (paramEditor: React.JSX.Element) => void,
}

function NodeCanvas({ editor }: { editor: Editor }) {
    const [rootValue, setRootValue] = useState()
    const [rootSignature, setRootSignature] = useState()
    const [rootNode, ] = useState(
        <NodeBox
            editor = {editor}
            onChange={(v: any, s?: any) => {setRootValue(v); setRootSignature(s);}}
        />
    )

    return <>
        <div className='NodeExpression'>
            {rootNode}
        </div>
        <div className='Graph'>
            {rootValue && (isNaN(rootValue)) ? Graph(rootValue, rootSignature) : rootValue}
        </div>
    </>
}

export function Editor() {
    const [paramRender, setParamRender] = useState<React.JSX.Element>()

    const editor: Editor = {nodeFocused: setParamRender}
    return (
        <div className='Editor'>
            <div className='NodeCanvas'>
                <NodeCanvas editor={editor}></NodeCanvas>
            </div>
            <div className='SidePane'>
                {paramRender}
            </div>
        </div>
    );
}