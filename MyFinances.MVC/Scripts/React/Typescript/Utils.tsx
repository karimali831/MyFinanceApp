import * as React from 'react';
import { PaymentStatus } from '../Models/IFinance';

export const intToOrdinalNumberString = (cell: any, row: any) => {
	cell = Math.round(cell);
	let numString = cell.toString();

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

export const priceFormatter = (cell: any, row: any) => {
    // `<i class='glyphicon glyphicon-gbp'></i> ${cell}`;
    return `£${cell}`;
}

export const cleanText = (text: string) => {
	return text.toString().replace(/([A-Z])/g, ' $1').trim()
}

export const boolHighlight = (bool: boolean) => {
	return <span className={"label label-" + (bool ? "success" : "danger")}>{bool ? "Yes" : "No"}</span>
}

export const monthNames = ["January", "February", "March", "April", "May","June","July", "August", "September", "October", "November","December"]

export const paymentStatus = (status: number, daysUntilDue: number) => {
	switch (status) {
		case 0:
			return <span className="label label-success">{PaymentStatus[PaymentStatus.Paid]}</span>
		case 1:
			return <span className="label label-warning">{PaymentStatus[PaymentStatus.Upcoming]} ({daysUntilDue} days)</span>
		case 2:
			return <span className="label label-danger">{PaymentStatus[PaymentStatus.Late]} ({daysUntilDue} days)</span>
		case 3:
			return <span className="label label-default">{PaymentStatus[PaymentStatus.Unknown]}</span>
		case 4:
			return <span className="label label-danger">{PaymentStatus[PaymentStatus.DueToday]} ({daysUntilDue} days)</span>
	}
}

export const rootUrl: string = window.location.origin;
export const weekSummaryUrl = (weekNo: number) => `${rootUrl}/cnw/weeksummary/${weekNo}`;
export const routeSummaryUrl = (id: string) => `${rootUrl}/cnw/routesummary/${id}`;