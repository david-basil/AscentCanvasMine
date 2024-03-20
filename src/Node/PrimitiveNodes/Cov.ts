import { NodeInput } from "../Node";
import { Node } from '../Node'
import { totalCovariance } from "../../Statistics/Covariance";
import Dataframe from "../../Dataframe";
import { NodeParam, getParamSelection, getParamValue } from "../Params/NodeParam";
import { intersect_paramSignature } from "./Intersect";
import { roll_paramSignature } from "./Roll";

export class Covariance extends Node {
    public get inputSignature(): NodeInput[] {
        return [
            { 'id': 'SeriesA' },
            { 'id': 'SeriesB' },
        ]
    }

    public get paramSignature(): NodeParam {
        return {
            id: this.code,
            type: 'list',
            fields: [intersect_paramSignature(), roll_paramSignature()]
        }
    }

    constructor() {
        super('cov')
    }

    public apply(
        inputValues: {[k: string]: any}, 
        paramValues: NodeParam
    ): any {
        const params = {
            intersectionType: getParamSelection(paramValues, this.code + '/intersection_type') as NodeParam,
            rolling_window_size: getParamValue(paramValues, this.code + '/rolling_window/window_size') as number,
            rolling_window_offset: getParamValue(paramValues, this.code + '/rolling_window/window_offset') as number,
        }
        /** @note that the intersectionType currently goes unused */
        return (Dataframe.intersect(inputValues['SeriesA'], inputValues['SeriesB']) as Dataframe<[number, number]>)
        .roll(totalCovariance, params.rolling_window_size, params.rolling_window_offset)
    }
}

