import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import axios from "axios";
import { useUserStore } from "@/store/modules/user";
import { message } from "ant-design-vue";


export interface IBaseResponse<T> {
  code: number | string;
  message: string;
  data: T;
  count?: number;
}

interface IBaseErrorRes {
  code: number;
  message: string;
}

export class Http {
  private http: AxiosInstance;
  private baseConfig: AxiosRequestConfig = { baseURL: '/api/', timeout: 15000 };
  constructor(config: AxiosRequestConfig) {
    this.http = axios.create(Object.assign(this.baseConfig, config));
    this.http.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const store = useUserStore()
        if (store.token) {
          config.headers['token'] = store.token
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      },
    );

    this.http.interceptors.response.use(
      (response: AxiosResponse) => {
        if (response.data.code ==='0') {
          return response.data;
        }
        message.error(response.data.message || '服务异常');
        return Promise.reject(response.data);
      },
      (error: AxiosError<IBaseErrorRes>) => {
        if (error.response?.status === 401) {
          const router = useRouter()
          message.error('登录状态已过期，请重新登录');
          router.push({path: '/login'})
        } else {
          message.error(error.response?.data?.message || '服务异常');
        }
        return Promise.reject(error);
      },
    );
  }

  public get<T, U extends IBaseResponse<T> = IBaseResponse<T>>(
    url: string,
    params = {},
    config?: AxiosRequestConfig,
  ): Promise<U> {
    return this.http.get(url, { ...config, params });
  }

  public post<T, U>(url: string, data: U, config?: AxiosRequestConfig): Promise<IBaseResponse<T>> {
    return this.http.post(url, data, config);
  }

  public patch<T, U>(url: string, data?: U, config?: AxiosRequestConfig): Promise<IBaseResponse<T>> {
    return this.http.patch(url, data, config);
  }

  public put<T, U>(url: string, data?: U, config?: AxiosRequestConfig): Promise<IBaseResponse<T>> {
    return this.http.put(url, data, config);
  }

  public delete<T, U>(url: string, data?: U, config?: AxiosRequestConfig): Promise<IBaseResponse<T>> {
    return this.http.delete(url, { ...config, data });
  }
}

export default new Http({});

