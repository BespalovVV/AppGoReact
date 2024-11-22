import React, { useContext, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { publicRoutes, privateRoutes } from "../router/routes";
import { AuthContext } from "../context";
import Login from "../pages/Login";
import Error from "./Error/Error";

const AppRouter = () => {
    const { isAuth, setIsAuth } = useContext(AuthContext);
    return (
        <Routes>
            {isAuth ? (
                <>
                    {privateRoutes.map(route => (
                        <Route
                            key={route.path}
                            path={route.path}
                            element={<route.component />}
                            exact={route.exact}
                        />
                    ))}
                    <Route path="*" element={<Error />} />
                </>
            ) : (
                <>
                    {publicRoutes.map(route => (
                        <Route
                            key={route.path}
                            path={route.path}
                            element={<route.component />}
                            exact={route.exact}
                        />
                    ))}
                    <Route path="*" element={<Login />} />
                </>
            )}
        </Routes>
    );
};

export default AppRouter;