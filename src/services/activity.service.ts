import { HttpService } from "@/lib/http";

export interface IActivity {
  _id: string;
  userId: string;
  action: string;
  jobId?: string;
  metadata?: {
    resumeId?: string;
    fileName?: string;
    [key: string]: any;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

class ActivityService extends HttpService {
  private prefix = '/activity'; // Adjust this to match your API endpoint

  getActivities = () => {
    return this.get<IActivity[]>(`${this.prefix}/recent`);
  };

  getActivitiesByUserId = (userId: string) => {
    return this.get<IActivity[]>(`${this.prefix}/user/${userId}`);
  };
}

export const activityService = new ActivityService();
