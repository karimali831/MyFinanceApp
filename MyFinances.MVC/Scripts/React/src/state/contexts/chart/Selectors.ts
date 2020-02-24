import IStoreState from 'src/state/IStoreState';
import { IChartModel } from 'src/models/IChart';
import { ChartDataSets, ChartColor } from 'chart.js';
import { CategoryType } from 'src/enums/CategoryType';
import { distinctValues } from 'src/components/utils/Utils';
import { IMonthComparisonChartRequest } from 'src/api/Api';
import { IDateFilter } from 'src/models/IDateFilter';
import { DataType } from 'src/enums/DataType';

export const getMonthComparisonChartRequest = (state: IStoreState, dateFilter: IDateFilter): IMonthComparisonChartRequest | null => {
    if (state.chart.request !== undefined) {
        return {
            catId: state.chart.request.catId,
            dateFilter: dateFilter,
            isSecondCat: state.chart.request.isSecondCat,
            isFinance: state.chart.request.isFinance
        };
    } else {
        return null;
    }
}

export const incomeExpenseByCategoryData = (state: IStoreState, dataType: DataType): IChartModel => {
    let results;
    if (DataType.SpendingSummary === dataType) {
        results = state.chart.expenseCategoryComparisonChart
    } else if (DataType.IncomeSummary === dataType) {
        results = state.chart.incomeCategoryComparisonChart;
    }

    if (results === undefined) {
        return {};
    }
 
    const dataSets: ChartDataSets[] = [];
    const config = doughnutChartConfig();

    const ds1: ChartDataSets = {
        label: results.title,
        data: results.data.map((s) => s.total),
        backgroundColor: config.backgroundColor,
        hoverBackgroundColor: config.hoverBackgroundColor
    }

    dataSets.push(ds1);

    const chartModel: IChartModel = {
        labels:  results.data.map((s) => s.monthName.substring(0, 3)),
        datasets: dataSets,
    }

    return chartModel;
}

export const incomeExpenseChartData = (state: IStoreState): IChartModel => {
    const results = state.chart.incomeExpenseComparisonChart
    const dataSets: ChartDataSets[] = [];
    const config = doughnutChartConfig();

    if (results === undefined) {
        return {};
    }

    const ds1: ChartDataSets = {
        label: "Income",
        data: results.data.filter(s => s.type === CategoryType.Incomes).map((s) => s.total),
        backgroundColor: config.backgroundColor,
        hoverBackgroundColor: config.hoverBackgroundColor
    }

    const ds2: ChartDataSets = {
        label: "Spendings",
        data: results.data.filter(s => s.type === CategoryType.Spendings).map((s) => s.total),
        backgroundColor: config.backgroundColor,
        hoverBackgroundColor: config.hoverBackgroundColor
    }

    dataSets.push(ds1, ds2);

    const labels = results.data.map((s) => s.monthName.substring(0, 3));

    const chartModel: IChartModel = {
        labels:  labels.filter(distinctValues),
        datasets: dataSets,
    }

    return chartModel;
}

export const chartSummaryData = (state: IStoreState, dataType: DataType): IChartModel => {
    let results;
    if (DataType.SpendingSummary === dataType) {
        results = state.spendingSummary.spendingSummary.slice(0, 10);
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

export const chartSummaryDataByCategory = (state: IStoreState, dataType: DataType): IChartModel => {
    let results;
    if (DataType.SpendingSummary === dataType) {
        results = state.chart.expenseCategoryComparisonChart;
    } else if (DataType.IncomeSummary === dataType) {
        results = state.chart.incomeCategoryComparisonChart;
    }

    if (results === undefined) {
        return {};
    }
 
    const dataSets: ChartDataSets[] = [];
    const config = doughnutChartConfig();

    const ds1: ChartDataSets = {
        label: results.title,
        data: results.data.map((s) => s.total),
        backgroundColor: config.backgroundColor,
        hoverBackgroundColor: config.hoverBackgroundColor
    }

    dataSets.push(ds1);

    const labels = results.data.map((s) => s.monthName.substring(0, 3));

    const chartModel: IChartModel = {
        labels:  labels.filter(distinctValues),
        datasets: dataSets,
    }

    return chartModel;
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