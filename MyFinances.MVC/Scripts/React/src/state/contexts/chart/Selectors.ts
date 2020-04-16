import IStoreState from 'src/state/IStoreState';
import { IChartModel } from 'src/models/IChart';
import { ChartDataSets, ChartColor } from 'chart.js';
import { distinctValues, capitalize } from 'src/components/utils/Utils';
import { IMonthComparisonChartRequest, IMonthComparisonChartResponse } from 'src/Api/Api';
import { IDateFilter } from 'src/models/IDateFilter';
import { DataType } from 'src/enums/DataType';
import { ChartDataType, ChartType, ChartLabelType } from 'src/enums/ChartType';

export const getChartDataType = (state: IStoreState): ChartDataType | undefined => 
    state.chart.type

export const getMonthComparisonChartRequest = (state: IStoreState, dateFilter: IDateFilter): IMonthComparisonChartRequest | null => {
    if (state.chart.request !== undefined) {
        return {
            catId: state.chart.request.catId,
            secondCatId: state.chart.request.secondCatId,
            dateFilter: dateFilter,
            isFinance: state.chart.request.isFinance
        };
    } else {
        return null;
    }
}

export const chartSummaryData = (state: IStoreState, dataType: DataType): IChartModel => {
    let results;
    if (DataType.SpendingSummary === dataType) {
        results = state.spendingSummary.spendingSummary.slice(0, state.spendingSummary.maxCats);
    } else if (DataType.IncomeSummary === dataType) {
        results = state.incomeSummary.incomeSummary;
    }

    if (results === undefined) {
        return {};
    }
 
    const dataSets: ChartDataSets[] = [];
    const config = doughnutChartConfig(results.length);

    const ds1: ChartDataSets = {
        data: results.map((s) => s.total),
        backgroundColor: config[0].backgroundColor, 
        hoverBackgroundColor: config[0].hoverBackgroundColor
    }

    dataSets.push(ds1);

    const chartModel: IChartModel = {
        labels:  results.map((s) => s.cat1 + " (" + s.average+")"),
        datasets: dataSets,
    }

    return chartModel;
}

// // change to line chart if showing subcat datasets
// export const getChartType = (defaultChartType: ChartType, selectedSecondCat?: number): ChartType => {
//     if (selectedSecondCat === 9999) {
//         return ChartType.Line;
//     } else {
//         return defaultChartType;
//     }
// }


export const chartData = (chartType: ChartType, chartLabelType: ChartLabelType, results?: IMonthComparisonChartResponse): IChartModel => {

    if (results === undefined) {
        return {};
    }

    const dataSets: ChartDataSets[] = [];

    let i = 0;
    for (const key in results.data)
    {
        dataSets[i] = {
            label: capitalize(key),
            data: results.data[key].map(t => t.total)
        }
        i++;
    }

    let config: ChartDataSets[] = [];
    switch (chartType)
    {
        case ChartType.Doughnut || ChartType.Bar:
            config = doughnutChartConfig(dataSets.length);

            dataSets.map((d, idx) => {
                d.backgroundColor = config[idx].backgroundColor,
                d.hoverBackgroundColor = config[idx].hoverBackgroundColor
            })
            break;

        case ChartType.Line:
            config = lineChartConfig(dataSets.length);

            dataSets.map((d, idx) => {
                d.pointBorderColor = config[idx].pointBorderColor,
                d.pointBackgroundColor = config[idx].pointBackgroundColor,
                d.borderColor = config[idx].borderColor,
                d.pointHoverBackgroundColor = config[idx].pointHoverBackgroundColor,
                d.pointBackgroundColor = config[idx].pointBackgroundColor,
                d.pointHoverBorderColor  = config[idx].pointHoverBorderColor
            })
            break;
    }

    let labels: string[] = [];

    for (const key in results.data)
    {
        switch (chartLabelType)
        {
            case ChartLabelType.MonthAbbrev:
                labels = results.data[key].map((s) => s.monthName.substring(0, 3));
                break;

            default:
                labels = results.data[key].map((s) => s.monthName);
                break;
        }
    }

    const chartModel: IChartModel = {
        labels:  labels.filter(distinctValues),
        datasets: dataSets,
    }

    return chartModel;
}

export const lineChartConfig = (datasetsCount: number) : ChartDataSets[] => {

    const dataSets: ChartDataSets[] = [];

    Array.from(Array(datasetsCount), (e, i) => {
        if (i % 2) {
            dataSets.push({
                pointBorderColor: "rgba(75,192,192,1)",
                pointBackgroundColor: "#fff",
                borderColor: '#bc5090',
                pointHoverBackgroundColor: "rgba(75,192,192,1)",
                pointHoverBorderColor: "rgba(220,220,220,1)"
            })
        } else {
            dataSets.push({
                pointBorderColor: "rgba(75,192,192,1)",
                pointBackgroundColor: "#fff",
                borderColor: '#58508d',
                pointHoverBackgroundColor: "rgba(75,192,192,1)",
                pointHoverBorderColor: "rgba(220,220,220,1)"
            })

        }
    });


    return dataSets;
}

export const doughnutChartConfig = (datasetsCount: number) : ChartDataSets[] => {
    const backgroundColors: ChartColor[] = []
    const hoverBackgroundColors: ChartColor[] = [];
    const dataSets: ChartDataSets[] = [];

    backgroundColors.push(
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        '#003f5c',
        '#2f4b7c',
        '#665191',
        '#a05195',
        '#d45087',
        '#f95d6a',
        '#ff7c43',
        '#ffa600'
    );

    hoverBackgroundColors.push(
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        '#003f5c',
        '#2f4b7c',
        '#665191',
        '#a05195',
        '#d45087',
        '#f95d6a',
        '#ff7c43',
        '#ffa600'
    )

    Array.from(Array(datasetsCount), (e, i) => {
        dataSets.push({
            backgroundColor: backgroundColors,
            hoverBackgroundColor: hoverBackgroundColors
        })
    });

    return dataSets;
}