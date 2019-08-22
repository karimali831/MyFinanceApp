export interface ITableOptions {
    deleteRow: boolean,
    pagination?: boolean
}

export interface ITableProps {
    dataField: string; 
    text: string; 
    headerClasses?: string, 
    classes?: string
    hidden?: boolean,
    formatter?: (cell, row) => void,
    editable?: boolean
}