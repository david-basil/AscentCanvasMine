/**
 * @jest-environment node
 */

import  { estimatedVolatility, normalize, return_form}  from './VolatilityEstimate';
import  { mean }  from './Mean';
import  { totalStandardDeviation }  from './StandardDeviation';
import  { totalVariance }  from './Variance';
import { Random } from "random-js";
import DataFetcher from '../Interface/Interface';
import Dataframe from '../Dataframe';

jest.setTimeout(100000);


interface NumberObject {
  [key: string]: number;
}

function getRandomNumber(min: number, max: number) {
  return Math.random() * (max - min) + min;
}


function generateData(x: number) {
  
  const obj: NumberObject = {};
  const random = new Random(); // uses the nativeMath engine
    for (let i = 0; i < x; i++) {

        obj[String(i)] = random.integer(50, 70); // You can set any value here, for now, I'm just setting the key and value to be the same.
    }
    return obj;

  
  

  return obj;
}


const SAMPLE_WEEK_DATA = {
  0: 0,
  1: 1,
  2: 2,
  3: 3,
  4: 5,
  5: 7,
  6: 9,
};

const SAMPLE_DATA_FOR_ME = {
  '0': 1,
  '1': 3,
  '2': 6,
  '3': 7,
  '4': 8,
  '5': 13
};

const ANSWER_DATA = {
  '1': 2,
  '2': 1,
  '3': 0.16666666666666666,
  '4': 0.14285714285714285,
  '5': 0.625
};


const SAMPLE_DATA_LIST = [
 1,
 3,
 0,
 7,
 8,
 13
];

test('Noramlize test one', () => {


  
  //const input_df = Dataframe.from(generateData(56));
  const input_df = Dataframe.from(SAMPLE_DATA_FOR_ME)
  // console.log(totalVariance(input_df) + '***********')
  // console.log(input_df);
  const normalized_df = normalize(input_df);
  // console.log(normalized_df);
  expect(Math.abs(mean(normalized_df) as number)).toBeLessThan(0.01);

})

test('Noramlize test two', () => {


  // const input_df = Dataframe.from(generateData(56));
  const input_df = Dataframe.from(SAMPLE_DATA_FOR_ME);
  const normalized_df = normalize(input_df);
  expect(totalStandardDeviation(normalized_df)).toEqual(1);

})

test('split test one', async () => {

  const new_df = await DataFetcher.searchGivenTerm('AAPL', '2018-06-01', '2018-06-05');
  // const input_df = Dataframe.from(generateData(56));
  expect(new_df).toEqual({"data": {"1527840000000 1": "45.330894470214844", "1528099200000 0": "45.70977020263672"}})
  const singular_df = new_df
  expect(singular_df).toEqual({"data": [45.70977020263672, 45.330894470214844]}    )
  

})

test('Return test one', () => {


  // const input_df = Dataframe.from(generateData(56));
  const input_df = Dataframe.from(SAMPLE_DATA_FOR_ME);
  const return_df = return_form(input_df);
  const expected_df = Dataframe.from(ANSWER_DATA);
  expect(return_df).toEqual(expected_df);

})


test('Volatility estimate guy number zero', async () => {
  // const result_returned = searchGivenTerm('AAPL', '2020-06-01', '2020-06-08');
  var result;
  var a;
  var b;
  var a_absolute;
  try {
    const input_df = await DataFetcher.searchGivenTerm('AAPL', '2018-06-01', '2018-06-17');
    // const input_df = Dataframe.from(generateData(757));
    // const normalized_df = normalize(input_df);
    // console.log(normalized_df);
    // console.log(input_df)
    const singular_df = input_df;
    // console.error(singular_df);
    const mean_val = await mean(singular_df) as number;
    expect(Math.abs(mean_val- 45.67164473)).toBeLessThan(0.01);
    
    
    
  } catch (error) {
    result = 0;
    console.error('Error:', error);
    expect(error).toEqual(0)
  }
  
  
})



test('Volatility estimate guy number one', async () => {
  // const result_returned = searchGivenTerm('AAPL', '2020-06-01', '2020-06-08');
  
  var result;
  var a;
  var b;
  var a_absolute;
  try {
    const input_df = await DataFetcher.searchGivenTerm('AAPL', '2018-06-01', '2021-06-17');
    // const input_df = Dataframe.from(generateData(757));
    // const normalized_df = normalize(input_df);
    // console.log(normalized_df);
    // console.log(input_df)
    const singular_df = input_df;
    result = await estimatedVolatility(singular_df);
    
    
    
    a = result[0];
    a_absolute = Math.abs(a);
    b = result[1];
  } catch (error) {
    result = 0;
    console.error('Error:', error);
    expect(error).toEqual(0)
  }
  console.log(a)
  console.log(b)
  expect(a_absolute).toBeLessThan(2);
  // expect(a).toBeLessThan(0);
  expect(b).toBeLessThan(3);
  expect(b).toBeGreaterThan(0.5);
  
})

