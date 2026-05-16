import axios from 'axios';

const BASE_URL = 'http://4.224.186.213/evaluation-service';

export const fetchDepots = async (token: string) => {
  const response = await axios.get(`${BASE_URL}/depots`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = response.data;
  return Array.isArray(data) ? data : (data?.depots || data?.data || []);
};

export const fetchVehicles = async (token: string) => {
  const response = await axios.get(`${BASE_URL}/vehicles`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = response.data;
  return Array.isArray(data) ? data : (data?.vehicles || data?.data || []);
};
