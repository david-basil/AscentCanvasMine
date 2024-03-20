
import { CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Chart } from 'chart.js'
import { Line } from 'react-chartjs-2';
import Dataframe from '../Dataframe';
import { NodeInput } from "../Node/Node";

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip)

function toDataset(dataframe: Dataframe<number>, valueSignature?: NodeInput) {
    return {
        label: (valueSignature) ? valueSignature.id : 'value',
        data: Object.values(dataframe.toObject()),
        fill: false,
        borderColor: '#4fe0b6'
    }
}

export function Graph(dataframe: Dataframe<number | number[]>, signature?: NodeInput & {'type': 'timeseries', 'valueType': NodeInput[]}) {
    const keys = Object.keys(dataframe.toObject()).map((key) => new Date(Number(key)).toDateString())
    let datasets = []
    if (dataframe.width === undefined) {
        const singleFrame = dataframe as Dataframe<number>;
        datasets = [toDataset(singleFrame, signature?.valueType[0])]
    }
    else {
        const arrayFrame = dataframe as Dataframe<number[]>
        datasets = Dataframe.split(arrayFrame).map(
            (dataframe, index) => toDataset(dataframe, signature?.valueType[index])
        )
    }

    return <Line 
        data={
            {
                labels: keys,
                datasets: datasets,
            }
        } 
        options={
            {
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        mode: 'nearest'
                    }
                }
            }
        } 
    />
}