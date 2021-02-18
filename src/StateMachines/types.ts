import { EventObject } from "xstate";

export interface INavigationContext {
  username?: string;
  emailValidated?: boolean;
  organizations?: string[];
  selectedOrganization?: string;
  selectedOrganizationType?: "supplier" | "generator";
  tenderId: string;
}

export interface ILoggedInEvent extends EventObject {
  username: string;
}

export interface IOrganizationSelectedEvent extends EventObject {
  organizationName: string;
}

export interface ITenderViewEvent extends EventObject {
  id: string;
}

export type INavigationEvent =
  | ILoggedInEvent
  | EventObject
  | ITenderViewEvent
  | IOrganizationSelectedEvent;

export interface IPageProps {
  pageName: string;
  path: string;
  send: (event: INavigationEvent) => void;
  events: string[];
  context: INavigationContext;
}
