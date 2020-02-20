import { ChartDataSets } from 'chart.js';
import { Moment } from 'moment';

export interface IChartModel {
    labels?: Array<string | string[] | number | number[] | Date | Date[] | Moment | Moment[]>;
    datasets?: ChartDataSets[];
}


