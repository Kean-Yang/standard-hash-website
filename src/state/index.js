import React from 'react';

const AppContext = React.createContext({
    walletVisible: false,
    toggleWalletVisible: () => {},
    web3Instance: null,
    poolListRefresh: false,
    togglePLR: () => {},
});

export default AppContext;
