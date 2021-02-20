// 获取当前账户
export const getAccount = () => {
    let account = window.localStorage.getItem('account') || '';
    return account;
};

// 切换账户
export const switchAccount = (account) => {
    window.localStorage.setItem('account', account);
};
