import produce from 'immer';
import { ActionType } from '../action-types';
import { Action } from '../actions';

export interface BundlesState {
  [key: string]:
    | {
        loading: boolean;
        code: string;
        err: string;
      }
    | undefined;
}

const initialeState: BundlesState = {};

const reducer = produce((state: BundlesState, action: Action) => {
  switch (action.type) {
    case ActionType.BUNDLE_START:
      state[action.payload.cellId] = {
        loading: true,
        code: '',
        err: '',
      };
      return state;
    case ActionType.BUNDLE_COMPLETE:
      state[action.payload.cellId] = {
        loading: false,
        code: action.payload.bundle.code,
        err: action.payload.bundle.err,
      };
      return;
    default:
      return;
  }
}, initialeState);

export default reducer;
