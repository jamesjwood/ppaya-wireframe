import * as React from "react";
import { IPageProps } from "../StateMachines/types";
import { Header, EventButtons } from "../statelessComponents";
import { Jumbotron, Container } from "react-bootstrap";

export const LoginPage: React.FunctionComponent<IPageProps> = (props) => {
  return (
    <div>
      <Header {...props} />
      <Container>
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
      </Container>
    </div>
  );
};
