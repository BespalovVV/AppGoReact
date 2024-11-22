import React, { Children, createContext, useContext, useState } from 'react'

export const AuthContext = createContext(null);
const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
    const [data, setData] = useState({})
    const setValues = (values) => {
        setData(prevData => ({
            ...prevData,
            ...values,
        }));
    };
    return (
        <DataContext.Provider value={{ data, setValues }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext)