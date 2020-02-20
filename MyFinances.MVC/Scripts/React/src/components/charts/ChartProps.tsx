import * as React from 'react'
import { ChartType } from 'src/enums/ChartType';
import { IChartModel } from '../../models/IChart';

export interface IPropsFromState {
	chart: IChartModel,
	chartType: ChartType,
	width: number,
	height: number
}

export interface IPropsFromDispatch {
	
}

type AllProps = IPropsFromState & IPropsFromDispatch

const Chart: React.SFC<AllProps> = (props) =>
	<Chart
		chartType={ChartType.Doughnut}
		chart={props.chart}
		width={props.width}
		height={props.height} />

export default Chart;
