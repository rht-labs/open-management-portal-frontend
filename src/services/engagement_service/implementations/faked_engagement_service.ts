import { EngagementService } from '../engagement_service';
import Axios, { AxiosInstance } from 'axios';
import { Engagement } from '../../../schemas/engagement_schema';

export class FakedEngagementService extends EngagementService {
  async fetchEngagements(): Promise<Engagement[]> {
    return new Array(8).fill(null).map(() => Engagement.fromFake());
  }
  async createEngagement(data: any): Promise<Engagement> {
    return Engagement.fromFake();
  }
  async saveEngagement(data: any): Promise<Engagement> {
    return data as Engagement;
  }
  async launchEngagement(data: any): Promise<Engagement> {
    return data as Engagement;
  }
}
