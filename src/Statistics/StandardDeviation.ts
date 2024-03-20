import Dataframe from "../Dataframe";
import { totalVariance, rollingVariance } from "./Variance";

/**
 * Return the total standard deviation of the dataframe as a single number.
 * @precondition data.length > 1
 */
export function totalStandardDeviation(
    data: Dataframe<number>
): number {
    return Math.sqrt(totalVariance(data));
}

/**
 * Return the rolling standard deviation of the dataframe
 * @preconditions 
 *      data.length > 1
 *      rollingWindow > 0
 *      rollingCenter < rollingWindow
 */
export function rollingStandardDeviation (
    data: Dataframe<number>,
    rollingWindow: number,
    rollingCenter: number
): Dataframe<number> {
    return rollingVariance(
        data,
        rollingWindow,
        rollingCenter
    ).map(([_, value]) => Math.sqrt(value))
}