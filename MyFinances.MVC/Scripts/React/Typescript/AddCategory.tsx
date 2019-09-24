import * as React from 'react';
import { commonApi } from '../Api/CommonApi'
import { CategoryType } from '../Enums/CategoryType';
import { ICategory, ICategoryDTO } from '../Models/ICategory';
import { IFinanceDTO } from '../Models/IFinance';
import { Redirect } from 'react-router-dom'
import { Loader } from './Loader';
import { AddMenu } from './Menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

interface IOwnProps {
}

export interface IOwnState {
    loading: boolean,
    redirect: boolean,
    catName: string,
    selectedSecondTypeId: number,
    catsWithSubs: ICategory[],
    addSubCat: boolean,
}

export default class AddCategory extends React.Component<IOwnProps, IOwnState> {
    constructor(props: IOwnProps) {
        super(props);
        this.state = { 
            loading: false,
            redirect: false,
            catName: "",
            selectedSecondTypeId: null,
            catsWithSubs: [],
            addSubCat: false
        };
    }


    public componentDidUpdate(prevProps: IOwnProps, prevState: IOwnState) {
        if (prevState.addSubCat !== this.state.addSubCat) {
            this.loadCategoriesWithSubs()
        }
    }

    private loadCategoriesWithSubs = () => {
        commonApi.categories(null, this.state.addSubCat)
            .then(response => this.loadCategoriesSuccess(response.categories));
    }

    private loadCategoriesSuccess = (categories: ICategory[]) => {
        this.setState({ ...this.state,
            ...{ 
                loading: false, 
                catsWithSubs: categories
            }
        }) 
    }

    private addSubCat = () => {
        this.setState({ ...this.state, addSubCat: !this.state.addSubCat })
    }

    private catTxt = (addSubCat: boolean) => addSubCat ? "Category" : "Sub-Category"; 

    render() {
        const { redirect, loading } = this.state;

        if (redirect) {
            return <Redirect to='/category'/>;
        }

        if (loading) {
            return <Loader text="Loading..."/>
        }

        return (
            <div style={{margin: '0 auto', border: 1}}>
                {AddMenu("category")}
                <FontAwesomeIcon icon={faArrowRight} /> <span onClick={() => this.addSubCat()}>Add {this.catTxt(this.state.addSubCat)}</span>
                <div className="form-group">
                    <input className="form-control" type="text" value={this.state.catName} placeholder={"Enter " + this.catTxt(!this.state.addSubCat)} onChange={(e) => { this.onCatInputChanged(e);}} />
                </div>
                {
                    this.state.addSubCat ?
                    <>
                        <div className="form-group">
                            <select onChange={e => this.onChangeSelectedCategory(e)} className="form-control">
                                <option value={0}>-- select category --</option>
                                {
                                    this.state.catsWithSubs.map(c =>
                                        <option key={c.id} value={c.secondTypeId}>{c.name}</option>
                                    )
                                }
                            </select>
                        </div>
                    </> 
                    : null
                }
                <div className="form-group">
                    <input type="submit" value={"Add " + this.catTxt(!this.state.addSubCat)} onClick={() =>this.addCategory() } />
                </div>
            </div>
        )
    }

    
    private onCatInputChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ ...this.state, catName: e.target.value })
    }

    private onChangeSelectedCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
        this.setState({ ...this.state, selectedSecondTypeId: Number(e.target.value) })
    }

    private addCategory = () => {
        if (this.state.catName && this.state.catName.length > 2)
        {
            const addModel: ICategoryDTO = {
                name: this.state.catName,
                typeId: this.state.selectedSecondTypeId
            }

            commonApi.add(addModel, "categories");
            this.setState({ ...this.state, redirect: true })  
        }
        else{
            alert("Enter category name");
        }
    }
}