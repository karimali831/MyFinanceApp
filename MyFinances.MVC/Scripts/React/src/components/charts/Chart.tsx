import * as React from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { ChartType, ChartDataType } from 'src/enums/ChartType';
import { IChartModel } from '../../models/IChart';
import { ChartOptions } from 'chart.js';
import DateFilter from '../dateFilter/DateFilter';
import { IDateFilter } from 'src/models/IDateFilter';
import { DataType } from 'src/enums/DataType';

interface IOwnState {

}

interface IOwnProps {
	headerTitle?: string
	chartType: ChartType,
	chartDataType: ChartDataType,
	chart: IChartModel,
	width: number,
	height: number,
	dateFilter: IDateFilter,
	dataType: DataType,
    dateFilterChanged: (filter: IDateFilter, dataType: DataType) => void,
}

export class Chart extends React.Component<IOwnProps, IOwnState> {
	
    public render() {
        return (
            <div id="summary-chart">
				<h3>{this.props.headerTitle}</h3>
				<DateFilter 
					dateFilter={this.props.dateFilter} 
					dataType={this.props.dataType}
					chartDataType={this.props.chartDataType}
					dateFilterChanged={this.props.dateFilterChanged} />
				{this.chart()}
            </div>
        );
	}

	private chartOptions = () => {
		const options: ChartOptions = {
			maintainAspectRatio: false,
			scales: {
				yAxes: [{
				  ticks: {
					beginAtZero: true
				  }
				}]
			}
		}
		
		return options;
	}
	
	private chart = () => {
		switch (this.props.chartType) {
			case ChartType.Doughnut: 
				return <Doughnut data={this.props.chart} width={this.props.width} height={this.props.height} options={this.chartOptions()} />;
			case ChartType.Bar: 
				return <Bar data={this.props.chart} width={this.props.width} height={this.props.height} options={this.chartOptions()} />;
			default:
				return "";
		}
	}
}

