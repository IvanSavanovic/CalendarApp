import {Draft, Reducer, createSlice} from '@reduxjs/toolkit';
import {CalendarEvent} from '../../components/calendar/MyCalendar';
import {RootState} from '../store';

export interface Calendar {
  event: CalendarEvent[];
}

const initialState: Calendar = {
  event: [],
};

export const calendatSlice = createSlice({
  name: 'calendar',
  initialState: initialState,
  reducers: {
    setCalendar: (state: Draft<Calendar>, action: {payload: Calendar}) => {
      state.event = action.payload.event;
    },
  },
});

export const selectCalendar = (state: RootState) => {
  return state.calendra;
};

export const {setCalendar} = calendatSlice.actions;

export default calendatSlice.reducer as Reducer<Calendar>;
