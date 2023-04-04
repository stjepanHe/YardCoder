import { Dispatch } from 'redux';
import { Action } from '../actions';
import { ActionType } from '../action-types';

import { RootState } from '../reducers';
import { useActions } from '../../hooks/use-actions';
export const persistMiddleware = ({
  dispatch,
  getState,
}: {
  dispatch: Dispatch<Action>;
  getState: () => RootState;
}) => {
  let timer: any;
  return (next: (action: Action) => void) => {
    return (action: Action) => {
      next(action);
      const { saveCells } = useActions();
      if (
        [
          ActionType.MOVE_CELL,
          ActionType.UPDATE_CELL,
          ActionType.INSERT_CELL_AFTER,
          ActionType.DELETE_CELL,
        ].includes(action.type)
      ) {
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          saveCells()(dispatch, getState);
        }, 250);
        saveCells()(dispatch, getState);
      }
    };
  };
};
