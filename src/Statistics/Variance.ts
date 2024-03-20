import Dataframe from '../Dataframe'
import { totalCovariance, rollingCovariance } from './Covariance'

function doubleDataframe(
    data: Dataframe<number>
): Dataframe<[number, number]> {
    return data.map(([_, value]) => [value, value])
}

/**
 * Return the total variance of the dataframe as a single number.
 * @precondition data.length > 1
 */
export function totalVariance(
    data: Dataframe<number>
): number {
    return totalCovariance(doubleDataframe(data))
}

/**
 * Return the rolling variance of the dataframe
 * @preconditions 
 *      data.length > 1
 *      rollingWindow > 0
 *      rollingCenter < rollingWindow
 */
export function rollingVariance(
    data: Dataframe<number>,
    rollingWindow: number,
    rollingCenter: number
): Dataframe<number> {
    return rollingCovariance(
        doubleDataframe(data), 
        rollingWindow,
        rollingCenter
    )
}