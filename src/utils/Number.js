import { useEffect, useState } from 'react';
import * as Tools from './Tools';

export function ClaimNumer (val, dayIncome = 0.02, time = 10000) {
    const [num, setNum] = useState(val);
    useEffect(() => {
        let timer = undefined;
        if (Tools.GT(val, 0)) {
            let maxNumer = Tools.plus(val, dayIncome);  // 当日最大可收益
            let secondIncome = Tools.div(val, 36800);  // 每秒收益
            let date = new Date();
            date.setDate(date.getDate());
            date.setHours(8);
            date.setMinutes(0);
            date.setSeconds(0);
            let LengthTime = Tools.sub(new Date().getTime(), date.getTime());
            console.log(Number(Tools.mul(LengthTime, secondIncome)));
            console.log(num);
            console.log(Tools.LT(num, maxNumer));
            
            if (Tools.LT(num, maxNumer)) {
                timer = setInterval(() => {
                    setNum(Number(Tools.plus(num, secondIncome)));
                    console.log(num);
                }, time)
            } else {
                setNum(maxNumer)
                clearInterval(timer);
            }
            return num;
        } else {
            return val
        }

        // let timer = undefined;
        // timer = setInterval(() => {
        //     setNum(Number(Tools.plus(num, secondIncome)));
        //     console.log(num);
        // }, time)

        return () => {
            clearInterval(timer);
        }
    }, []);

    // function startTimer () {
    //     if (Tools.GT(val, 0)) {
    //         let maxNumer = Tools.plus(val, dayIncome);  // 当日最大可收益
    //         let secondIncome = Tools.div(val, 36800);  // 每秒收益
    //         let timer = undefined;
    //         let date = new Date();
    //         date.setDate(date.getDate());
    //         date.setHours(8);
    //         date.setMinutes(0);
    //         date.setSeconds(0);
    //         let LengthTime = Tools.sub(new Date().getTime(), date.getTime());
    //         console.log(Number(Tools.mul(LengthTime, secondIncome)));
    //         console.log(num);
    //         console.log(Tools.LT(num, maxNumer));

    //         if (Tools.LT(num, maxNumer)) {
    //             timer = setInterval(() => {
    //                 setNum(Number(Tools.plus(num, secondIncome)));
    //                 console.log(num);
    //             }, time)
    //         } else {
    //             setNum(maxNumer)
    //             clearInterval(timer);
    //         }
    //         return num;
    //     } else {
    //         return 0;
    //     }
    //     // return number;
    // }
}
