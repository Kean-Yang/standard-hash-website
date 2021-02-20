/*
 * @Description:
 * @Author:
 * @Date:
 * @LastEditTime:
 * @LastEditors:
 */

import axios from 'axios';
import { message } from 'antd';
import { BSAE_API_URL } from "../constants";

export const HttpRequestAxios = axios.create({
    baseURL: BSAE_API_URL,
    timeout: 20000,
});

// response 请求拦截器
HttpRequestAxios.interceptors.request.use(
    (config) => {
        if (localStorage.getItem('accessToken')) {
            // 判断是否存在accessToken，如果存在的话，则每个http header都加上token
            // let base64Token = 'Basic ' + localStorage.getItem('auth');
            config.headers.post['Content-Type'] = 'application/json';
            //config.headers.Authorization = localStorage.getItem('accessToken'); //请求头加上accessToken
        }
        return config;
    },
    (err) => {
        return Promise.reject(err);
    }
);

// response 响应拦截器
HttpRequestAxios.interceptors.response.use(
    (response) => {
        // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
        // 否则的话抛出错误
        if (response.data.code && response.data.code === 200) {
            // console.log(response.data.code);
            return response;
        } else if (response.data.code && response.data.code === 1003) {
            message.error('Failed!');
            // return response;
        } else {
            return response;
        }
    },
    // success => {
    //     return success;
    //     console.log(success)
    // },
    (error) => {
        if (error.response) {
            console.log(error.response);
            switch (error.response.status) {
                case 6:
                    // Toast.info("接口认证失败");
                    break;
                case 1002:
                    // Toast.info("授权过期");
                    break;
                case 1003:
                    // Toast.info("缺失参数");
                    break;
                case 302:
                    console.log(error.response.data.message);
                    // Toast.info(error.response.data.message);
                    break;
                case 400:
                    console.log(error.response.data.message);
                    // Toast.info(error.response.data.message);
                    break;
                case 401:
                    // Toast.info('未登录');
                    break;
                case 403:
                    // 清除token
                    // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
                    // Toast.info('重新登陆');
                    break;
                // 404请求不存在
                case 404:
                    // Toast.info('网络请求不存在');
                    break;
                // 服务错误
                case 502:
                    console.log('服务错误');
                    break;
                // 其他错误，直接抛出错误提示
                default:
                    console.log(error.response.data.message);
            }
            return Promise.reject(error.response);
        } else {
            // alert("网络出现异常，请稍后重试！！！");
            // window.location.href = "/";
        }
    }
);
