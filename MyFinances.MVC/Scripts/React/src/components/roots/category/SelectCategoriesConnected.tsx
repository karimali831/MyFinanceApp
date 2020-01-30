import IStoreState from '../../../state/IStoreState';
import { connect } from 'react-redux';
import SelectCategories, { IPropsFromState, IPropsFromDispatch } from './SelectCategories';
import { OnChangeSelectedCategoryAction, OnChangeSelectedSecondCategoryAction, LoadCategoriesAction } from 'src/state/contexts/common/Actions';

// REACT-REDUX
// Wrap stateless component with redux connected component

// Map full state to state required for component
const mapStateToProps =
    (state: IStoreState): IPropsFromState => ({
        categories: state.common.categories,
        secondCategories: state.common.secondCategories,
        loadingCategories: state.common.loadingCategories,
        loadingSecondCategories: state.common.loadingSecondCategories
    });

// Add required action creators for component
const mapPropsFromDispatch: IPropsFromDispatch =
{
    loadCategories: LoadCategoriesAction.creator,
    onChangeSelectedCategory: OnChangeSelectedCategoryAction.creator,
    onChangeSelectedSecondCategory: OnChangeSelectedSecondCategoryAction.creator
};

// This does the magic of subscribing to state changes and ensuring the wrapped
// stateless component gets all the properties it needs from the Redux state
export default connect(mapStateToProps, mapPropsFromDispatch)(SelectCategories);
