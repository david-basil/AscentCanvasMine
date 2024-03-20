import Dataframe from "../../Dataframe";
import { NodeInput } from "../Node";
import { Node } from "../Node";
import { NodeParam } from "../Params/NodeParam";

export class Literal<T> extends Node {
    value: T

    public get inputSignature(): NodeInput[] {
        return [];
    }

    public get paramSignature(): NodeParam {
        return {id: this.code, type: 'empty'};
    }

    public static fromDataframe(value: Dataframe<number>): Literal<Dataframe<number>> {
        return new Literal<Dataframe<number>>( value, 'timeseriesLiteral' )
    }

    constructor(value: T, code: string) {
        super(code)
        this.value = value;
    }

    public apply(): T {
        return this.value;    
    }
}
