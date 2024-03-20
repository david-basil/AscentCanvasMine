import  DataFetcher  from './Interface';

jest.setTimeout(100000);

const SAMPLE_DATA = {
  0: 99,
  1: 99,
  2: 99,
  3: 99,
  4: 99,
  5: 99,
  6: 99,
};

const SAMPLE_WEEK_DATA = {
  0: 0,
  1: 1,
  2: 2,
  3: 3,
  4: 5,
  5: 7,
  6: 9,
};

// const week_dataframe = Dataframe.from(SAMPLE_WEEK_DATA);

function extractPrice(record: Record<string, number>): number {
  const floatValue = Object.values(record)[0]; // Assuming only one entry in the record
  const roundedNumber = Math.round(floatValue * 100) / 100; // Rounding to two decimal places
  return roundedNumber;
  
}

function extractPrices(records: Record<string, number>): number[] {
  const roundedNumbers: number[] = [];
  for (const [key, value] of Object.entries(records)) {
      const floatValue = value;
      const roundedNumber = Math.round(floatValue * 100) / 100;
      roundedNumbers.push(roundedNumber);
  }
  return roundedNumbers;
}



test('apple 2020 june day', async () => {
  // const result_returned = searchGivenTerm('AAPL', '2020-06-01', '2020-06-08');
  var result;
  try {
    result = await DataFetcher.directTimestreamQueryBasic('AAPL', '2020-06-01', '2020-06-02');
    // console.log('Data:', result);
   
    // console.log('Data:', result);
  
    // console.log('Data:', result);
  } catch (error) {
    result = SAMPLE_DATA;
    console.error('Error:', error);
    expect(error).toEqual(0)
  }
  expect(result).toEqual({"data": {"1590969600000": 78.78788757324219}});
  
})


test('tesla 2021 april week', async () => {
  // const result_returned = searchGivenTerm('AAPL', '2020-06-01', '2020-06-08');
  var result;
  try {
    result = await DataFetcher.directTimestreamQueryBasic('TSLA', '2021-04-01', '2021-04-08');
    // console.log('Data:', result);
    // console.log(result)
    
    // console.log('Data:', result);
    
    // console.log('Data:', result);
  } catch (error) {
    result = SAMPLE_DATA;
    console.error('Error:', error);
    expect(error).toEqual(0)
  }
  expect(result).toEqual({"data": {"1617235200000": 220.5833282470703, "1617580800000": 230.35000610351562, "1617667200000": 230.5399932861328, "1617753600000": 223.6566619873047}});
  
})