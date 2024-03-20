import Dataframe from '../Dataframe';
import { mean } from './Mean';
import { totalStandardDeviation } from './StandardDeviation';
import { normalize } from './VolatilityEstimate';
import { generate_AR_List, generate_random_dataframe } from './data_generation'
import { totalCovariance } from './Covariance'
import {autoregression, PACF } from './AutoCorrelation'

test('random dataframe test', () => {
    const input_df = generate_random_dataframe(10)
    expect(input_df.length).toEqual(10)  
  })

test('mean_test', () => {
  const input_df = Dataframe.from([10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0])
  expect(mean(input_df)).toEqual(5)
})

test('mean_test_2', () => {
  const input_df = Dataframe.from([10])
  expect(mean(input_df)).toEqual(10)
})

test('mean_test_3', () => {
  const input_df = Dataframe.from([-10, -9, -8, -7, -6, -5, -4, -3, -2, -1, -0])
  expect(mean(input_df)).toEqual(-5)
})

test('cov_positive', () => {
  const input_df1 = Dataframe.from([0, 1, 2, 3, 4, 5, 6])
  const input_df2 = Dataframe.from([0, 2, 0, 1, 2, 1, 3]) 
  const fin_data = Dataframe.intersect(input_df1, input_df2)
  expect(totalCovariance(fin_data)).toEqual(1.5)
})

test('cov_negative', () => {
  const input_df = Dataframe.from([5, 4, 3, 2, 1])
  const input_df2 = Dataframe.from([6, 8, 8, 8, 10])
  const fin_data = Dataframe.intersect(input_df, input_df2)
  expect(totalCovariance(fin_data)).toEqual(-2)
})

test('cov_zero', () => {
  const input_df = Dataframe.from([1, 2, 3, 4, 5])
  const input_df2 = Dataframe.from([0, 2, 0, -2, 0])
  const fin_data = Dataframe.intersect(input_df, input_df2)
  expect(totalCovariance(fin_data)).toEqual(-1)
})

test('cov_small', () => {
  const input_df = Dataframe.from([1, 3])
  const input_df2 = Dataframe.from([3, 1])
  const fin_data = Dataframe.intersect(input_df, input_df2)
  expect(totalCovariance(fin_data)).toEqual(-2)
})

test('random_data_normalize', () => {
  const input_df = generate_random_dataframe(1000)
  const norm = normalize(input_df)
  const a = mean(norm)
  const b = totalStandardDeviation(norm)
  expect(a).toBeLessThan(0.01); 
  expect(a).toBeGreaterThan(-0.01);
  expect(b).toBeGreaterThan(0.98);
  expect(b).toBeLessThan(1.01)
})

test('order_2', ()  => {
  const input_df = Dataframe.from(generate_AR_List([0.2, 0.3], 1000))
  //expect(determine_order(input_df, 0.1)).toEqual(2)
})

test('order_5', () => {
  const input_df = Dataframe.from(generate_AR_List([0.2, 0.3, -0.3, 0.4, 0.4], 1000))
  //expect(determine_order(input_df, 0.1)).toEqual(7)
})

test('autoregression_5', () => {
  const input_df = autoregression(Dataframe.from(generate_AR_List([0.2, 0.3, -0.3, 0.4, 0.4], 1000)))
  expect(input_df).toEqual([1, 2, 3, 4, 5])
})

test('PACF_5', () => {
  const input_df = PACF(Dataframe.from(generate_AR_List([0.2, 0.3, -0.3, 0.4, 0.4], 1000)), 5)
  expect(input_df).toEqual([1, 2, 3, 4, 5])
})