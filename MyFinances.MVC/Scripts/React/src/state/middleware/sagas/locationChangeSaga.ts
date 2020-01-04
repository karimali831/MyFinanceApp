import { takeLatest, call, select, put } from "redux-saga/effects";
import { LOCATION_CHANGE, getHash, getLocation } from "connected-react-router";
import * as Route from 'route-parser';
// import { api, ISpendingSummaryResponse } from "../../../Api/Api";
import { IDateFilter } from "../../../models/IDateFilter";
import { LoadSpendingSummaryAction } from "../../contexts/landing/Actions";

interface IRoute {
    route: string,
    action: any
}

// interface IIdParam {
//     id: string,
//     secondid: string,
// }

// interface IStepParam {
//     step: string
// }

// interface ISpendingParam {
//     catId: number,
//     frequency: number,
//     interval: number,
//     isFinance: boolean,
//     isSecondCat: boolean,
//     fromDate: string,
//     toDate: string
// }

interface ISpendingSummaryParam {
    frequency: number,
    interval: number,
    fromDate: string,
    toDate: string
}


const routes: IRoute[] = [
    {
        route: '/home',
        action: function* (params: ISpendingSummaryParam) {
            const dateFilter: IDateFilter = {
                frequency: params.frequency,
                interval: params.interval,
                fromDateRange: params.fromDate,
                toDateRange: params.toDate
            }

            // const result: ISpendingSummaryResponse = yield call(api.summary, dateFilter);

            yield put(new LoadSpendingSummaryAction(dateFilter));
        
        }
    }
    // ,
    // {
    //     route: '/spending/:catId?/:frequency?/:interval?/:isFinance?/:isSecondCat?/:fromDate?/:toDate',
    //     action: function* (params: ISpendingParam) {

    //         const dateFilter: IDateFilter = {
    //             frequency: params.frequency,
    //             interval: params.interval,
    //             fromDateRange: params.fromDate,
    //             toDateRange: params.toDate
    //         }

    //         const spendingsRequest: ISpendingRequest = {
    //             catId: params.catId,
    //             dateFilter: dateFilter,
    //             isFinance: params.isFinance,
    //             isSecondCat: params.isSecondCat
    //         }

    //         const result: ISpendingResponse = yield call(api.spendings, spendingsRequest);

    //         yield put(new LoadSpendingsAction());
    //     }
    // }
];

function* locationChangeSaga() {
    yield takeLatest(LOCATION_CHANGE, doCall);
}

export function* doCall() {
    let hash: string = yield select(getHash);
    if (hash && hash.startsWith('#')) {
        hash = hash.substring(1);
    }
    const location: string = yield select(getLocation);

    if (history.pushState) {
        if (hash && hash !== "") {
            for (const r in routes) {
                const params = new Route(routes[r].route.toString().toLowerCase()).match(hash.toString().toLowerCase());
                if (params !== false) {
                    window.location.href = hash;
                    return;
                }
            }
        }
    }

    for (const r in routes) {
        const params = new Route(routes[r].route.toString().toLowerCase()).match(location.toString().toLowerCase());
        if (params !== false) {
            yield call(routes[r].action, params);
            return;
        }
    }
}

export default locationChangeSaga;
