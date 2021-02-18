import "./styles.css";
import { interpret } from "xstate";
import { Component } from "react";
import { navigationStateMachine } from "./StateMachines";
import * as React from "react";
import { NavigationView } from "./statelessComponents";

import { inspect } from "@xstate/inspect";

inspect({
  url: "https://statecharts.io/inspect",
  iframe: false
});

/**
 * Manages the navigation state machine and renders when it changes state
 */
export default class App extends Component<{}, {}, {}> {
  constructor(props: any) {
    super(props);
    this.state = { path: "loading" };
  }

  private service = interpret(navigationStateMachine, {
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
    return <NavigationView service={this.service} />;
  }
}
