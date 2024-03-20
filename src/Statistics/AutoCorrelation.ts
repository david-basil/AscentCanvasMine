import Dataframe from "../Dataframe";
import { totalCorrelation } from "./Correlation";
const math = require('mathjs');

export function autoCorrelation(data: Dataframe<number>, lag: number): number{
    if (data.length < lag) return -2;
    let laggedData = data.map(
        ([key, _]) => {
            return data.atIndex(data.indexFromKey(key) - lag) as number
        },
        lag + 1,
        lag
    )

    /** Change autoregression index to start from i+1'th value of the first row*/ 

    return totalCorrelation(Dataframe.intersect(data.slice(lag), laggedData))
    
}

export function autoregression(data: Dataframe<number>, n?: number): number[] {
    let lag = n
    if (lag === undefined){
        lag = Math.round(Math.log(data.length)) // this gets our lagged values
    }
    if (data.length < lag) return [-10];
    //let mew = mean(data)
    //let nseries = center(data)                                    // take out the mean
    let row1 = [1]
    let rs = []
    for (let i = 1; i < lag; i++) {
        let k = autoCorrelation(data, i)
        row1.push(k)                   // i. e. [0, x_1, ..., x_{n-1}]
        rs.push(k)

    }
    rs.push(autoCorrelation(data, lag))
    let auto = [row1]                                           // Auto is a lag x lag matrix 
    for (let i = 1; i < lag; i++) {
        let nrow = [auto[0][i]]
        for (let j = i - 1; j > -1; j--) {
            nrow.push(auto[0][j])
        }
        for (let k = 1; k < lag - i; k++) {
            nrow.push(auto[0][k])
        }
        auto.push(nrow)
    }
    // at this point auto is our matrix that we want to invert, and then we want to 
    // multiply that to rs
    let inv = math.inv(auto);
    let final = math.multiply(inv, rs)
    return final
}

// next to do is PACF graph, function, but this is fucked up and it is fundamental
export function PACF(data: Dataframe<number>, lag: number): number[]{
    let final = []
    for (let i = 0; i < lag + 1; i++) {
        final.push((autoregression(data, i)).at(-1) as number)
    }
    return final
}

// These are now functions to test properties of time series 'how correlated thing is'

export function Ljung_Box(data: Dataframe<number>, lag: number): number{
    let T = data.length
    if (lag > (T - 1)) return -1;
    let statistic = 0
    for (let i = 1; i < lag + 1; i++) {
        statistic = statistic + (T * (T + 2)) * ((autoCorrelation(data, i)**2)/(T - i)) 
    }
    return statistic
}

// make method that estimates the returns at each day based on the given parameters, allows
// for monte carlo moves forward (show spread, probably need lots of help with)

//also we can probably make a NN that just estimates volatility?


// Creates a dataframe of predictions based on (a_1, ..., a_n) ar parameters
export function backtest_ar(data: Dataframe<number>, lags: number[]) : Dataframe<number>{
    let k = lags.length   
    lags.reverse()
    let newdata = data.map((_, pastval) => pastval.reduce(
        (prevSum, [currKey, currVal]) => {
            let index = pastval.indexFromKey(currKey)
            return prevSum + lags[index]*currVal
        }, 0
        )
    , k, k)

    return newdata
}
