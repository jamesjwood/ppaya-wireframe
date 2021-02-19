import * as React from "react";
import { IPageProps } from "../StateMachines/types";

export const LoginStatus: React.FunctionComponent<IPageProps> = (props) => {
  if (props.context.user && props.context.user.username) {
    return <div>You are logged in as: {props.context.user.username}</div>;
  } else {
    return <div>You are not logged in</div>;
  }
};
