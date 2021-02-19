import * as React from "react";
import { Events, TYPES } from "../StateMachines";
import { Button } from "react-bootstrap";
import { IOrganization } from "../StateMachines/types";

const EDF: IOrganization = {
  name: "EDF",
  type: "supplier"
};
const Windy: IOrganization = {
  name: "Windy",
  type: "generator"
};
/**
 * For events that need arguments, use these as the buttons can only raise simple events
 */
const customEvents = {
  [Events.LOGGED_IN]: {
    type: Events.LOGGED_IN,
    user: {
      username: "test@ppaya.co.uk",
      organizations: [Windy, EDF],
      emailValidated: false
    }
  },
  [Events.VIEW_TENDER]: {
    type: Events.VIEW_TENDER,
    id: "21313213"
  },
  [Events.USER_FOUND]: {
    type: Events.USER_FOUND,
    user: {
      username: "found@ppaya.co.uk",
      organizations: [Windy, EDF],
      emailValidated: true
    }
  },
  [Events.USER_CREATED]: {
    type: Events.USER_CREATED,
    user: {
      username: "created@ppaya.co.uk",
      organizations: [Windy, EDF],
      emailValidated: false
    }
  },
  [Events.USER_UPDATED]: {
    type: Events.USER_UPDATED,
    user: {
      username: "updated@ppaya.co.uk",
      organizations: [Windy, EDF],
      emailValidated: true
    }
  },
  [Events.ORGANIZATION_SELECTED]: {
    type: Events.ORGANIZATION_SELECTED,
    organization: EDF
  },
  [Events.CREDENTIALS_FOUND]: {
    type: Events.CREDENTIALS_FOUND,
    credentials: {
      id: "test@test.co.uk",
      token: "!@31231231231231£@312"
    }
  },
  [Events.CREDENTIALS_UPDATED]: {
    type: Events.CREDENTIALS_UPDATED,
    credentials: {
      id: "updated@test.co.uk",
      token: "!@31231231231231iuhliuhui£@312"
    }
  }
} as any;

const getEvent = (name: string) => {
  if (customEvents[name]) {
    return customEvents[name];
  } else {
    return { type: name };
  }
};

/**
 * Makes a list of buttons that raise the passed in events
 */
export const EventButtons: React.FunctionComponent<{
  events: string[];
  send: (event: TYPES.IAppEvent) => void;
}> = (props) => {
  return (
    <div>
      {props.events.sort().map((event: string) => (
        <Button
          key={event}
          onClick={() => {
            props.send(getEvent(event));
          }}
        >
          {event}
        </Button>
      ))}
    </div>
  );
};
