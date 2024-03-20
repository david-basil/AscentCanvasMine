import Dataframe from "../Dataframe";
import { totalCovariance } from "./Covariance";
import { totalVariance } from "./Variance";
import { totalStandardDeviation } from "./StandardDeviation";
import { mean } from "./Mean";

const SAMPLE_DATA_FOR_ME = {
    0: 1,
    1: 2,
    2: 3,
    3: 4,
    4: 5,
    5: 6,
    6: 7,
    7: 8,
    8: 9,
    9: 10
  };

  const SAMPLE_DATA_COV_1 = {
    0: 1,
    1: 2,
    2: 3,
    3: 4,
    4: 5,
    5: 6,
    6: 7,
    7: 8,
    8: 9,
    9: 10
  };

  const SAMPLE_DATA_COV_2 = {
    0: 1,
    1: 2,
    2: 3,
    3: 4,
    4: 5,
    5: 6,
    6: 7,
    7: 8,
    8: 9,
    9: 10
  };

test('stdev test one', () => {


    // const input_df = Dataframe.from(generateData(56));
    const input_df = Dataframe.from(SAMPLE_DATA_FOR_ME);
    expect(Math.abs(totalStandardDeviation(input_df) - 3.02765)).toBeLessThan(0.01);
  
  })

test('cov test one', () => {


    // const input_df = Dataframe.from(generateData(56));
    const input_df = Dataframe.from(SAMPLE_DATA_COV_2);
    const other_input_df = Dataframe.from(SAMPLE_DATA_COV_2);
    const intersected = Dataframe.intersect(input_df, other_input_df);
    expect(Math.abs(totalCovariance(intersected) - 9.166666666)).toBeLessThan(0.01);
  
})

test('variance test one', () => {


    // const input_df = Dataframe.from(generateData(56));
    const input_df = Dataframe.from(SAMPLE_DATA_FOR_ME);
    expect(Math.abs(totalVariance(input_df) - 9.1666666666)).toBeLessThan(0.01);
  
})

test('mean test one', () => {


    // const input_df = Dataframe.from(generateData(56));
    const input_df = Dataframe.from(SAMPLE_DATA_FOR_ME);
    expect(mean(input_df)).toEqual(5.5);
  
})

 