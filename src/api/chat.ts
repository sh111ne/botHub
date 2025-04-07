import { axiosClient } from '../services/axios';

export const chatDelete = async (id: string) => {
  const response = await axiosClient.delete(`/chat/${id}`);
  return response;
};

export const chatAdd = async (nameChat: string) => {
  const response = await axiosClient.post('/chat', { name: nameChat });
  return response;
};

export const chatGet = async () => {
  const { data } = await axiosClient.get('/chat/list');
  return data.data;
};
