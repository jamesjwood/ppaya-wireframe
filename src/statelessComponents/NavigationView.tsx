import * as React from "react";
import { INavigationContext, IPageProps } from "../StateMachines/types";
import { Interpreter, State } from "xstate";
import { EventButtons } from "./EventButtons";
import { Header } from "./Header";
import { Jumbotron, Container } from "react-bootstrap";
import { States } from "../StateMachines";

export interface INavigationViewProps {
  service: Interpreter<INavigationContext, any>;
}

const getPagePath = (state: State<any>) => {
  const stateStrings = state.toStrings();
  const path = stateStrings[stateStrings.length - 1];
  return path;
};

const getPageName = (state: State<any>) => {
  const path = getPagePath(state);
  const pathElements = path.split(".");
  const page = pathElements[pathElements.length - 1];
  return page;
};

const pages = {
  default: (props: IPageProps) => {
    return (
      <div className="default">
        <Header {...props} />
        <Jumbotron>
          <EventButtons events={props.events} send={props.send} />
          <br />
          State: {props.path}
          <br />
          Context: {JSON.stringify(props.context)}
        </Jumbotron>
      </div>
    );
  },
  [States.login]: (props: IPageProps) => {
    return (
      <div className="login">
        <Header {...props} />
        <Jumbotron>
          Welcome to the PPAYA wireframe demo. This is generated from the
          navigation state chart. Each state has a corresponding page. Each page
          has buttons automatically generated for the possible events that can
          be raised in that state.
          <br />
          [Login control goes here]
          <br />
          <EventButtons events={props.events} send={props.send} />
          <br />
          State: {props.path}
          <br />
          Context: {JSON.stringify(props.context)}
        </Jumbotron>
      </div>
    );
  },
  init: (props: IPageProps) => {
    return <div className="init">Loading</div>;
  },
  [States.readTender]: (props: IPageProps) => {
    return (
      <div className="default">
        <Header {...props} />
        <EventButtons events={props.events} send={props.send} />
        [viewTender control goes here]
        <br />
        System state: {JSON.stringify(props.context)}
      </div>
    );
  }
};

/**
 * Generates a custom or default view for each state
 */
export const NavigationView: React.FunctionComponent<INavigationViewProps> = (
  props
) => {
  const service = props.service;
  if (service.state) {
    const pageName = getPageName(service.state);
    if (pageName) {
      const props = {
        pageName: pageName,
        path: getPagePath(service.state),
        send: service.send,
        events: service.state.nextEvents,
        context: service.state.context
      };
      const pageRender = (pages as any)[pageName];
      if (pageRender) {
        return <Container className="p-3">{pageRender(props)}</Container>;
      } else {
        return (pages as any)["default"](props);
      }
    }
  }
  return () => {};
};
