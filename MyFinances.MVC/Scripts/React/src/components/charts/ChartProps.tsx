import * as React from 'react'
import { ChartType, ChartDataType } from 'src/enums/ChartType';
import { IChartModel } from '../../models/IChart';
import { Chart } from './Chart';
import { IDateFilter } from 'src/models/IDateFilter';
import { DataType } from 'src/enums/DataType';

export interface IPropsFromState {
	headerTitle?: string | undefined,
	chart: IChartModel,
	chartType: ChartType,
	width: number,
	height: number,
	dateFilter: IDateFilter
	dataType: DataType,
	chartDataType: ChartDataType
}

export interface IPropsFromDispatch {
	dateFilterChanged: (filter: IDateFilter, dataType: DataType) => void
}

type AllProps = IPropsFromState & IPropsFromDispatch

const ChartProps: React.SFC<AllProps> = (props) =>
	<Chart
		headerTitle={props.headerTitle}
		chartType={props.chartType}
		chart={props.chart}
		width={props.width}
		height={props.height} 
		dateFilter={props.dateFilter}
		dataType={props.dataType}
		chartDataType={props.chartDataType}
		dateFilterChanged={props.dateFilterChanged} />

export default ChartProps;
