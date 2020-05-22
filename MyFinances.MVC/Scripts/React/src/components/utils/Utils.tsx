import * as React from 'react';
import { CategoryType } from 'src/enums/CategoryType';
import { DateFrequency } from 'src/enums/DateFrequency';
import { Priority } from 'src/enums/Priority';
import { PaymentStatus } from 'src/enums/PaymentStatus';

export const intToOrdinalNumberString = (cell: any, row: any) => {
	cell = Math.round(cell);
	const numString = cell.toString();

	// If the ten's place is 1, the suffix is always "th"
	// (10th, 11th, 12th, 13th, 14th, 111th, 112th, etc.)
	if (Math.floor(cell / 10) % 10 === 1) {
		return numString + "th";
    }
    
    // If its 0
    if (cell === 0) {
        return "";
    }

	// Otherwise, the suffix depends on the one's place as follows
	// (1st, 2nd, 3rd, 4th, 21st, 22nd, etc.)
	switch (cell % 10) {
		case 1: return numString + "st";
		case 2: return numString + "nd";
		case 3: return numString + "rd";
		default: return numString + "th";
	}
}

export const capitalize = (s: string) => {
	if (typeof s !== 'string') { return '' }
	return s.charAt(0).toUpperCase() + s.slice(1)
}

export const priceFormatter = (cell: any, row: any) => {
    // `<i class='glyphicon glyphicon-gbp'></i> ${cell}`;
    return `£${cell}`;
}

export const cleanText = (text: string) => {
	return text.toString().replace(/([A-Z])/g, ' $1').trim()
}

export const cleanText2 = (text: string) => {
	return text.replace(/[^A-Z0-9]/ig, "").toLowerCase();
}

export const boolHighlight = (bool: boolean) => {
	return <span className={"label label-" + (bool ? "success" : "danger")}>{bool ? "Yes" : "No"}</span>
}

export const monthNames = ["January", "February", "March", "April", "May","June","July", "August", "September", "October", "November","December"]

export const paymentStatus = (status: PaymentStatus, daysUntilDue: number) => {
	switch (status) {
		case PaymentStatus.Paid:
			return <span className="label label-success">{PaymentStatus[PaymentStatus.Paid]}</span>
		case PaymentStatus.Upcoming:
			return <span className="label label-warning">{PaymentStatus[PaymentStatus.Upcoming]} ({daysUntilDue} days)</span>
		case PaymentStatus.Late:
			return <span className="label label-danger">{PaymentStatus[PaymentStatus.Late]} ({daysUntilDue} days)</span>
		case PaymentStatus.Unknown:
			return <span className="label label-default">{PaymentStatus[PaymentStatus.Unknown]}</span>
		case PaymentStatus.DueToday:
			return <span className="label label-danger">{PaymentStatus[PaymentStatus.DueToday]} ({daysUntilDue} days)</span>
		case PaymentStatus.Ended:
			return <span className="label label-default">{PaymentStatus[PaymentStatus.Ended]}</span>
		default:
			return ""
	}
}

export const priorityBadge = (priority: string, label: string = "") => {
	switch (priority) {
		case Priority[Priority.Low]:
			return <span className="label label-info">{label !== "" ? label : Priority[Priority.Low]}</span>
		case Priority[Priority.Medium]:
			return <span className="label label-warning">{label !== "" ? label : Priority[Priority.Medium]}</span>
		case Priority[Priority.High]:
			return <span className="label label-danger">{label !== "" ? label : Priority[Priority.High]}</span>
		default:
			return <span className="label label-info">{label !== "" ? label : Priority[Priority.Low]}</span>
	}
}


export const rootUrl: string = process.env.NODE_ENV === "development" ? "http://localhost:53822" : window.location.origin;
export const appUrl: string = "http://localhost:3000";
export const weekSummaryUrl = (weekNo: number) => `${rootUrl}/cnw/weeksummary/${weekNo}`;
export const routeSummaryUrl = (id: string) => `${rootUrl}/cnw/routesummary/${id}`;

export const spendingSummaryChartUrl = (frequency: string, interval: number) => `${rootUrl}/finances/SpendingsSummaryChart?frequency=${frequency}&interval=${interval}`;
export const incomeSummaryChartUrl = (frequency: string, interval: number) => `${rootUrl}/finances/IncomesSummaryChart?frequency=${frequency}&interval=${interval}`;
export const incomeExpenseChartUrl = (frequency: string, interval: number) => `${rootUrl}/finances/IncomeExpenseChart?frequency=${frequency}&interval=${interval}`;
export const incomeExpenseByCategoryChartUrl = (categoryType: CategoryType, catId: number, type: string, frequency: string, interval: number) => `${rootUrl}/finances/IncomeExpenseByCategoryChart?categoryType=${categoryType}&catId=${catId}&type=${type}&frequency=${frequency}&interval=${interval}`;
export const monzoAccountSummary = () => `${rootUrl}/monzo/login`
export const monzoLogoUrl = () => `${rootUrl}/Content/Images/monzo_logo.png`
export const monzoIconUrl = () => `${rootUrl}/Content/Images/monzo_icon.png`

export const SummaryFilteredList =
	(categoryType: CategoryType, catId?: number, frequency?: DateFrequency, interval?: number, isFinance?: boolean, isSecondCat?: boolean, fromDate?: string | null, toDate?: string | null) => `${CategoryType[categoryType]}/${catId}/${frequency}/${interval}/${categoryType === CategoryType.Spendings ? isFinance + "/" : ""}${isSecondCat}/${fromDate}/${toDate}`;

export const distinctValues = (value: string, index: number, self: any) =>
	self.indexOf(value) === index;
