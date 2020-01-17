import * as React from 'react'
import { IDateFilter } from 'src/models/IDateFilter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { IBaseModel } from 'src/models/IIncome';
import { CategoryType } from 'src/enums/CategoryType';
import { SummaryFilteredList } from '../utils/Utils';

export interface IOwnState {
}

export interface IOwnProps<T> {
    dateFilter?: IDateFilter,
    showSecondCatSummary: string | null,
    categoryType: CategoryType,
    filteredResults: T[],
    showSecondCategory: (secondCat: string) => void
}

export default class SummaryList<T extends IBaseModel<T>> extends React.Component<IOwnProps<T>, IOwnState> {

    constructor(props: IOwnProps<T>) {
        super(props);
        this.state = {};
    }

    public render() {
        return (
            this.props.filteredResults && this.props.filteredResults.map((s, key) => 
                <tr key={key}>
                    <th scope="row">
                        <FontAwesomeIcon icon={faArrowDown} /> 
                        {
                            this.props.dateFilter !== undefined ?    
                                <Link to={SummaryFilteredList(this.props.categoryType, s.catId, this.props.dateFilter.frequency, this.props.dateFilter.interval, s.isFinance, false, this.props.dateFilter.fromDateRange, this.props.dateFilter.toDateRange)}> {s.cat1}</Link> 
                            : null
                        }
                    </th>
                    <td>
                        {s.secondCats !== null ? 
                            <div onClick={() => this.props.showSecondCategory(s.cat1)}>
                                <FontAwesomeIcon icon={faSearch} /> £{s.total}
                                {this.props.showSecondCatSummary === s.cat1 ? 
                                <>
                                    <br />
                                    <small>
                                        <i> 
                                            {s.secondCats.map((c, key2) =>   
                                                <div key={key2}>                            {
                                                   this.props.dateFilter !== null && this.props.dateFilter !== undefined ?
                                                        <> 
                                                            <Link to={SummaryFilteredList(this.props.categoryType, c.secondCatId, this.props.dateFilter.frequency, this.props.dateFilter.interval, s.isFinance, true, this.props.dateFilter.fromDateRange, this.props.dateFilter.toDateRange)}> {c.cat2}</Link> £{c.total}
                                                        </>
                                                    : null 
                                                    }
                                                </div>
                                            )}
                                        </i>
                                    </small>
                                </>
                                : null}
                            </div>
                         : "£"+s.total}
                    </td>
                </tr>
            )
        )
    }
}

