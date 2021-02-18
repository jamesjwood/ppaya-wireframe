import * as React from "react";
import { IPageProps } from "../StateMachines/types";
import { LoginStatus } from "./LoginStatus";
import { OrganizationStatus } from "./OrganizationStatus";
import { Image } from "react-bootstrap";
import { Navbar, Nav } from "react-bootstrap";
import { Events } from "../StateMachines";

export const Header: React.FunctionComponent<IPageProps> = (props) => {
  if (!props.context) throw new Error("context required");
  return (
    <div>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#home">PPAYA</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            {/* {() => {
              if (props.events.includes(Events.HOME)) {
                return (
                  <Nav.Link
                    onClick={() => {
                      props.send({ type: Events.HOME });
                    }}
                  >
                    Home
                  </Nav.Link>
                );
              }
            }} */}

            <Nav.Link
              onClick={() => {
                props.send({ type: Events.PROFILE });
              }}
            >
              Profile
            </Nav.Link>
            <Nav.Link
              onClick={() => {
                props.send({ type: Events.SETTINGS });
              }}
            >
              Settings
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Image src="./images/icon.svg" width="70pt" className="mb-4" />
      <h1>This is the {props.pageName} page</h1>
      <br />
      <LoginStatus {...props} />
      <OrganizationStatus {...props} />
    </div>
  );
};
