import * as React from 'react';
import './Loader.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch, faSpinner } from '@fortawesome/free-solid-svg-icons'

interface IOwnProps {
    text?: string | null
    type?: string | null
}

export const Loader: React.SFC<IOwnProps> = (props) => {
    return (
        <div className={props.type != null ? props.type : "loader"}>
            <FontAwesomeIcon icon={faSpinner} />
            {
                props.text && props.text != null ? 
                    <span className="text"><strong>{props.text}</strong></span> 
                : 
                    ""
            }
        </div>
    )
}