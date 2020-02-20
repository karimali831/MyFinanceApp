import * as React from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { ChartType } from 'src/enums/ChartType';
import { IChartModel } from '../../models/IChart';

interface IOwnState {

}

interface IOwnProps {
	chartType: ChartType,
	chart: IChartModel,
	width: number,
	height: number
}

export class Chart extends React.Component<IOwnProps, IOwnState> {
	
    public render() {
        return (
            <div id="summary-chart">
				{this.chart()}
            </div>
        );
	}
	
	private chart = () => {
		switch (this.props.chartType) {
			case ChartType.Doughnut: 
				return <Doughnut data={this.props.chart} width={this.props.width} height={this.props.height} options={{ maintainAspectRatio: false }} />;
			case ChartType.Bar: 
				return <Bar data={this.props.chart} width={this.props.width} height={this.props.height} options={{ maintainAspectRatio: false }} />;
			default:
				return "";
		}
	}
}

