import React, { useEffect } from 'react';
import './App.scss';
import { useWallet } from 'use-wallet';
import AppRoute from './Layout/app.route';

function App () {
    const wallet = useWallet();
    const { account, connect } = wallet;

    useEffect(() => {
        // console.log(account);
        if (!account) {
            connect();
        }
    }, [account, connect]);

    return (
        <div className="App">
            <AppRoute />
        </div>
    );
}

export default App;
