import { ChartDataSets } from 'chart.js';
import { Moment } from 'moment';

import { CategoryType } from 'src/enums/CategoryType';

export interface IMonthComparisonChart {
    yearMonth: string,
    monthName: string,
    total: number,
    type: CategoryType,
    category: string,
    secondCategory: string
}

export interface IChartSummary{
    titleDs1: string,
    titleDs2: string,
    averagedDailyDs1: string,
    averagedDailyDs2: string,
    averagedMonthlyDs1: string,
    averagedMonthlyDs2: string,
    totalSpentDs1: string,
    totalSpentDs2: string,
}

export interface IChartModel {
    labels?: Array<string | string[] | number | number[] | Date | Date[] | Moment | Moment[]>;
    datasets?: ChartDataSets[];
}