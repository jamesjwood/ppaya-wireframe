import { Machine, assign } from "xstate";
import { interval, IObservable } from "rxjs";
import { map, take } from "rxjs/operators";
import {
  IAppContext,
  IAppEvent,
  IOrganizationSelectedEvent,
  ILoggedInEvent,
  ITenderViewEvent,
  IUser,
  IOrganization,
  ICredentials
} from "./types";

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
  CHANGE_ORGANIZATION = "CHANGE_ORGANIZATION",
  CREDENTIALS_FOUND = "CREDENTIALS_FOUND",
  CREDENTIALS_NOT_FOUND = "CREDENTIALS_NOT_FOUND",
  CREDENTIALS_UPDATED = "CREDENTIALS_UPDATED",
  CREDENTIALS_CLEARED = "CREDENTIALS_CLEARED",
  USER_FOUND = "USER_FOUND",
  USER_NOT_FOUND = "USER_NOT_FOUND",
  USER_CREATED = "USER_CREATED"
}

export enum States {
  home = "homePage",
  profile = "profilePage",
  settings = "settingsPage",
  credentialsFinding = "credentialsFinding",
  checkEmailValidation = "checkEmailValidation",
  emailValidated = "emailValidated",
  emailNotValidated = "emailNotValidated",
  selectAnOrganization = "selectAnOrganizationPage",
  organizationSelected = "organizationSelected",
  tender = "tender",
  readTender = "readTenderPage",
  updateTender = "updateTenderPage",
  createTender = "createTenderPage",
  userFinding = "userFinding",
  userHasAccount = "userHasAccount",
  userDoesNotHaveAccount = "userDoesNotHaveAccount",
  credentialsFound = "credentialsFound",
  credentialsNotFound = "credentialsNotFound"
}

export enum Guards {
  emailValidated = "emailValidated",
  isGenerator = "isGenerator",
  isSupplier = "isSupplier",
  differentUserInCredentials = "differentUserInCredentials"
}

export enum Actions {
  assignUser = "assignUser",
  clearOrganization = "clearOrganization",
  assignExistingTender = "assignExistingTender",
  clearTender = "clearTender",
  assignNewTender = "assignNewTender",
  assignOrganization = "assignOrganization",
  clearUser = "clearUser",
  checkedForUser = "checkedForUser",
  assignCredentials = "assignCredentials",
  clearCredentials = "clearCredentials"
}

interface IUserService {
  getUser: (credentialId: string) => Promise<IUser>;
}
interface ICredentialService {
  subscribe: IObservable<ICredentials>;
}

type TcheckForCredentials = () => Promise<{ user: IUser }>;

export const makeAppStateMachine = (
  checkForCredentials: TcheckForCredentials,
  credentialsService: IUserService,
  userService: IUserService
) => {
  const appStateMachine = Machine<IAppContext, IAppEvent>(
    {
      id: "App",
      initial: States.credentialsFinding,
      context: {} as IAppContext,
      states: {
        [States.credentialsFinding]: {
          id: States.credentialsFinding,
          on: {
            [Events.CREDENTIALS_FOUND]: {
              target: States.credentialsFound,
              actions: [Actions.assignCredentials]
            },
            [Events.CREDENTIALS_NOT_FOUND]: {
              target: States.credentialsNotFound,
              actions: [Actions.assignCredentials]
            }
          }
        },
        [States.credentialsNotFound]: {
          id: States.credentialsNotFound,
          on: {
            [Events.CREDENTIALS_FOUND]: {
              target: States.credentialsFound,
              actions: [Actions.assignCredentials]
            }
          }
        },
        [States.credentialsFound]: {
          id: States.credentialsFound,
          initial: States.userFinding,
          states: {
            [States.userFinding]: {
              on: {
                [Events.USER_FOUND]: {
                  target: States.userHasAccount,
                  actions: [Actions.assignUser]
                },
                [Events.USER_NOT_FOUND]: {
                  target: States.userDoesNotHaveAccount
                }
              }
            },
            [States.userDoesNotHaveAccount]: {
              on: {
                [Events.USER_CREATED]: {
                  target: States.userHasAccount,
                  actions: [Actions.assignUser]
                }
              }
            },
            [States.userHasAccount]: {
              initial: States.checkEmailValidation,
              states: {
                [States.checkEmailValidation]: {
                  always: [
                    {
                      target: States.emailValidated,
                      cond: Guards.emailValidated
                    },
                    { target: States.emailNotValidated }
                  ]
                },
                [States.emailNotValidated]: {
                  on: {
                    [Events.USER_UPDATED]: {
                      target: States.checkEmailValidation,
                      actions: [Actions.assignUser]
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
                              actions: ["assignNewTender"],
                              cond: Guards.isGenerator
                            },
                            [Events.VIEW_TENDER]: {
                              target: "#" + States.readTender,
                              actions: ["assignExistingTender"],
                              cond: Guards.isGenerator
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
                [Events.USER_UPDATED]: {
                  actions: [Actions.assignUser]
                }
              }
            }
          },
          on: {
            [Events.CREDENTIALS_UPDATED]: [
              {
                target: States.credentialsFound,
                cond: Guards.differentUserInCredentials,
                actions: [Actions.clearUser, Actions.assignCredentials]
              },
              {
                actions: [Actions.assignCredentials]
              }
            ],
            [Events.CREDENTIALS_CLEARED]: {
              target: States.credentialsNotFound,
              actions: [Actions.clearUser, Actions.clearCredentials]
            }
          }
        }
      }
    },
    {
      guards: {
        [Guards.differentUserInCredentials]: (context: IAppContext, event) => {
          console.log(context.credentials);
          console.log(event.credentials);
          return context.credentials.id !== event.credentials.id;
        },
        [Guards.emailValidated]: (context) =>
          context.user!.emailValidated || false,
        [Guards.isSupplier]: (context: IAppContext) =>
          context.selectedOrganization?.type === "supplier",
        [Guards.isGenerator]: (context) =>
          context.selectedOrganization?.type === "generator"
      },
      actions: {
        [Actions.checkedForUser]: assign({
          user: (context, event) => {
            return event.data.user;
          }
        }),
        [Actions.assignCredentials]: assign({
          credentials: (context, event) => {
            return event.credentials;
          }
        }),
        [Actions.clearCredentials]: assign({
          credentials: undefined
        }),
        [Actions.assignUser]: assign({
          user: (context, event: ILoggedInEvent) => {
            return event.user;
          }
        }),
        [Actions.clearUser]: assign({
          user: undefined
        }),
        [Actions.assignOrganization]: assign({
          selectedOrganization: (context, event: IOrganizationSelectedEvent) =>
            event.organization
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
  return appStateMachine;
};

//   },
//   on: {
//     USER_UPDATED: {
//       actions: ["assignUser"]
//     },
//     LOGGED_OUT: {
//       target: "loggedOut"
//     }
//   },
//   exit: ["clearUser"]
// }
