import Dataframe from '../Dataframe';
import Data from '../Dataframe'
const math = require('mathjs');
interface NumberObject {
    [key: string]: number;
}

export function randomNormalDistribution(mean: number, standardDeviation: number) {
    var u1 = Math.random();
    var u2 = Math.random();
  
    var z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    var z1 = Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2);
  
    return mean + z0 * standardDeviation;
}
  
function getRandomNumber(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

function generate_random_Data_object(x: number) {
  
    const obj: NumberObject = {};
      for (let i = 0; i < x; i++) {
          obj[String(i)] = getRandomNumber(-5, 5); // You can set any value here, for now, I'm just setting the key and value to be the same.
      }
      return obj;
}

export function generate_random_dataframe(x : number){
    return Dataframe.from(generate_random_Data_object(x))
}
// Let us list the parameters in (a_1, a_2, ..., a_k)
export function generate_AR_List(x: Array<number>, n: number) {
  
    const flist = [];
    for (let i = 0; i < x.length; i++) {
        flist.push(0)
    }
    for (let i = 0; i < n; i++) {
        var xt = randomNormalDistribution(0, 1)
        for (let k = 0; k < x.length; k++){
            xt = xt + (flist[flist.length - 1 - k] * x[k])
        }
        flist.push(xt)
    }
    return flist
}

// could generate non-staionary data but whatevs
export function generate_ar_dataframe(num_params: number, length: number) {
    let params = []
    for (let i = 0; i < num_params; i++) {
        params.push(math.random()* 2 - 1)
    }
    return [Dataframe.from(generate_AR_List(params, length)), params]
}