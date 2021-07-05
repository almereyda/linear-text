import type {FileWithHandle} from 'browser-fs-access'
import type {RootState, AppThunk} from '../store'

import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {parseFile} from '../../parser/parser'

export type RecordsState = Readonly<{
  records: readonly string[]
  status: 'idle' | 'loading' | 'failed'
}>

const initialState: RecordsState = {records: [], status: 'idle'}

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const loadRecordsAsync = createAsyncThunk(
  'records/loadRecordsAsync',
  async (file: Readonly<FileWithHandle>) => {
    // The value we return becomes the `fulfilled` action payload
    return [await parseFile(file)]
  }
)

export const recordsSlice = createSlice({
  name: 'records',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    // Redux Toolkit allows us to write "mutating" logic in reducers. It
    // doesn't actually mutate the state because it uses the Immer library,
    // which detects changes to a "draft state" and produces a brand new
    // immutable state based off those changes
    // Use the PayloadAction type to declare the contents of `action.payload`
    addRecord: (state, action: PayloadAction<string>) => {
      state.records.push(action.payload)
    }
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: builder => {
    builder
      .addCase(loadRecordsAsync.pending, state => {
        state.status = 'loading'
      })
      .addCase(loadRecordsAsync.fulfilled, (state, action) => {
        state.status = 'idle'
        state.records = action.payload
      })
  }
})

export const {addRecord} = recordsSlice.actions

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.records.value)`
export const selectRecords = (state: RootState) => state.records

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
export const incrementIfOdd =
  (amount: string): AppThunk =>
  (dispatch, getState) => {
    const records = selectRecords(getState()).records
    const currentValue = records[records.length - 1]
    if (currentValue === '1') {
      dispatch(addRecord(amount))
    }
  }

export default recordsSlice.reducer
