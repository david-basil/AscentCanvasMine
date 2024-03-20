/**
 * This file specifies human-editable parameters for nodes. These parameters are arranged
 * in a tree structure, and can either be:
 * - empty: A parameter that does nothing. Act as flags for options to have named fields.
 * - number: A parameter that exposes a single number to the user, with an optional set of
 *      constraints imposed on that number.
 * - list: A folder-like list of parameters.
 * - option: A parameter that can be one of finitely many options.
 */
import { Constraint } from "./Constraint";

/**
 * User-provided constants that specify how the node should operate.
 * Note that any instance of a NodeParam definition must provide sensible defaults
 * for all fields.
 */
export type NodeParam = {id: string, help?: string} & 
    ( {type: 'empty'}
    | {type: 'number', value: number, constraint?: Constraint}
    | {type: 'list', fields: Array<NodeParam>}
    /** @selectedField is the id of the sub-param that is selected */
    | {type: 'option', selectedField: string, fields: Array<NodeParam>}
    )

/**
 * Find a param in the given nodeParam tree based on the given sequence of ids
 * to check from path_elements. Note that path_elements is an array of paths,
 * which differs from getNodeFromPath which uses a string path.
 * 
 * @example
 *      $ getParamFromPathElements(
 *          {id: 'root', type: 'list', fields: [{id: 'leaf', type: 'empty'}]}, 
 *          ['root', 'leaf'] 
 *      );
 *      $ {id: 'leaf', type: 'empty'}
 * 
 * @precondition
 *      - path_elements represents a valid path.
 * 
 * @note this function is a helper function and is not exported.
 * 
 * @param nodeParam The param tree to search in
 * @param path_elements an ordered list of ids to traverse to in order to find
 *  the desired param
 * @returns the param if it was found, or undefined otherwise.
 */
function getParamFromPathElements(
    nodeParam: NodeParam, 
    path_elements: string[]
): NodeParam | undefined {
    if(path_elements.length === 0) return undefined;
    if(path_elements[0] !== nodeParam.id) return undefined;

    if(path_elements.length === 1) return nodeParam;
    switch(nodeParam.type) {
        case "empty": case "number":
            // If this code is reached then path_elements.length > 1 which doesn't make sense
            // for a leaf node.
            return undefined;
        case "list": case "option":
            let nextNode = nodeParam.fields.find((field) => field.id === path_elements[1]);
            if(nextNode === undefined) return undefined
            else return getParamFromPathElements(
                nextNode,
                path_elements.slice(1)
            )
    }
}

/**
 * Find a param in the given nodeParam tree based on the given sequence of ids
 * in `path`. Note that `path` is a string of ids representing the path to
 * the param, with each id followed by `/`.
 * 
 * @example
 *      $ getParam(
 *          {id: 'root', type: 'list', fields: [{id: 'leaf', type: 'empty'}]}, 
 *          'root/leaf'
 *      );
 *      $ {id: 'leaf', type: 'empty'}
 * 
 * @precondition
 *      - path represents a valid path.
 * 
 * @param nodeParam The param tree to search in
 * @param path An ordered sequence of ids, separated by `/`, that represent the
 * path from the root `nodeParam` to the param that you wish to find.
 * @returns the param if it was found, or undefined otherwise.
 */
export function getParam(nodeParam: NodeParam, path: string) {
    return getParamFromPathElements(nodeParam, path.split('/'))
}

/**
 * Find a param in the given nodeParam tree based on the given sequence of ids
 * in `path`. This path must lead to a param of type `number`.
 * 
 * @example
 *      $ getParamValue(
 *          {id: 'root', type: 'list', fields: [{id: 'leaf', type: 'number', value: 4}]}, 
 *          'root/leaf'
 *      );
 *      $ 4
 * 
 * @precondition
 *      - path represents a valid path to a number param.
 * 
 * @param nodeParam The param tree to search in
 * @param path An ordered sequence of ids, separated by `/`, that represent the
 * path from the root `nodeParam` to the number param that you wish to find.
 * @returns the value of the number at the given param, or undefined if it wasn't found.
 */
export function getParamValue(nodeParam: NodeParam, path: string): number | undefined {
    const numberParam = getParam(nodeParam, path)
    if(!numberParam || numberParam.type !== 'number') return undefined
    else return numberParam.value
}

/**
 * Find the current selection of the option param in the given nodeParam tree based on the 
 * given sequence of ids in `path`. 
 * 
 * @example
 *      $ getParamSelection(
 *          {id: 'root', type: 'option', selectedField: 'leaf', fields: [{id: 'leaf', type: 'empty'}]}, 
 *          'root'
 *      );
 *      $ {id: 'leaf', type: 'empty'}
 * 
 * @precondition
 *      - path represents a valid path to an option param.
 * 
 * @param nodeParam The param tree to search in
 * @param path An ordered sequence of ids, separated by `/`, that represent the
 * path from the root `nodeParam` to the option param that you wish to find.
 * @returns the param that is selected by the option param, or undefined if not found.
 */
export function getParamSelection(nodeParam: NodeParam, path: string): NodeParam | undefined{
    const optionParam = getParam(nodeParam, path)
    if(!optionParam || optionParam.type !== 'option') return undefined
    else return optionParam.fields.find((field) => field.id === optionParam.selectedField)
}