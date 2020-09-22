import { CategoriesService } from '../categories_service';
import { EngagementCategory } from '../../../schemas/engagement_category';
import Axios, {AxiosInstance, AxiosRequestConfig} from 'axios';
import { UserToken } from '../../../schemas/user_token';
import { handleAxiosResponseErrors } from '../../common/axios/http_error_handlers';
import {EngagementJsonSerializer} from "../../../serializers/engagement/engagement_json_serializer";

export class Apiv1CategoriesService extends CategoriesService {

  constructor(baseURL: string) {
    super();
    this.axios = Axios.create({ baseURL });
    this.axios.interceptors.request.use((request: AxiosRequestConfig) => {
      request.headers.Authorization = `Bearer ${UserToken.token?.accessToken}`;
      return request;
    });
  }
  private static jsonSerializer = new EngagementJsonSerializer();
  axios?: AxiosInstance;

  async fetchCategories(): Promise<EngagementCategory[]> {
    try {
      const { data: categoriesData } = await this.axios.get(`/engagements/categories`);
      const serializedCategories = categoriesData.map(categoryMap =>
        Apiv1CategoriesService.jsonSerializer.deserialize(categoryMap)
      );
      return serializedCategories;
    } catch (e) {
      if (e.isAxiosError) {
        handleAxiosResponseErrors(e);
      } else {
        throw e;
      }
    }
  }
}
