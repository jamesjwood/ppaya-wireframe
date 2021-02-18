import * as React from "react";
import { Events } from "../StateMachines";
import { IPageProps, IOrganizationSelectedEvent } from "../StateMachines/types";
import { Header, EventButtons } from "../statelessComponents";
import { Button, Jumbotron, Container } from "react-bootstrap";

export const SelectAnOrganization: React.FunctionComponent<IPageProps> = (
  props
) => {
  return (
    <div>
      <Header {...props} />
      <Container>
        <Jumbotron>
          {props.context!.organizations!.map((orgName) => {
            const event: IOrganizationSelectedEvent = {
              type: Events.ORGANIZATION_SELECTED,
              organizationName: orgName
            };
            return (
              <Button
                onClick={() => {
                  props.send(event);
                }}
              >
                {orgName}
              </Button>
            );
          })}
          <br />
          <EventButtons events={props.events} send={props.send} />
          <br />
          State: {props.path}
          <br />
          Context: {JSON.stringify(props.context)}
        </Jumbotron>
      </Container>
    </div>
  );
};
