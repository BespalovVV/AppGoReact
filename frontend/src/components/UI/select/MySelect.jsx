import React from "react";
import classes from './MySelect.module.css';

const MySelect = ({ options, defaultValue, value, onChange }) => {
    return (
        <select
            className={classes.select} // Применяем класс для селекта
            value={value}
            onChange={event => onChange(event.target.value)}
        >
            <option value="">{defaultValue}</option>
            {options.map(option => 
                <option key={option.value} value={option.value} className={classes.option}>
                    {option.name}
                </option>
            )}
        </select>
    );
};

export default MySelect;