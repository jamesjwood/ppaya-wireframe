import { Machine, assign } from "xstate";
import { interval } from "rxjs";
import { map, take } from "rxjs/operators";
import {
  INavigationContext,
  INavigationEvent,
  IOrganizationSelectedEvent,
  ILoggedInEvent,
  ITenderViewEvent
} from "./types";

import visualize from "xstate-plantuml";

const getUserCookie = async () => {
  throw new Error("No user cookie");
};

export enum Events {
  HOME = "HOME",
  LOGGED_IN = "LOGGED_IN",
  REGISTER = "REGISTER",
  ADD_TENDER = "ADD_TENDER",
  VIEW_TENDER = "VIEW_TENDER",
  USER_UPDATED = "USER_UPDATED",
  ORGANIZATION_SELECTED = "ORGANIZATION_SELECTED",
  CANCEL = "CANCEL",
  REGISTERED = "REGISTERED",
  SETTINGS = "SETTINGS",
  PROFILE = "PROFILE",
  CHANGE_ORGANIZATION = "CHANGE_ORGANIZATION"
}

export enum States {
  home = "homePage",
  profile = "profilePage",
  settings = "settingsPage",
  login = "loginPage",
  register = "registerPage",
  init = "init",
  loggedIn = "loggedIn",
  loggedOut = "loggedOut",
  checkEmailValidation = "checkEmailValidation",
  emailValidated = "emailValidated",
  emailNotValidated = "emailNotValidated",
  selectAnOrganization = "selectAnOrganizationPage",
  organizationSelected = "organizationSelected",
  tender = "tender",
  readTender = "readTenderPage",
  updateTender = "updateTenderPage",
  createTender = "createTenderPage"
}

export enum Guards {
  emailValidated = "emailValidated"
}

export enum Actions {
  assignExistingUser = "assignExistingUser",
  clearOrganization = "clearOrganization",
  assignExistingTender = "assignExistingTender",
  clearTender = "clearTender",
  assignNewTender = "assignNewTender",
  assignOrganization = "assignOrganization",
  clearUser = "clearUser"
}

export const navigationStateMachine = Machine<
  INavigationContext,
  INavigationEvent
>(
  {
    id: "navigation",
    initial: States.init,
    context: {} as INavigationContext,
    states: {
      [States.init]: {
        id: States.init,
        invoke: {
          id: "getUserCookie",
          src: () => getUserCookie(),
          onDone: {
            target: States.loggedIn,
            actions: ["assignExistingUser"]
          },
          onError: {
            target: States.loggedOut
          }
        }
      },
      [States.loggedOut]: {
        initial: States.login,
        states: {
          [States.login]: {
            id: States.login,
            on: {
              [Events.LOGGED_IN]: {
                target: "#" + States.loggedIn,
                actions: ["assignExistingUser"]
              },
              [Events.REGISTER]: States.register
            }
          },
          [States.register]: {
            on: {
              [Events.CANCEL]: States.login,
              [Events.REGISTERED]: {
                target: "#" + States.loggedIn,
                actions: ["assignNewUser"]
              }
            }
          }
        }
      },
      [States.loggedIn]: {
        id: States.loggedIn,
        initial: States.checkEmailValidation,
        invoke: {
          src: (context: INavigationContext, event: INavigationEvent) =>
            interval(10000).pipe(
              map((value) => ({
                type: Events.USER_UPDATED,
                username: "updated@ppaya.co.uk"
              })),
              take(1)
            )
        },
        states: {
          [States.checkEmailValidation]: {
            always: [
              { target: States.emailValidated, cond: Guards.emailValidated },
              { target: States.emailNotValidated }
            ]
          },
          [States.emailNotValidated]: {
            on: {
              EMAIL_VALIDATED: {
                target: States.emailValidated
              }
            }
          },
          [States.emailValidated]: {
            initial: States.selectAnOrganization,
            states: {
              [States.selectAnOrganization]: {
                id: States.selectAnOrganization,
                on: {
                  ORGANIZATION_SELECTED: {
                    target: States.organizationSelected,
                    actions: ["assignOrganization"]
                  }
                }
              },
              [States.organizationSelected]: {
                initial: States.home,
                states: {
                  [States.home]: {
                    id: States.home,
                    on: {
                      ADD_TENDER: {
                        target: "#" + States.createTender,
                        actions: ["assignNewTender"]
                      },
                      [Events.VIEW_TENDER]: {
                        target: "#" + States.readTender,
                        actions: ["assignExistingTender"]
                      }
                    }
                  },
                  [States.profile]: {
                    id: States.profile
                  },
                  [States.settings]: {
                    id: States.settings
                  },
                  [States.tender]: {
                    initial: States.readTender,
                    states: {
                      [States.readTender]: {
                        id: States.readTender,
                        on: {
                          EDIT: States.updateTender,
                          CLOSE: "#" + States.home
                        }
                      },
                      [States.createTender]: {
                        id: States.createTender,
                        on: {
                          CANCEL: "#" + States.home,
                          SAVED: States.readTender
                        }
                      },
                      [States.updateTender]: {
                        id: States.updateTender,
                        on: {
                          SAVED: States.readTender,
                          CANCEL: States.readTender
                        }
                      }
                    },
                    exit: ["clearTender"]
                  }
                },
                on: {
                  [Events.HOME]: "#" + States.home,
                  [Events.PROFILE]: "#" + States.profile,
                  [Events.SETTINGS]: "#" + States.settings,
                  [Events.CHANGE_ORGANIZATION]:
                    "#" + States.selectAnOrganization
                },
                exit: ["clearOrganization"]
              }
            }
          }
        },
        on: {
          USER_UPDATED: {
            actions: ["assignExistingUser"]
          },
          LOGGED_OUT: {
            target: "loggedOut"
          }
        },
        exit: ["clearUser"]
      }
    }
  },
  {
    guards: {
      [Guards.emailValidated]: (context) => context.emailValidated || false
    },
    actions: {
      [Actions.assignExistingUser]: assign({
        username: (context, event: ILoggedInEvent) => {
          return event.username ? event.username : "default user";
        },
        emailValidated: true,
        organizations: ["EDF", "Limejump"]
      }),
      [Actions.assignNewUser]: assign({
        username: "new user",
        emailValidated: false,
        organizations: ["Octopus", "Bulb"]
      }),
      [Actions.clearUser]: assign({
        username: undefined,
        emailValidated: undefined,
        organizations: []
      }),
      [Actions.assignOrganization]: assign({
        selectedOrganization: (context, event: IOrganizationSelectedEvent) =>
          event.organizationName
      }),
      [Actions.clearOrganization]: assign({
        selectedOrganization: undefined
      }),
      [Actions.assignExistingTender]: assign({
        tenderId: (context, event: ITenderViewEvent) => event.id
      }),
      [Actions.assignNewTender]: assign({
        tenderId: "2323123"
      }),
      [Actions.clearTender]: assign({
        tenderId: undefined
      })
    }
  }
);
