import { axiosClient } from '../services/axios';

export const changeModel = async (chatSelect: string, value: string) => {
  const data = await axiosClient.patch(`/chat/${chatSelect}`, {
    params: {
      id: value,
    },
  });
  return data;
};
