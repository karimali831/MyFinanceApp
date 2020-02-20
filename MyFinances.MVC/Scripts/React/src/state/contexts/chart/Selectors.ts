import IStoreState from 'src/state/IStoreState';
import { IChartModel } from 'src/models/IChart';
import { ChartDataSets } from 'chart.js';
import { doughnutChartConfig } from '../landing/Selectors';
import { CategoryType } from 'src/enums/CategoryType';

export const incomeExpenseByCategoryData = (state: IStoreState, type: CategoryType): IChartModel => {
    let results;
    if (CategoryType.Spendings === type) {
        results = state.chart.expenseCategoryComparisonChart
    } else if (CategoryType.Incomes === type) {
        results = state.chart.incomeCategoryComparisonChart;
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
        labels:  results.map((s) => s.monthName.substring(0, 3)),
        datasets: dataSets,
    }

    return chartModel;
}

export const incomeExpenseChartData = (state: IStoreState): IChartModel => {
    const results = state.chart.incomeExpenseComparisonChart
    const dataSets: ChartDataSets[] = [];
    const config = doughnutChartConfig();

    const ds1: ChartDataSets = {
        data: results.filter(s => s.category === CategoryType[CategoryType.Incomes]).map((s) => s.total),
        backgroundColor: config.backgroundColor,
        hoverBackgroundColor: config.hoverBackgroundColor
    }

    const ds2: ChartDataSets = {
        data: results.filter(s => s.category === CategoryType[CategoryType.Spendings]).map((s) => s.total),
        backgroundColor: config.backgroundColor,
        hoverBackgroundColor: config.hoverBackgroundColor
    }

    dataSets.push(ds1, ds2);

    const chartModel: IChartModel = {
        labels:  results.map((s) => s.monthName.substring(0, 3)),
        datasets: dataSets,
    }

    return chartModel;
}