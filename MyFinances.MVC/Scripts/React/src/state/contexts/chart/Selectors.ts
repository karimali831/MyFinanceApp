import IStoreState from 'src/state/IStoreState';
import { IChartModel } from 'src/models/IChart';
import { ChartDataSets, ChartColor } from 'chart.js';
import { distinctValues } from 'src/components/utils/Utils';
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
    const config = doughnutChartConfig();

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

export const chartData = (chartType: ChartType, chartLabelType: ChartLabelType, results?: IMonthComparisonChartResponse): IChartModel => {

    if (results === undefined) {
        return {};
    }

    const dataSets: ChartDataSets[] = [];

    results.summary.map((s, idx) => {
        dataSets[idx] = {
            label: s.title,
            data: results.data[idx].map(t => t.total)
        }
    })
    
    let config: ChartDataSets[];
    switch (chartType)
    {
        case ChartType.Doughnut || ChartType.Bar:
            config = doughnutChartConfig();

            dataSets.map((d, idx) => {
                d.backgroundColor = config[idx].backgroundColor,
                d.hoverBackgroundColor = config[idx].hoverBackgroundColor
            })
            break;

        case ChartType.Line:
            config = lineChartConfig();

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
    results.data.map(d => {
        switch (chartLabelType)
        {
            case ChartLabelType.MonthAbbrev:
                labels = d.map((s) => s.monthName.substring(0, 3));
                break;

            default:
                labels = d.map((s) => s.monthName);
                break;
        }
    })

    const chartModel: IChartModel = {
        labels:  labels.filter(distinctValues),
        datasets: dataSets,
    }

    return chartModel;
}

export const lineChartConfig = () : ChartDataSets[] => {

    const dataSets: ChartDataSets[] = [];

    const configDs1: ChartDataSets = {
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        borderColor: '#bc5090',
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
    }

    const configDs2: ChartDataSets = {
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        borderColor: '#58508d',
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
    }

    dataSets.push(configDs1, configDs2);

    return dataSets;
}

export const doughnutChartConfig = () : ChartDataSets[] => {
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

    const configDs1: ChartDataSets = {
        backgroundColor: backgroundColors,
        hoverBackgroundColor: hoverBackgroundColors
    }
    
    const configDs2: ChartDataSets = {
        backgroundColor: backgroundColors,
        hoverBackgroundColor: hoverBackgroundColors
    }

    dataSets.push(configDs1, configDs2);

    return dataSets;
}