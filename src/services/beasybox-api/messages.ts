import type { IFile } from './files';

export type AuthorEnum = 'AGENT' | 'USER';

export interface Message {
  author: AuthorEnum;
  chatId: string;
  createdAt: Date | string;
  files: IFile[];
  id?: string;
  status: MessageStatus;
  text: string;
}

export type MessageStatus = 'ANSWERED' | 'RECEIVED';
