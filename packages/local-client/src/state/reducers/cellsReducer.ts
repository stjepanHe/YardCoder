import { ActionType } from '../action-types';
import { Action } from '../actions';
import produce from 'immer';
import { Cell } from '../cell';

export interface CellsState {
  loading: boolean;
  error: string | null;
  order: string[];
  data: {
    [key: string]: Cell;
  };
}

const initialState: CellsState = {
  // refereneca temeljnog i jako bitnog initial state koji uvijek tu mora biti uz state ekvivalentatn podatcim iznad na interfaceu

  loading: false,
  error: null,
  order: [],
  data: {},
};

const reducer = produce((state: CellsState = initialState, action: Action) => {
  switch (action.type) {
    case ActionType.SAVE_CELLS_ERROR:
      state.error = action.payload;

      return state;

    case ActionType.FETCH_CELLS:
      state.loading = true;
      state.error = null;

      return state;

    case ActionType.FETCH_CELLS_COMPLETE:
      state.order = action.payload.map((cell) => cell.id);
      state.data = action.payload.reduce((acc, cell) => {
        acc[cell.id] = cell;
        return acc;
      }, {} as CellsState['data']);

      return state;

    case ActionType.FETCH_CELLS_ERROR:
      state.loading = false;
      state.error = action.payload;

      return state;

    case ActionType.UPDATE_CELL:
      const { id, content } = action.payload;
      state.data[id].content = content; // This is immer,  simple to reach state data  :)
      return state;

    case ActionType.DELETE_CELL:
      delete state.data[action.payload];
      state.order = state.order.filter((id) => id !== action.payload);
      return state;
    case ActionType.MOVE_CELL:
      const { direction } = action.payload;
      const index = state.order.findIndex((id) => id === action.payload.id);
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex > state.order.length - 1) {
        return state;
      }
      state.order[index] = state.order[targetIndex];
      state.order[targetIndex] = action.payload.id;
      return;
    case ActionType.INSERT_CELL_AFTER:
      const cell: Cell = {
        content: '',
        type: action.payload.type,
        id: randomId(),
      };
      state.data[cell.id] = cell;
      const foundIndex = state.order.findIndex(
        (id) => id === action.payload.id
      );
      if (foundIndex < 0) {
        state.order.unshift(cell.id);
      } else {
        state.order.splice(foundIndex + 1, 0, cell.id);
      }
      return state;
    default:
      return state;
  }
});

const randomId = () => {
  return Math.random().toString(36).substr(2, 5);
};

export default reducer;

/*
        
      return {
        ...state,
        data: {
          ...state.data,
          [id]: {
            ...state.data[id], //Ukratko, ovaj kod ažurira sadržaj određene ćelije u podatkovnom objektu objekta stanja kada se pošalje akcija UPDATE_CELL.
            //Stvara plitku kopiju objekta stanja, stvara novi podatkovni objekt s novom kopijom ažuriranog objekta ćelije i vraća ažurirani objekt stanja s ažuriranim podatkovnim objektom.
            content: content,
          },
        },
      }; // brand new object :))

      */
