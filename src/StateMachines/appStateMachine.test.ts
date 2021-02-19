import { interpret } from "xstate";
import { makeAppStateMachine } from "./appStateMachine";
import { IUser } from "./types";

const failGeUserLoggedIn = async () => {
  throw new Error("No user Logged in");
};

it("Initial state should be init", () => {
  const machine = makeAppStateMachine(failGeUserLoggedIn);
  expect(machine.initialState.value).toBe("init");
});

it("Should transition to loginPage if checkForUserLoggedIn throws", (done) => {
  const machine = makeAppStateMachine(failGeUserLoggedIn);
  const service = interpret(machine).onTransition((state) => {
    if (state.matches("loggedOut.loginPage")) {
      done();
    }
  });
  service.start();
});

it("Should transition to emailNotValidated if checkForUserLoggedIn does not throw", (done) => {
  const fakeUser: IUser = {
    username: "test",
    organizations: ["EDF"],
    emailValidated: false
  };
  const succedeGetUserLoggedIn = async () => {
    return {
      user: fakeUser
    };
  };
  const machine = makeAppStateMachine(succedeGetUserLoggedIn);
  const service = interpret(machine).onTransition((state) => {
    if (state.matches("loggedIn.emailNotValidated")) {
      done();
    }
  });
  service.start();
});

it("Should transition to selectAnOrganization if checkForUserLoggedIn does not throw", (done) => {
  const fakeUser: IUser = {
    username: "test",
    organizations: ["EDF"],
    emailValidated: true
  };
  const succedeGetUserLoggedIn = async () => {
    return { user: fakeUser };
  };
  const machine = makeAppStateMachine(succedeGetUserLoggedIn);
  const service = interpret(machine).onTransition((state) => {
    if (state.matches("loggedIn.emailValidated.selectAnOrganizationPage")) {
      done();
    }
  });
  service.start();
});
