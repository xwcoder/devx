import { createContext, useContext, useReducer } from 'react';
import type { Dispatch, PropsWithChildren } from 'react';
import { apps } from './apps';
import type { AppType } from './apps';

type State = {
  app: AppType
}

type Action = {
  type: "set-app"
  payload: AppType
}

const StateContext = createContext<State | null>(null);
const DispatchContext = createContext<Dispatch<Action> | null>(null);

export const AppContext = ({ children }: PropsWithChildren<{}>) => {
  const [state, dispatch] = useReducer((state: State, action: Action) => {
    switch (action.type) {
      case 'set-app':
        return {
          ...state,
          app: action.payload,
        };
    }
  }, {
    app: apps[0],
  });

  return (
    <StateContext value={state}>
      <DispatchContext value={dispatch}>
        {children}
      </DispatchContext>
    </StateContext>
  );
};

export const useAppState = () => {
  return useContext(StateContext)!;
};

export const useAppDispatch = () => {
  return useContext(DispatchContext)!;
};