import { Decimal } from 'decimal.js';

Decimal.set({ toExpNeg: -30, toExpPos: 30 });

/**
 * 科学计数法转换
 * @param {*} val
 */
export function numToStr (val) {
    return Decimal(val).valueOf();
}

/**
 * input输入数字格式化
 * @export
 * @param {*} val
 * @returns
 */
export function numFmt (val, dn = 2) {
    let obj = String(val);
    // 修复第一个字符是小数点 的情况.
    if (obj !== '' && obj.substring(0, 1) === '.') obj = '0.';
    obj = obj.replace(/[^\d.]/g, ''); // 清除“数字”和“.”以外的字符
    obj = obj.replace(/\.{2,}/g, '.'); // 只保留第一个. 清除多余的
    obj = obj.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
    const str = new RegExp(`^(-)*(\\d+)\\.(\\d{${dn}}).*$`);
    obj = obj.replace(str, '$1$2.$3'); // 只能输入两个小数
    if (dn === 0) {
        obj = numToStr(parseFloat(obj));
    } else if (obj.indexOf('.') < 0) {
        // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        obj = numToStr(parseFloat(obj));
    }

    return isNaN(obj) ? 0 : obj;
}

// 格式化 固定小数位-截取
export function fmtDec (num, dec = 8) {
    const temp = parseFloat(num);
    const m = temp.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
    const decTemp = dec || Math.max(0, (m[1] || '').length - m[2]);
    // return temp.toFixed(decTemp);
    return numToStr(
        div(Math.floor(mul(temp, Math.pow(10, decTemp))), Math.pow(10, decTemp))
    );
}
// 格式化 固定小数位-进位
export function fmtDecCeil (num, dec = 8) {
    const temp = parseFloat(num);
    const m = temp.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
    const decTemp = dec || Math.max(0, (m[1] || '').length - m[2]);
    return numToStr(
        div(Math.ceil(mul(temp, Math.pow(10, decTemp))), Math.pow(10, decTemp))
    );
}

// 格式化 固定小数位-截取
export function fmtDecFixed (num, dec = 2) {
    const temp = parseFloat(num);
    if (dec === 0) {
        return temp.toFixed(0);
    }
    const m = temp.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
    const decTemp = dec || Math.max(0, (m[1] || '').length - m[2]);
    // return temp.toFixed(decTemp);
    return div(
        Math.floor(mul(temp, Math.pow(10, decTemp))),
        Math.pow(10, decTemp)
    );
}

export function FloorInter (num0, num1) {
    //num0 代表传递的小数，第二个参数是保留到小数点几位，100是2位，1000是3位
    return Math.floor(num0 * num1) / num1;
}

export function fmtToFixed (num, dec = 2) {
    return Decimal(num).toFixed(dec);
}

export function toNumber (val) {
    return Decimal(val).toNumber();
}

export function toFixedExtend (num, dec = 2) {
    const times = Math.pow(10, dec);
    const des = num * times + 0.5;
    des = parseInt(des, 10) / times;
    return des + '';
}

/**
 * 减法运算
 * @param {*} v1
 * @param {*} v2
 */
export function sub (v1, v2) {
    return Decimal.sub(v1, v2).valueOf();
}
/**
 * 加法运算
 * @param {*} v1
 * @param {*} v2
 */
export function plus (v1, v2) {
    return Decimal.add(v1, v2).valueOf();
}
/**
 * 乘法运算
 * @param {*} v1
 * @param {*} v2
 */
export function mul (v1, v2) {
    return Decimal.mul(Number(v1), Number(v2)).valueOf();
}
/**
 * 除法运算
 * @param {*} v1
 * @param {*} v2
 */
export function div (v1, v2) {
    return Decimal.div(Number(v1 || 0), Number(v2 || 0)).valueOf();
}

// 等于
export function EQ (val, compareVal) {
    return Decimal(val).eq(compareVal);
}
// 大于
export function GT (val, compareVal) {
    return Decimal(val).gt(compareVal);
}
// 大于等于
export function GE (val, compareVal) {
    return Decimal(val).gte(compareVal);
}
// 小于
export function LT (val, compareVal) {
    return Decimal(val).lt(compareVal);
}
// 小于等于
export function LE (val, compareVal) {
    return Decimal(val).lte(compareVal);
}

/**
 * 获取url参数
 * @param url
 */
export const getURLParams = (name) => {
    const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    const r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
};

export const getUrlVariable = (variable) => {
    const regExp = new RegExp('([?]|&)' + variable + '=([^&]*)(&|$)');
    const result = window.location.href.match(regExp);
    if (result) {
        return decodeURIComponent(result[2]);
    } else {
        return null;
    }
};

export function fmtZero (value) {
    return value < 10 ? '0' + value : value;
}

/**
 * 倒计时 (XXDXXH)
 * @param {*} start
 * @param {*} end
 */
export function diffDayHour (start, end) {
    const diff = end - start;
    const diffSeconds = diff / 1000;
    const D = Math.floor(diffSeconds / 24 / 60 / 60);
    const afterDay = diffSeconds - D * 24 * 60 * 60;
    const H = Math.floor(afterDay / 60 / 60);
    return `${fmtZero(D)}D ${fmtZero(H)}H`;
}

export function fmtShowTime (diffSeconds) {
    function fmtZero (value) {
        return value < 10 ? '0' + value : value;
    }
    if (diffSeconds > 60 * 60 * 24) {
        const D = Math.floor(diffSeconds / 24 / 60 / 60);
        const afterDay = diffSeconds - D * 24 * 60 * 60;
        const H = Math.floor(afterDay / 60 / 60);
        return `${fmtZero(D)}D ${fmtZero(H)}H`;
    } else {
        const H = Math.floor(diffSeconds / 60 / 60);
        const afterHour = diffSeconds - H * 60 * 60;
        const m = Math.floor(afterHour / 60);
        return `${fmtZero(H)}H ${fmtZero(m)}M`;
    }
}
/**
 * 三位一逗号,保留小数点后面数字
 */

export function toThousands (num) {
    let str = num.toString().split('.');
    const numToStr = `${parseFloat(str[0]).toLocaleString()}${str[1] ? '.' : ''}${str[1] ? str[1] : ''}` || 0;
    return numToStr;
}

/**
 * 用户地址前三位，后四位
 */
export function substringTx (num) {
    const numLength = num.length;
    return `${num.substring(0, 6)}...${num.substring(
        numLength - 4,
        numLength
    )}`;
}

/**
 * 根据精度 缩小倍数
 */

export function numDivDecimals (amount, decimals) {
    return div(Number(amount || 0), Math.pow(10, Number(decimals || 0)));
}

/**
 * 根据精度 放大倍数
 */

export function numDulDecimals (amount, decimals) {
    return mul(Number(amount || 0), Math.pow(10, Number(decimals || 0)));
}
