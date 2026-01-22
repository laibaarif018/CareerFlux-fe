import { useQuery } from '@tanstack/react-query';
import { activityService } from '@/services/activity.service';

export const useActivities = () => {
  return useQuery({
    queryKey: ['activities'],
    queryFn: async () => {
      const response = await activityService.getActivities();
      return response;
    },
  });
};

export const useActivitiesByUserId = (userId?: string) => {
  return useQuery({
    queryKey: ['activities', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');
      const response = await activityService.getActivitiesByUserId(userId);
      return response;
    },
    enabled: !!userId, // Only run query if userId exists
  });
};