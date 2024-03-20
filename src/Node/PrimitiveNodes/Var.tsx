import { NodeInput } from "../Node";
import { Node } from '../Node'
import { totalVariance } from "../../Statistics/Variance";
import { NodeParam, getParamValue } from "../Params/NodeParam";
import { roll_paramSignature } from "./Roll";
import Dataframe from "../../Dataframe";

export class Variance extends Node {

    public get inputSignature(): NodeInput[] {
        return [ {'id': 'series', 'help': "The series to get the variance of."}];
    }

    public get paramSignature(): NodeParam {
        return {
            id: this.code,
            type: 'list', 
            fields: [ roll_paramSignature() ]
        };
    }

    constructor() {
        super('var');
    }

    public apply(
        inputValues: {[k: string]: any}, 
        paramValues: NodeParam,
    ): any {
        const params = {
            rolling_window_size: getParamValue(paramValues, this.code + '/rolling_window/window_size') as number,
            rolling_window_offset: getParamValue(paramValues, this.code + '/rolling_window/window_offset') as number,
        }
        return (inputValues['series'] as Dataframe<number>).roll(totalVariance, params.rolling_window_size, params.rolling_window_offset)
    }
}
