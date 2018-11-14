import types from "./types"
import { combineReducers } from "redux"
import createReducer from "../../utils/createReducer"

const collections = createReducer( [ ] )( {
    [ types.FETCH_COLLECTIONS ]: ( state, action ) => action.payload,
    [ types.FLUSH_HOME ]: ( state, action ) => [],
} )

const demohome = createReducer( [ ] )( {
    [ types.FETCH_DEMOHOME ]: ( state, action ) => action.payload
} )


export default combineReducers( {
    collections: collections,
    demohome: demohome,
} );
