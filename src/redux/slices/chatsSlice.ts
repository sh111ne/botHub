import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { Chats, Messages } from '../../@types/types';

import { chatGet } from '../../api/chat';

export const fetchChats = createAsyncThunk('chats/fetchChatsStatus', async () => {
  const data = await chatGet();
  return data;
});

type chatsState = {
  chats: Chats[];
  chatSelect: string;
  messages: Messages[];
  model: { value: string; label: string };
  status: 'LOADING' | 'SUCCESS' | 'ERROR';
};

const initialState: chatsState = {
  chats: [],
  chatSelect: '',
  messages: [],
  model: { value: 'gpt', label: 'ChatGPT' },
  status: 'LOADING', // 'LOADING' | 'SUCCESS' | 'ERROR'
};

export const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    setDelete: (state, action) => {
      state.chats = state.chats.filter((el) => el.id !== action.payload);
    },

    setSelectChat: (state, action) => {
      state.chatSelect = action.payload;
    },

    setMessages: (state, action) => {
      state.messages = action.payload;
    },

    setModel: (state, action) => {
      state.model = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchChats.pending, (state) => {
      state.status = 'LOADING';
      state.chats = [];
    });
    builder.addCase(fetchChats.fulfilled, (state, action) => {
      state.chats = action.payload;
      state.chatSelect = state.chats.length ? action.payload[0].id : '';
      state.status = 'SUCCESS';
    });
    builder.addCase(fetchChats.rejected, (state) => {
      state.status = 'ERROR';
      state.chats = [];
    });
  },
});

export const { setDelete, setSelectChat, setMessages, setModel } = chatsSlice.actions;
export default chatsSlice.reducer;
