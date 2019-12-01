export type ChannelType = "single" | "group"
export type QueryDirection = 'asc' | 'ASC' | 'desc' | 'DESC';

export interface IUser {
  email?: string,
  fullname?: string,
  uuid?: string,
  photo?: string,
}

export interface IChannel {
  uuid: string;
  members: IUser[];
  type: ChannelType;
  last_message: IMessage;
  timestamp: number;
  update_at: number;
}

export interface IChannelStore {
  uuid: string;
  member_ids: Record<string, boolean>;
  type: ChannelType;
  last_message: IMessageStore;
  timestamp: number;
  update_at: number;
}

export interface IAttachment {
  uuid: string;
  create_by: string;
  url: string;
  timestamp: number;
}

export interface IMessage {
  uuid?: string;
  message: string;
  attachments: IAttachment[];
  sender?: IUser;
  members: string[];
  read_ids?: string[];
  receive_ids?: string[];
  timestamp: number;
  update_at: number;
}

export interface IMessageListR {
  channel: IChannel;
  messages: IMessage[];
}

export interface IMessageR {
  channel: IChannel;
  message: IMessage;
}

export interface IMessageStore {
  uuid?: string;
  message: string;
  attachments: IAttachment[];
  sender: string;
  members: string[];
  read_ids: string[];
  receive_ids: string[];
  deleted: boolean;
  timestamp: number;
  update_at: number;
}

export interface IcChannelType {
  single: ChannelType,
  group: ChannelType,
}