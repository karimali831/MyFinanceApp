import * as React from 'react'
import { RefinementInput } from './RefinementInput';
import { IBaseModel } from 'src/models/ISummaryBaseModel';

interface IOwnState {
    filter: string,
    loading: boolean
    showResults: boolean
}

interface IOwnProps<T> {
    filter?: string,
    filteredResults: T[],
    filterChanged: (filter: string) => void
}

export class SelectionRefinement<T extends IBaseModel<T>> extends React.Component<IOwnProps<T>, IOwnState> {

    private inputRef = React.createRef<RefinementInput>();

    constructor(props: IOwnProps<T>) {
        super(props);

        this.state = {
            filter: this.props.filter !== undefined ? this.props.filter : "",
            loading: false,
            showResults: false
        };
    }

    public render() {
        return (
            <div className="form-group form-group-lg">
                <RefinementInput ref={this.inputRef} filter={this.state.filter} onChange={(e) => this.keywordsChanged(e)} placeholder="What are you looking for?" />
            </div>
        );
    }

    public componentDidMount = () => {
        this.focusInput()
    }

    public componentDidUpdate = (prevProps: IOwnProps<T>, prevState: IOwnState) => {
        if (prevState.filter !== this.state.filter) {
            this.props.filterChanged(this.state.filter);
        }
    }

    public focusInput = () => {
        if (this.inputRef.current) {
            this.inputRef.current.focus();
        }
    }

    private keywordsChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        const filter = e.target.value;

        this.setState({
            filter: filter
        });
    }

}