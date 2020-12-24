import React, { Component } from 'react';

interface HeaderProps {
    title: string;
}

const Header: React.FC<HeaderProps> = (props) => {
    return(
        <header>
            ...
        </header>
    );
}

export default Header;