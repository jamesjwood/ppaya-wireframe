import { EventObject } from "xstate";

export interface IUser {
  username: string;
  credentialId: string;
  emailValidated: boolean;
  organizations: string[];
}
export interface ICredentials {
  id: string;
  token: string;
}

export interface IOrganization {
  id: string;
  name: string;
  type: "supplier" | "generator";
}
export interface IAppContext {
  user?: IUser;
  credentials: ICredentials;
  selectedOrganization?: IOrganization;
  tenderId: string;
}

export interface ILoggedInEvent extends EventObject {
  user: IUser;
}

export interface IOrganizationSelectedEvent extends EventObject {
  organization: IOrganization;
}

export interface ITenderViewEvent extends EventObject {
  id: string;
}

export interface ICheckedForUserEvent extends EventObject {
  data: {
    user: IUser;
  };
}

export type IAppEvent =
  | ILoggedInEvent
  | EventObject
  | ITenderViewEvent
  | IOrganizationSelectedEvent
  | ICheckedForUserEvent;

export interface IPageProps {
  pageName: string;
  path: string;
  send: (event: IAppEvent) => void;
  events: string[];
  context: IAppContext;
}
