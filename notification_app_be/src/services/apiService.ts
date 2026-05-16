import axios from 'axios';

const BASE_URL = 'http://4.224.186.213/evaluation-service';

export const fetchNotifications = async (token: string) => {
  const response = await axios.get(`${BASE_URL}/notifications`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data || [];
};
