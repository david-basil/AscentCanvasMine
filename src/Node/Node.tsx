/**
 * This file contains the Node class. Nodes are functions on timeseries data that
 *  can be composed with eachother. Each node has a set of inputs which come from
 *  other nodes. Each node also defines a set of parameters that can further tune
 *  their computations. Nodes also have a code that uniquely identifies them among
 *  other nodes (@todo this should be replaced with a more robust system).
 */
import { NodeParam } from "./Params/NodeParam";

/**
 * Allows a node to uniquely identify its inputs using the id.
 */
export type NodeInput = { id: string; help?: string; };

/**
 * A unit of computation within an expression.
 * Each node declares the inputs that it takes, as well as a set of parameters that can be tweaked to
 * tune its functionality.
 * 
 * @field code - The unique code that identifies this node among others.
 */
export abstract class Node {
    code: string

    /**
     * An array of the node's inputs, each with a unique id.
     */
    public abstract get inputSignature(): NodeInput[];
    /**
     * An array of the node's parameter trees.
     */
    public abstract get paramSignature(): NodeParam

    constructor(
        code: string, 
    ) {
        this.code = code;
    }

    /**
     * Apply the node's computation to the given `inputValues`
     * @param inputValues Each key is the id of an input, each value is the
     *      value that is given as input.
     * @todo - change the `any` type to the type that is passed around by nodes (timeseries)
     */
    public abstract apply(
        inputValues: {[k: string]: any},
        paramValues: NodeParam,
    ): any;
}

