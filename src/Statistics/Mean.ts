import Dataframe from "../Dataframe";

/**
 * Return the mean of the numbers in the dataframe. If the dataframe
 * is empty, return undefined.
 * @param data the dataframe to operate on
 */
export function mean(data: Dataframe<number>): number | undefined {
    // console.log(data)
    if (data.length === 0) return undefined;
    return data.reduce(
        (sum, [_, currentValue]) => sum + currentValue, 
        0
    ) / data.length;
}

// export function meanFromProduct(data: Dataframe<[number, number]>): [number, number] | undefined {
//     if (data.length === 0) return undefined;
//     const [frameA, frameB] = Dataframe.split(data);
//     return [mean(frameA) as number, mean(frameB) as number];
// }