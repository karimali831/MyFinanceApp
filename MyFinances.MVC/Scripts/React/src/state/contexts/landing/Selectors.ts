import IStoreState from '../../../state/IStoreState';
import { IDateFilter } from '../../../models/IDateFilter';
import { IChartModel } from 'src/models/IChart';
import { ChartDataSets, ChartColor } from 'chart.js';
import { CategoryType } from 'src/enums/CategoryType';

export const incomeSummaryDateFilter = (state: IStoreState): IDateFilter => {
    return {
        frequency: state.incomeSummary.dateFilter.frequency,
        interval: state.incomeSummary.dateFilter.interval,
        fromDateRange: state.incomeSummary.dateFilter.fromDateRange,
        toDateRange: state.incomeSummary.dateFilter.toDateRange
    };
}


export const getSelectedDateFilter = (state: IStoreState): IDateFilter | null => {
    if (state.common.dateFilter !== undefined) {
        return {
            frequency: state.common.dateFilter.frequency,
            interval: state.common.dateFilter.interval,
            fromDateRange: state.common.dateFilter.fromDateRange,
            toDateRange: state.common.dateFilter.toDateRange
        };
    } else {
        return null
    }
}

export const spendingSummaryDateFilter = (state: IStoreState): IDateFilter => {
    return {
        frequency: state.spendingSummary.dateFilter.frequency,
        interval: state.spendingSummary.dateFilter.interval,
        fromDateRange: state.spendingSummary.dateFilter.fromDateRange,
        toDateRange: state.spendingSummary.dateFilter.toDateRange
    };
}

export const doughnutChartConfig = () : ChartDataSets => {
    const backgroundColors: ChartColor[] = []
    const hoverBackgroundColors: ChartColor[] = [];

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

    const config: ChartDataSets = {
        backgroundColor: backgroundColors,
        hoverBackgroundColor: hoverBackgroundColors
    }

    return config;

}

export const chartSummaryData = (state: IStoreState, type: CategoryType): IChartModel => {
    let results;
    if (CategoryType.Spendings === type) {
        results = state.spendingSummary.spendingSummary.slice(0, 10);
    } else if (CategoryType.Incomes === type) {
        results = state.incomeSummary.incomeSummary;
    }

    if (results === undefined) {
        return {};
    }
 
    const dataSets: ChartDataSets[] = [];
    const config = doughnutChartConfig();

    const ds1: ChartDataSets = {
        data: results.map((s) => s.total),
        backgroundColor: config.backgroundColor,
        hoverBackgroundColor: config.hoverBackgroundColor
    }

    dataSets.push(ds1);

    const chartModel: IChartModel = {
        labels:  results.map((s) => s.cat1),
        datasets: dataSets,
    }

    return chartModel;
}