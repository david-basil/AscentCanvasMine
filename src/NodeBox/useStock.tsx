import { useState } from 'react'
import { useQuery } from 'react-query'
import Dataframe from '../Dataframe';
import axios from 'axios'
import { Node } from '../Node/Node';
import { Literal } from '../Node/PrimitiveNodes/Literal';

const RESULTS_ID = 'results'

function getPolygonUrl(ticker: string) {
    const API_KEY = 'po0_hlvAsrZye04FxpGdFYzQot5Zbt7W';
    const START_DATE = '2021-01-09';
    const END_DATE = '2023-11-02';
    const LIMIT = '365';
    return `https://api.polygon.io/v2/aggs/ticker/${ticker.toUpperCase()}/range/1/day/${START_DATE}/${END_DATE}?adjusted=true&sort=asc&limit=${LIMIT}&apiKey=${API_KEY}`;
}

function isValidResponseData(data: any) {
    return Object.keys(data).includes(RESULTS_ID);
}

function cleanResponseData(data: any) {
    const UNIX_MILLISECONDS_ID = "t";
    const CLOSING_ID = "c";

    return Dataframe.from(Object.fromEntries(
        data[RESULTS_ID].map((dailyData: any) => 
            [
                parseInt(dailyData[UNIX_MILLISECONDS_ID]),
                dailyData[CLOSING_ID]
            ]
        )
    ))
}

export function useStock(
    { onSuccess, onFailure }: {
        onSuccess: (data: Dataframe<number>) => void,
        onFailure: () => void,
    }
): { setTicker: (v: string) => void } {
    const [ticker, setTicker] = useState<string>('');

    const fetchStock = async () => {
        const res = await axios.get(getPolygonUrl(ticker));
        if(isValidResponseData(res.data)) {
            const data: Dataframe<number> = cleanResponseData(res.data);
            onSuccess(data);
            return
        }
        onFailure();
    }

    useQuery(ticker, fetchStock, { retry: false, enabled: (ticker.length > 0) })
    return { setTicker: setTicker }

}