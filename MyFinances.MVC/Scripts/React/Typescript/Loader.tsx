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
            <i className="fa fa-circle-o-notch fa-circle-notch fa-spin" />
            <FontAwesomeIcon icon={['fab', 'apple']} />
            {props.text && props.text != null ? <span className="text">{props.text}</span> : ""}
        </div>
    )
}