export interface ICNWPayment
{
    id: number,
    invoiceNo?: number,
    weekDate: Date,
    actualMiles?: number,
    actualRoutePay?: number,
    actualTotalPay?: number,
    info: string
}