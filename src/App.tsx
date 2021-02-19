import "./styles.css";
import { interpret } from "xstate";
import { Component } from "react";
import { makeAppStateMachine } from "./StateMachines";
import * as React from "react";
import { AppView } from "./statelessComponents";

import { inspect } from "@xstate/inspect";
import { IOrganization, IUser } from "./StateMachines/types";

inspect({
  url: "https://statecharts.io/inspect",
  iframe: false
});

const organizations: IOrganization[] = [
  {
    id: "1",
    name: "EDF",
    type: "supplier"
  },
  {
    id: "2",
    name: "Windy",
    type: "generator"
  }
];
const users: IUser[] = [
  {
    username: "james@ppaya.co.uk",
    credentialId: "james@ppaya.co.uk",
    emailValidated: false,
    organizations: ["1"]
  }
];

const checkForCredentials = async () => {
  throw new Error("No credentials");
};

/**
 * Manages the navigation state machine and renders when it changes state
 */
export default class App extends Component<{}, {}, {}> {
  constructor(props: any) {
    super(props);
    this.state = { path: "loading" };
  }

  private appStateMachine = makeAppStateMachine(checkForCredentials);
  private service = interpret(this.appStateMachine, {
    devTools: true
  }).onTransition((state) => {
    this.setState(state);
  });

  componentDidMount() {
    this.service.start();
  }

  componentWillUnmount() {
    this.service.stop();
  }

  public render() {
    return <AppView service={this.service} />;
  }
}
