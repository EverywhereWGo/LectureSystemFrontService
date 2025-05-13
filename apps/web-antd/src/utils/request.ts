import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { message } from 'ant-design-vue';

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string, // API的base_url
  timeout: 10000, // 请求超时时间
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 可以在这里添加headers，例如token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  },
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data;
    // 如果返回的状态码不是200，说明接口有问题，需要提示用户
    if (res.code !== 200) {
      message.error(res.msg || 'Error');
      
      // 处理特定的错误，例如401未授权
      if (res.code === 401) {
        // 可以在这里处理未授权情况，例如清除token并重定向到登录页
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      
      return Promise.reject(new Error(res.msg || 'Error'));
    } else {
      return res;
    }
  },
  (error) => {
    console.log('请求错误：', error);
    message.error(error.message || '请求失败');
    return Promise.reject(error);
  },
);

/**
 * 封装请求方法
 * @param config 请求配置
 * @returns Promise
 */
export const request = <T = any>(config: AxiosRequestConfig): Promise<T> => {
  return service(config) as unknown as Promise<T>;
};

export default service; 