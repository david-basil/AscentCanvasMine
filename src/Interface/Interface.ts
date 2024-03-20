import Dataframe from '../Dataframe'
import { TimestreamQueryClient, QueryCommand } from "@aws-sdk/client-timestream-query";
const queryClient = new TimestreamQueryClient({ region: "us-east-2" });

const fetch = require('node-fetch');

declare global{
    var base_url: string;
    var db_name: string;
    var tbl_name: string;
}


globalThis.base_url = 'http://127.0.0.1:8000/';
globalThis.db_name = 'freshDatabase';
globalThis.tbl_name = 'freshTable';

/**
 * This came from chatGPT so I hope it works! Should fetch the json from the particular url.
 * @param url 
 * @returns 
 */
async function fetchJson(url: string): Promise<any> {
    try {
      const response = await fetch(url);
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const json = await response.json();
      return json;
    } catch (error) {
      console.error('Error fetching JSON:');
      console.error(error);
      throw error; // Rethrow the error for handling in the calling code
    }
  }

  

function countWeekdays(startDate: Date, endDate: Date): number {
    let count = 0;
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
            count++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return count;
}



function parseColumnName(info: any) {
  return info.Name == null ? "" : `${info.Name}=`;
}


function parseTimeSeries(info: { Type: { TimeSeriesMeasureValueColumnInfo: any; }; }, datum: any) {
  const timeSeriesOutput: string[] = [];
  datum.TimeSeriesValue.forEach(function (dataPoint: { Time: any; Value: any; }) {
      timeSeriesOutput.push(`{time=${dataPoint.Time}, value=${parseDatum(info.Type.TimeSeriesMeasureValueColumnInfo, dataPoint.Value)}}`)
  });

  return `[${timeSeriesOutput.join(", ")}]`
}

function parseScalarType(info: any, datum: any) {
  return parseColumnName(info) + datum.ScalarValue;
}


function parseDatum(info: { Name: any; Type: {
  TimeSeriesMeasureValueColumnInfo: null; ArrayColumnInfo: any; RowColumnInfo: any; 
}; }, datum: { NullValue: boolean | null; ArrayValue: any; RowValue: any; }) {
  if (datum.NullValue != null && datum.NullValue === true) {
      return `${info.Name}=NULL`;
  }

  const columnType = info.Type;

  // If the column is of TimeSeries Type
  if (columnType.TimeSeriesMeasureValueColumnInfo != null) {
      return parseTimeSeries(info, datum);
  }
  // If the column is of Array Type
  else if (columnType.ArrayColumnInfo != null) {
      const arrayValues = datum.ArrayValue;
      return `${info.Name}=${parseArray(info.Type.ArrayColumnInfo, arrayValues)}`;
  }
  // If the column is of Row Type
  else if (columnType.RowColumnInfo != null) {
      const rowColumnInfo = info.Type.RowColumnInfo;
      const rowValues = datum.RowValue;
      return parseRow(rowColumnInfo, rowValues);
  }
  // If the column is of Scalar Type
  else {
      return parseScalarType(info, datum);
  }
}



function parseArray(arrayColumnInfo: any, arrayValues: any[]) {
  const arrayOutput: any[] = [];
  arrayValues.forEach(function (datum) {
      arrayOutput.push(parseDatum(arrayColumnInfo, datum));
  });
  return `[${arrayOutput.join(", ")}]`
}


function parseRow(columnInfo: any, row: any): any {
  const data = row.Data;
  const rowOutput = [];

  var i;
  for ( i = 0; i < data.length; i++ ) {
      let info = columnInfo[i];
      let datum = data[i];
      rowOutput.push(parseDatum(info, datum));
  }

  return `{${rowOutput.join(", ")}}`
}


function parseQueryResult(response: any): any[] {
  const columnInfo = response.ColumnInfo;
  const rows = response.Rows;
  const all_rows: any[] = []
  // console.log("Metadata: " + JSON.stringify(columnInfo));
  // console.log("Data: ");

  rows.forEach(function (row: any) {
      all_rows.push(parseRow(columnInfo, row));
  });
  return all_rows;
}


export async function getAllRows(queryClient: TimestreamQueryClient, query: string, nextToken: any): Promise<any[]> {
  const params = new QueryCommand({
      QueryString: query
  });
  var the_answer: any[] = []
    if (nextToken) {
      params.input.NextToken = nextToken
    }

  await queryClient.send(params).then(
          async (response) => {
              const curr_ans = parseQueryResult(response);
              if (response.NextToken) {
                  the_answer = await getAllRows(queryClient, query, response.NextToken);
              }
              the_answer.push(curr_ans);
          },
          (err) => {
              console.error("Error while querying:", err);
          });
    
    return the_answer;
}


/**
 * Return the the dataframe(s?) of the data in our database that match a given search term.
 * @param keyword the search term
 */
export default class DataFetcher{
  static async directTimestreamQueryBasic(
    keyword: string,
    start_date: string,
    end_date: string,
): Promise<Dataframe<number>> {
    const data: Record<number, number> = {
        0: 69,
        1: 420,
        2: 5,
        // Add more rows as needed
    };
    const start_date_object = new Date(start_date)
    const end_date_object = new Date(end_date)
    const expected_rows = countWeekdays(start_date_object, end_date_object);
    const query = 'SELECT * FROM "' + db_name + '"."' + tbl_name + '" WHERE stock = ' +
    "'" + keyword.toLowerCase() + "'" + ' AND measure_name = ' + "'" + "close" + "'" +
    " AND time between date(TIMESTAMP " + "'" +
    start_date + "'" + ') and date(TIMESTAMP ' + "'" + end_date +
    "'" + ') ORDER BY time DESC LIMIT ' + expected_rows.toString() 
    // console.log(query)
    const dummy_dataframe: Dataframe<number> = Dataframe.from(data);
    // console.log(apiUrl);
    try {
      var the_data = await getAllRows(queryClient, query, null);
      while (Array.isArray(the_data[0])) {
        // console.log(the_data);
        the_data = the_data[0];
      }
      // console.log(the_data);
      const final_df = actually_parse_list(the_data)
      // console.log(final_df)
      // console.log(dataframe);
      return final_df;
  } catch (error) {
      console.error('Failed to fetch JSON:');
      console.error('Error:', error);
      // You may want to throw the error here instead of returning a dummy dataframe
      return dummy_dataframe
  }

}

  static async searchGivenTerm(
    keyword: string,
    start_date: string,
    end_date: string,
): Promise<Dataframe<number>> {
    const data: Record<number, number> = {
        0: 2,
        1: 420,
        2: 5,
        // Add more rows as needed
    };
    const dummy_dataframe: Dataframe<number> = Dataframe.from(data);
    var apiUrl = base_url +'stock_query/' + keyword + '/' + start_date + '/' + end_date + '/';
    // console.log(apiUrl);
    try {
      const data = await fetchJson(apiUrl);
      const dataframe: Dataframe<string> = Dataframe.from(data);
      return dataframe.map(([_, value]) => parseFloat(value));
  } catch (error) {
      console.error('Failed to fetch JSON:');
      console.error('Error:', error);
      // You may want to throw the error here instead of returning a dummy dataframe
      return dummy_dataframe
  }

}
}

function assertNotString(obj: any): void {
  if (typeof obj !== "string") {
      console.log("The object is not a string.");
  } else {
      console.error("Assertion failed: The object is a string.");
  }
}


function get_important_parts(the_entry: string): [number, number]{
  const parts = the_entry.split(/[ ,;]/)
  let found_price = false;
  let found_time = false;
  const answer: [number, number] = [0, 0];

  for (const str of parts) {
    if (str.startsWith('time=')) {
        answer[0] = Date.parse(str.substring('time='.length)); // Extract part after beginning string
    }
    else if (str.startsWith('measure_value::double=')){
      answer[1] = parseFloat(str.substring('measure_value::double='.length));
    }
  }


  // console.log(parts)
  return answer
}

function actually_parse_list(the_data: any[]): Dataframe<number> {
  const list_to_make = []
  const objectByTime: Record<number, number> = {};
  for (let i = 0; i < the_data.length; i++) {
    
    var curr_entry = the_data[i]; 
    // assertNotString(curr_entry);
    const record: Record<number, number> = {};
    
  
    const important_parts = get_important_parts(curr_entry)
    // record[get_time(curr_entry)] = get_price(curr_entry.measure_value);
    objectByTime[important_parts[0]] =  important_parts[1]
  }
  return Dataframe.from(objectByTime)
}
  // Example data
    

    // Initialize a Dataframe<[number, number]> object
    //const dataframe: Dataframe<[number, number]> = Dataframe.from(data);

    // console.log('Hello, World!');


// THIS IS HOW I TESTED BC I"M DUMB
// const result = searchGivenTerm('AAPL');
// console.log(result);