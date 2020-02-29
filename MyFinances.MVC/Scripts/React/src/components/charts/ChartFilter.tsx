import * as React from 'react';
import { api, IMonthComparisonChartRequest } from 'src/api/Api';
import { ICategory } from 'src/models/ICategory';
import { IFinance } from 'src/models/IFinance';
import SelectionRefinementForChartCategories from './SelectionRefinementForChartCategories';
import { CategoryType } from 'src/enums/CategoryType';

interface IOwnState {
	loading: boolean,
	categories: ICategory[],
	finances: IFinance[],
	catId?: number | null
}
 
interface IOwnProps {
	categoryType?: CategoryType,
	request?: IMonthComparisonChartRequest,
}

export class ChartFilter extends React.Component<IOwnProps, IOwnState> {

	constructor(props: IOwnProps) {
        super(props);
        this.state = { 
            loading: true,
			categories: [],
			finances: [],
			catId: this.props.request !== undefined && this.props.request.isFinance ? this.props.request.catId : undefined
        };
    }

    public componentDidMount() {
		this.loadFinances();
	}

    public render() {
        return (
            <>
                {
                    this.props.categoryType === CategoryType.Spendings	?	
                        <div className="form-group form-group-lg">
                            <select onChange={(e) => this.onChangeSelectedFinance(e)}  id="finances" className="form-control">
                                <option value={"undefined"}>-- select finance --</option>
                                {
                                    this.state.finances.map(f => 
                                        <option key={f.id} value={f.id} selected={f.id === this.state.catId}>{f.name}</option>      
                                    )
                                }
                            </select>
                        </div>
                    : null 
                }
                {
                    (this.state.catId === undefined || this.state.catId === 0) && this.props.categoryType !== undefined ? 
                        <div className="form-group form-group-lg">
                            <SelectionRefinementForChartCategories />
                        </div>
                    : null
                }
            </>
        );
	}


	
	private onChangeSelectedFinance = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const financeId = e.target.value;
        this.setState({ ...this.state,
            ...{
                catId: financeId === "undefined" ? undefined : Number(e.target.value)
            }
        })
    }

	private loadFinances = () => {
        api.finances()
            .then(response => this.loadFinancesSuccess(response.finances));
	}
	
	private loadFinancesSuccess = (finances: IFinance[]) => {
        this.setState({ ...this.state,
            ...{ 
                loading: false, 
                finances: finances.filter(x => x.manualPayment === false)
            }
        }) 
	}

}



