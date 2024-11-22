import React from "react";

export const MainConteiner = ({ children, ...props }) => {
    return (
        <Container conteiner="main" maxWidth="xs">{children}</Container>
    );
};