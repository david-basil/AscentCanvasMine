import Dataframe from '../Dataframe';
import * as tf from '@tensorflow/tfjs-node';
import { mean } from './Mean';
import { totalStandardDeviation } from './StandardDeviation';

/**
 * Return the Volatility Estimates.
 * @precondition data.length > 1
 */
export async function estimatedVolatility(
    data: Dataframe<number>
): Promise<Float32Array | Int32Array | Uint8Array> {
    // console.log("Lets go");
    const model = await tf.loadLayersModel('file://src/Statistics/tfjs_model/model.json');
    // console.log("made it here");
    const return_data = return_form(data);
    const normalized_frame = normalize(return_data);
    const mean_value = (mean(normalized_frame)) as number
    // console.log(mean_value);
    console.assert(Math.abs(mean_value) < 0.001, "Mean must be zero");

    const normalized_object = normalized_frame.toObject()
    
    const tensor_form = tf.tensor(Object.values(normalized_object));
    // console.log(tensor_form);
    const tensor_shaped = tensor_form.reshape([-1, 756, 1]);
    tensor_shaped.array().then(array => {
        // console.log(array);
    })
    const prediction = model.predict(tensor_shaped) as tf.Tensor<tf.Rank>;
    const value = prediction.data();
    return value;

}

//thomas comment: we should make the method that takes the parameters given above and generates a dataframe based on the returns of a stock
// also normalize and square returns before feeding it into volatility
export function return_form(data: Dataframe<number>): Dataframe<number> {
    let lag = 1;
    
    let laggedData = data.map(
        ([key, _]) => {
            
            return (((data.atKey(key)) as number) - (data.atKey(key - lag) as number) ) / (data.atKey((key - lag)) as number) 
        },
        lag + 1,
        lag
    )
    return laggedData;
   

 
    

}


export function normalize(data: Dataframe<number>): Dataframe<number> {
    const mew = mean(data) as number
    const sigma = totalStandardDeviation(data)
    const sample_map = (entry: [number, number]) => (entry[1] - mew) / sigma;
    return data.map(sample_map)
}