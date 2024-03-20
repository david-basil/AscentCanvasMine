import Dataframe from "../Dataframe"
import { Ljung_Box, PACF, autoCorrelation, backtest_ar } from "./AutoCorrelation"
import { autoregression } from "./AutoCorrelation"

const TRIVIAL_TEST_DATA = Dataframe.from({
    '0': 0,
    '1': 1,
})

const TEST_DATA = Dataframe.from({
    '0': 2.5,
    '1': 10.4,
    '2': 2.2,
    '3': 10.3,
    '4': 2.3,
    '5': 10.1,
})

const ALL_ZERO_TEST = Dataframe.from({
    '0': 0.0,
    '1': 0.0,
    '2': 0.0,
    '3': 0.0,
    '4': 0.0,
    '5': 0.0,
})

const bigdata = Dataframe.from([0, 0, -0.284, 0.352, 0.929, -0.75, -1.653, 1.26, 1.438, -1.23, -1.236, 0.811, 0.923, -0.422, 0.241, 0.972, -0.708, -0.061, 1.569, 0.217, -0.68, -1.208, -1.297, -0.01, 0.007, 1.386, -0.377, -1.36, 1.788, -0.2, 1.675, 1.423, 0.237, 2.542, -0.749, 0.067, 0.614, -0.324, 0.593, 0.553, 0.308, -1.066, -0.363, -0.067, -0.114, 0.15, 0.295, 0.701, -0.162, 1.683, 0.875, -0.566, -0.556, 2.017, 0.158, 1.096, -0.545, -0.817, 0.561, 1.772, -0.616, -0.384, 0.254, -0.695, 0.749, 1.307, -0.989, -2.469, 0.222, 0.375, 1.192, 0.241, 0.131, -2.27, -0.083, 1.757, -1.162, -0.235, 0.708, 1.267, 0.125, -1.305, 1.084, -0.918, -0.972, 1.232, 1.604, -1.037, -0.014, 0.22, -0.185, -0.023, -0.376, 0.647, 0.984, 0.622, -2.445, -0.741, 2.9, 0.641, 0.145, 0.581, 0.481, 2.351, 0.656, -0.817, -1.452, 1.024, 1.197, -1.407, 0.082, 0.716, 0.627, -0.928, -0.355, 0.037, -1.449, 2.282, 0.273, -1.989, -0.038, -0.321, -1.397, 0.117, 0.883, -0.556, 0.484, -0.202, -0.61, -0.206, 0.381, 0.72, 0.97, -1.887, 1.667, 0.619, -0.881, 0.754, 0.484, 0.037, -0.346, 1.721, 0.435, 0.278, -0.302, 0.773, -0.102, 0.1, 0.226, 1.222, 1.203, 0.433, -0.082, 0.136, 0.575, -0.248, 0.972, 1.693, -0.826, -0.58, -0.103, 0.1, -1.299, 0.796, -1.148, 0.142, 1.726, -1.372, -2.674, 1.878, 1.396, 1.361, -1.833, -0.396, 1.289, -0.103, -1.199, 0.55, 0.936, -0.402, -1.706, -0.227, 0.036, 0.251, -0.24, -1.024, 0.702, -0.271, -1.227, 1.739, 0.707, -0.333, -0.868, -0.318, 0.321, -0.346, 0.0, 1.614, 0.075, 0.137, 0.303, 0.629, 1.188, -0.451, 0.792, 0.905, -0.81, 0.538, -0.241, 0.292, -1.197, 0.773, -0.486, -0.052, -0.922, 2.083, 0.399, -0.184, -0.348, 0.067, 1.838, 0.887, -1.672, 1.261, -0.848, -0.05, -0.638, 0.98, 0.134, 0.219, 1.191, -2.311, 0.587, 0.854, -0.931, 0.215, 2.235, -1.243, -1.704, -0.034, 1.072, -0.694, 1.411, -2.508, -1.052, 0.058, 1.738, -1.565, 0.436, 0.72, -1.466, 1.515, 0.517, -1.962, 1.271, -0.191, -0.366, 1.431, 0.66, 2.263, 0.271, -2.335, -1.235, 1.668, 0.041, -0.099, 0.054, -0.322, -2.044, 0.928, 0.107, 0.559, -0.216, -1.325, 2.188, -0.119, -0.904, 0.396, -1.028, 0.634, 0.431, -0.545, -0.573, -1.135, 1.302, 1.465, -1.78, 1.271, 1.055, 1.028, -2.062, 0.217, 1.792, 0.845, 0.425, 0.056, -1.346, 0.755, 0.802, 0.274, -1.793, 1.776])
const bigdatapar = [-0.124, -0.335]

test('Autocorrelation on bigadata', () => {
    const acutal = autoCorrelation(bigdata, 1)
    const expected = bigdatapar[0]
    expect(acutal).toEqual(expected)
})

test('Autoregression on bigadata', () => {
    const acutal = autoregression(bigdata)
    const expected = bigdatapar[0]
    expect(acutal).toEqual(expected)
})

test('Autoregression on zeros', () => {
    const acutal = autoregression(ALL_ZERO_TEST)
    const expected = [0]
    expect(acutal).toEqual(expected)
})

test('PACF on bigadata', () => {
    const acutal = PACF(bigdata, 2)
    const expected = bigdatapar[0]
    expect(acutal).toEqual(expected)
})


test('AutoCorrelation - lag of zero equals one', () => {
    const actual = autoCorrelation(TEST_DATA, 0)
    const expected = 1.0
    expect(actual).toEqual(expected)
})

test('AutoCorrelation - lag of one', () => {
    const actual = autoCorrelation(TEST_DATA, 1)
    const expected = 1.0
    expect(actual).toEqual(expected)
})

test('autoregression lag of one', () => {
    const actual = autoCorrelation(TEST_DATA, 1)
    const expected = autoregression(TEST_DATA, 1)
    expect(actual).toEqual(expected[0])
}) 

test('autoregression', () => {
    const acutal = autoregression(TEST_DATA, 2)
    const expected = [-0.9, 0.9]
    expect(acutal).toEqual(expected)
})

test('Ljung_Box', () => {
    const acutal = Ljung_Box(bigdata, 3)
    const expected = 0
    expect(acutal).toEqual(expected)
})

test('Backtest_AR', () => {
    const actual = backtest_ar(bigdata, autoregression(bigdata))
    expect(actual).toEqual([1, 2, 3])
})