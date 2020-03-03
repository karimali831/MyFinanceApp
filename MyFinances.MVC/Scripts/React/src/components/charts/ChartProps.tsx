import * as React from 'react'
import { ChartType, ChartDataType } from 'src/enums/ChartType';
import { IChartModel } from '../../models/IChart';
import { Chart } from './Chart';
import { IDateFilter } from 'src/models/IDateFilter';
import { DataType } from 'src/enums/DataType';
import { IMonthComparisonChartRequest } from 'src/api/Api';
import { CategoryType } from 'src/enums/CategoryType';

export interface IPropsFromState {
	headerTitle?: string | undefined,
	chart: IChartModel,
	chartType: ChartType,
	width: number,
	height: number,
	dateFilter: IDateFilter,
	categoryType?: CategoryType,
	dataType: DataType,
	chartDataType: ChartDataType,
	secondTypeId?: number,
	selectedCat?: number,
	selectedSecondCat?: number,
	request?: IMonthComparisonChartRequest
}

export interface IPropsFromDispatch {
	dateFilterChanged: (filter: IDateFilter, dataType: DataType,) => void,
	chartChanged?: (request: IMonthComparisonChartRequest, type: ChartDataType) => void
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
		categoryType={props.categoryType}
		dataType={props.dataType}
		chartDataType={props.chartDataType}
		secondTypeId={props.secondTypeId}
		selectedCat={props.selectedCat}
		selectedSecondCat={props.selectedSecondCat}
		chartChanged={props.chartChanged}
		dateFilterChanged={props.dateFilterChanged}
		request={props.request} />

export default ChartProps;
