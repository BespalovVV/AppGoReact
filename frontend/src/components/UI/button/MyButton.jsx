import React, {useState} from "react";
import './MyButton.css';
const MyButton = ({ onClick, children, className = '', ...props }) => {
    return (
        <button className={`custom-button ${className}`} onClick={onClick} {...props}>
            {children}
        </button>
    )
}
export default MyButton