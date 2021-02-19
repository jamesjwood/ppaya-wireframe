import * as React from "react";
import { IPageProps } from "../StateMachines/types";

export const OrganizationStatus: React.FunctionComponent<IPageProps> = (
  props
) => {
  if (props.context.selectedOrganization) {
    return (
      <div>You are managing: {props.context.selectedOrganization.name}</div>
    );
  } else {
    return null;
  }
};
