import { axiosClient } from '../services/axios';

export const getMessages = async (chatSelect: string) => {
  const { data } = await axiosClient.get(`/message/list`, {
    params: {
      chatId: chatSelect,
    },
  });
  return data.data;
};

export const messageSend = async (chatSelect: string, messageInput: string) => {
  const data = await axiosClient.post('/message/send', {
    chatId: chatSelect,
    message: messageInput,
  });
  return data;
};
