import Dataframe from '../Dataframe'
import { totalCovariance } from './Covariance'
import { totalStandardDeviation } from './StandardDeviation'

export function totalCorrelation(
    data: Dataframe<[number, number]>
): number {
    const [dataA, dataB] = Dataframe.split(data)
    return totalCovariance(data) / (
        totalStandardDeviation(dataA) 
        * totalStandardDeviation(dataB)
    )
}

function rollingCorrelation(
    data: Dataframe<[number, number]>,
    rollingWindow: number, 
    rollingCenter: number
): Dataframe<number> {
    /**
     * @todo remove rolling functionality from here. Make a more standard
     * approach.
     */
    return Dataframe.from({})
}

/**
 * Return the correlation between `data` and itself `n` days ago
 * @param data the data to find autocorrelation of
 * @param n number of days back to find correlation with
 * This is redundant, delte soon
 */

function autoCorrelation(
    data: Dataframe<number>,
    n: number
): number {
    return totalCorrelation(
        data
        .slice(n)
        .map(([key, value]) => [
                value,
                data.atIndex(data.indexFromKey(key) - n) as number
        ])
    )
}