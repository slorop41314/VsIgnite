export type ChannelType = "single" | "group"

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
  timestamp: string,
}

export interface IChannelStore {
  uuid: string;
  member_ids: Record<string, boolean>;
  type: ChannelType;
  last_message: IMessageStore;
  timestamp: string,
}

export interface IAttachment {
  uuid: string;
  create_by: string;
  url: string;
  timestamp: string;
}

export interface IMessage {
  uuid?: string;
  message: string;
  attachments: IAttachment[];
  sender?: IUser;
  members: string[];
  read_ids?: string[];
  receive_ids?: string[];
}

export interface IMessageListR {
  channel: IChannel;
  messages: IMessage[];
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
}

export interface IcChannelType {
  single: ChannelType,
  group: ChannelType,
}