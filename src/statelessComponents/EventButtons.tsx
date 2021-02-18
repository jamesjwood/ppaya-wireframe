import * as React from "react";
import { Events, TYPES } from "../StateMachines";
import { Button } from "react-bootstrap";

/**
 * For events that need arguments, use these as the buttons can only raise simple events
 */
const customEvents = {
  [Events.LOGGED_IN]: {
    type: Events.LOGGED_IN,
    username: "test@ppaya.co.uk"
  },
  [Events.VIEW_TENDER]: {
    type: Events.VIEW_TENDER,
    id: "21313213"
  },
  [Events.USER_UPDATED]: {
    type: Events.USER_UPDATED,
    username: "manualyUpdated@ppaya.co.uk"
  },
  [Events.ORGANIZATION_SELECTED]: {
    type: Events.ORGANIZATION_SELECTED,
    organizationName: "EDF"
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
  send: (event: TYPES.INavigationEvent) => void;
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
