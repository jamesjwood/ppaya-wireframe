import "./styles.css";
import { interpret } from "xstate";
import { Component } from "react";
import { navigationStateMachine } from "./StateMachines";
import * as React from "react";
import { NavigationView } from "./statelessComponents";

/**
 * Manages the navigation state machine and renders when it changes state
 */
export default class App extends Component<{}, {}, {}> {
  constructor(props: any) {
    super(props);
    this.state = { path: "loading" };
  }

  private service = interpret(navigationStateMachine).onTransition((state) => {
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
