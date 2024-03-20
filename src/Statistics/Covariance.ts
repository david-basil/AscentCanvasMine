import Dataframe from "../Dataframe";
import { mean } from "./Mean";

/**
 * Return the tototal covariance between two data points,
 * or undefined if the dataframe is empty.
 * @precondition data.length > 1
 * @note this function treats the dataframe as two separate 
 * dataframes that share exactly the same keys, and then takes
 * the covariance of those.
 */
export function totalCovariance(
    data: Dataframe<[number, number]>
): number {
    const [dataA, dataB] = Dataframe.split(data)
    const [meanA, meanB] = [mean(dataA) as number, mean(dataB) as number]
    return data.reduce(
        (sum, [_, [valueA, valueB]]) => 
        sum + (valueA - meanA) * (valueB - meanB),
        0
    ) / (data.length - 1);
}

/**
 * Return the rolling covariance between two data points,
 * or undefined if the dataframe is empty
 * @preconditions 
 *      data.length > 1
 *      rollingWindow > 0
 *      rollingCenter < rollingWindow
 * @note this function treats the dataframe as two separate 
 * dataframes that share exactly the same keys, and then takes
 * the rolling covariance of those.
 */
export function rollingCovariance(
    data: Dataframe<[number, number]>,
    rollingWindow: number,
    rollingCenter: number,
): Dataframe<number> {
    return data
        .map((_, rollingFrame) => 
            totalCovariance(rollingFrame) as number
        , rollingWindow, rollingCenter)
}