import React, { forwardRef } from "react";
import classes from './MyTextarea.module.css';

const MyTextarea = forwardRef((props, ref) => {
    return <textarea ref={ref} className={classes.myTextarea} {...props} />;
});

export default MyTextarea;