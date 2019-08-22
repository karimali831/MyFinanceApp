import * as React from 'react';

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


export const rootUrl: string = window.location.origin;
export const weekSummaryUrl = (date: string) => `${rootUrl}/cnw/weeksummary/${date}`;
