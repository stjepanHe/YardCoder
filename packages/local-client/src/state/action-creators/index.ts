import { Dispatch } from 'redux';
import { ActionType } from '../action-types';
import {
  Action,
  UpdateCellAction,
  DeleteCellAction,
  MoveCellAction,
  InsertCellAfterAction,
  Direction,
} from '../actions';

import { Cell, CellTypes } from '../cell';

import bundle from '../../bundler';
import axios from 'axios';
import { RootState } from '../reducers';

const updateCell = (id: string, content: string): UpdateCellAction => {
  //anotate return type,  our guid we must return object that satisfied interface in action. WE cannot use Action because its union of all actions, dont forget that, conotation
  return {
    type: ActionType.UPDATE_CELL,
    payload: {
      id,
      content,
    }, // return me a object to merge with my Action and her typo
  };
};
const deleteCell = (id: string): DeleteCellAction => {
  return {
    type: ActionType.DELETE_CELL,
    payload: id,
  };
};
const moveCell = (id: string, direction: Direction): MoveCellAction => {
  return {
    type: ActionType.MOVE_CELL,
    payload: {
      id,
      direction,
    },
  };
};
const insertCellAfter = (
  id: string | null,
  type: CellTypes
): InsertCellAfterAction => {
  return {
    type: ActionType.INSERT_CELL_AFTER,
    payload: {
      id,
      type,
    },
  };
};

const createBundle = (cellId: string, input: string) => {
  return async (dispatch: Dispatch<Action>) => {
    // ovako se u typescriptu zove dispatch

    dispatch({
      type: ActionType.BUNDLE_START,
      payload: {
        cellId: cellId,
      },
    });

    const result = await bundle(input);
    dispatch({
      type: ActionType.BUNDLE_COMPLETE,
      payload: {
        cellId,
        bundle: {
          code: result.code,
          err: result.err,
        },
      },
    });
  };
};

const fetchCells = () => {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({ type: ActionType.FETCH_CELLS });

    try {
      const { data }: { data: Cell[] } = await axios.get('/cells');

      dispatch({
        type: ActionType.FETCH_CELLS_COMPLETE,
        payload: data,
      });
    } catch (err) {
      dispatch({
        type: ActionType.FETCH_CELLS_ERROR,
        payload: err.message,
      });
    }
  };
};

const saveCells = () => {
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    const {
      cells: { data, order },
    } = getState(); // pogledaj mi u cells isključivo u data i order

    const cells = order.map((id) => data[id]);

    try {
      await axios.post('/cells', { cells });
    } catch (err) {
      dispatch({
        type: ActionType.SAVE_CELLS_ERROR,
        payload: err.message,
      });
    }
  };
};

export const actionCreators = {
  updateCell,
  deleteCell,
  insertCellAfter,
  moveCell,
  createBundle,
  fetchCells,
  saveCells,
};
