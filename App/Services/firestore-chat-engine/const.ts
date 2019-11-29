import { IcChannelType } from "./interface";

export const CHANNEL_TYPE: IcChannelType = {
  single: "single",
  group: "group",
}

export const FIRE_ENGINE_EVENT = {
  ready: 'ready',
  init_failure: 'init-failure',
  error: 'error',
  user_list: 'user_list',
  channel_list: 'channel_list',
  message_list: 'message_list',
  receive_message: 'receive_message',
  send_message: 'send_message',
}