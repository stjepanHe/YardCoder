import { combineReducers } from 'redux';
import cellsReducer, { CellsState } from './cellsReducer';
import bundlesReducer, { BundlesState } from './bundlesReducer';
const reducers = combineReducers({
  cells: cellsReducer,
  bundles: bundlesReducer,
});

export default reducers;

export interface RootState {
  cells: CellsState;
  bundles: BundlesState;
}
