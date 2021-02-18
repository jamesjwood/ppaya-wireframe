import * as React from "react";
import { INavigationContext, IPageProps } from "../StateMachines/types";
import { Interpreter, State } from "xstate";
import { EventButtons } from "./EventButtons";
import { Header } from "./Header";
import { Jumbotron, Container } from "react-bootstrap";
import { States } from "../StateMachines";
import { LoginPage, SelectAnOrganization } from "../pages";

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
      <div>
        <Header {...props} />
        <Container>
          <Jumbotron>
            <EventButtons events={props.events} send={props.send} />
            <br />
            State: {props.path}
            <br />
            Context: {JSON.stringify(props.context)}
          </Jumbotron>
        </Container>
      </div>
    );
  },
  [States.login]: (props: IPageProps) => {
    return <LoginPage {...props} />;
  },
  [States.selectAnOrganization]: (props: IPageProps) => {
    return <SelectAnOrganization {...props} />;
  },
  init: (props: IPageProps) => {
    return <div className="init">Loading</div>;
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
      const customPage = (pages as any)[pageName];
      if (customPage) {
        return customPage(props);
      } else {
        return (pages as any)["default"](props);
      }
    }
  }
  return () => {};
};
