export interface ITableOptions {
    deleteRow: boolean
}

export interface ITableProps {
    dataField: string; 
    text: string; 
    headerClasses?: string, 
    classes?: string
    hidden?: boolean
}