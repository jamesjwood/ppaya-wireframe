import * as React from "react";
import { IAppContext, IPageProps } from "../StateMachines/types";
import { Interpreter, State } from "xstate";
import { EventButtons } from "./EventButtons";
import { Header } from "./Header";
import { Jumbotron, Container } from "react-bootstrap";
import { States } from "../StateMachines";
import { LoginPage, SelectAnOrganization } from "../pages";

export interface IAppViewProps {
  service: Interpreter<IAppContext, any>;
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
  [States.credentialsNotFound]: LoginPage,
  [States.selectAnOrganization]: SelectAnOrganization
};

/**
 * Generates a custom or default view for each state
 */
export const AppView: React.FunctionComponent<IAppViewProps> = (props) => {
  const service = props.service;
  if (service.initialized && service.state) {
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
