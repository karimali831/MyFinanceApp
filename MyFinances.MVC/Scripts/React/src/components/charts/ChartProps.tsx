import * as React from 'react'
import { ChartType } from 'src/enums/ChartType';
import { IChartModel } from '../../models/IChart';
import { Chart } from './Chart';

export interface IPropsFromState {
	headerTitle?: string | undefined,
	chart: IChartModel,
	chartType: ChartType,
	width: number,
	height: number
}

export interface IPropsFromDispatch {
	
}

type AllProps = IPropsFromState & IPropsFromDispatch

const ChartProps: React.SFC<AllProps> = (props) =>
	<Chart
		headerTitle={props.headerTitle}
		chartType={props.chartType}
		chart={props.chart}
		width={props.width}
		height={props.height} />

export default ChartProps;
