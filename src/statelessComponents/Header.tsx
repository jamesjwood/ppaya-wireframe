import * as React from "react";
import { IPageProps } from "../StateMachines/types";
import { LoginStatus } from "./LoginStatus";
import { OrganizationStatus } from "./OrganizationStatus";
import { Image } from "react-bootstrap";
import { Navbar, Nav } from "react-bootstrap";
import { Events } from "../StateMachines";

interface IConditonalNavLinkProperties {
  eventName: string;
  pageProps: IPageProps;
}
const ConditionalNavLink: React.FunctionComponent<IConditonalNavLinkProperties> = (
  props
) => {
  if (
    props.pageProps.events &&
    props.pageProps.events.includes(props.eventName)
  ) {
    return (
      <Nav.Link
        onClick={() => {
          props.pageProps.send({ type: props.eventName });
        }}
      >
        {props.eventName}
      </Nav.Link>
    );
  } else {
    return <div />;
  }
};
export const Header: React.FunctionComponent<IPageProps> = (props) => {
  if (!props.context) throw new Error("context required");
  return (
    <div>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand>
          <Image src="./images/icon.svg" width="30pt" />
        </Navbar.Brand>
        <Navbar.Text>{props.pageName}</Navbar.Text>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <ConditionalNavLink eventName={Events.HOME} pageProps={props} />
            <ConditionalNavLink eventName={Events.PROFILE} pageProps={props} />
            <ConditionalNavLink eventName={Events.SETTINGS} pageProps={props} />
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <LoginStatus {...props} />
      <OrganizationStatus {...props} />
    </div>
  );
};
