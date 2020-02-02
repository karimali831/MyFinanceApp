import * as React from 'react';
import { Load } from 'src/components/base/Loader';
import { OnChangeSelectedCategoryAction, OnChangeSelectedSecondCategoryAction, LoadCategoriesAction } from 'src/state/contexts/common/Actions';
import { CategoryType } from 'src/enums/CategoryType';
import { ICategory } from 'src/models/ICategory';

export interface IOwnProps {
    categories: ICategory[],
    secondCategories: ICategory[],
    loadingCategories: boolean,
    loadingSecondCategories: boolean,
    categoryType: CategoryType,
    loadCategories: (categoryType: CategoryType) => LoadCategoriesAction
    onChangeSelectedCategory: (selectedCat: number, secondTypeId?: number) => OnChangeSelectedCategoryAction,
    onChangeSelectedSecondCategory: (selectedSecondCat: number) => OnChangeSelectedSecondCategoryAction
}

export interface IOwnState{
    selectedCat?: number | undefined,
    secondTypeId?: number | undefined,
    selectedSecondCat?: number  | undefined
}

export default class SelectCategories extends React.Component<IOwnProps, IOwnState> {

    constructor(props: IOwnProps) {
        super(props);

        this.state = {
            selectedCat: undefined,
            secondTypeId: undefined,
            selectedSecondCat: undefined
        };
    }

    public componentDidMount(){
        if (this.props.categoryType !== undefined) {
            this.props.loadCategories(this.props.categoryType);
        }
    }

    public componentDidUpdate(prevProps: IOwnProps, prevState: IOwnState) {
        if (this.state.selectedCat !== undefined) {
            if (prevState.secondTypeId !== this.state.secondTypeId || prevState.selectedCat !== this.state.selectedCat) {
                this.props.onChangeSelectedCategory(this.state.selectedCat, this.state.secondTypeId);
            }

            if (prevState.selectedSecondCat !== this.state.selectedSecondCat && this.state.selectedSecondCat !== undefined) {
                this.props.onChangeSelectedSecondCategory(this.state.selectedSecondCat);
            }
        }
    }
    
    public render() {
        return (
            <div>
                <div className="form-group">
                    {
                        this.props.loadingCategories ? <Load /> :
                        <>
                            <select onChange={e => this.onChangeSelectedCategory(e)} className="form-control">
                                <option value={0}>-- select category --</option>
                                {
                                    this.props.categories.map(c =>
                                        <option key={c.id} value={c.id + "-" + c.secondTypeId} disabled={c.disabled}>{c.name}</option>
                                    )
                                }
                            </select>
                        </>
                    }
                </div>
                <>
                    {
                        this.state.secondTypeId !== undefined ?
                            <div className="form-group">
                            {
                                this.props.loadingSecondCategories ? <Load /> :
                                <>
                                    <select onChange={e => this.onChangeSelectedSecondCategory(e)} className="form-control">
                                        <option value={0}>-- category --</option>
                                        {
                                            this.props.secondCategories.map(c =>
                                                <option key={c.id} value={c.id} disabled={c.disabled}>{c.name}</option>
                                            )
                                        }
                                    </select>
                                </>
                            }
                            </div>
                        : null
                    }
                </>
            </div>
        )
    }

    private onChangeSelectedCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        const ids = value.split("-", 2);

        console.log("selected cat = " + Number(ids[0]))
        console.log("secondTypeId = " +  ids[1] !== "null" && ids[1] !== "0" ? Number(ids[1]) : undefined)

        this.setState({ ...this.state, 
            ...{ 
                selectedCat: Number(ids[0]),
                secondTypeId: ids[1] !== "null" && ids[1] !== "0" ? Number(ids[1]) : undefined
            }
        })  
    }

    private onChangeSelectedSecondCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
        this.setState({ ...this.state, 
            ...{ 
                selectedSecondCat: Number(e.target.value)
            }
        })  
    }
}