import * as reducers from "./ducks";
import middlewares from "./middlewares";
import { createStore, applyMiddleware, combineReducers } from "redux";
//import { apiService } from "./middlewares";

export default function configureStore( initialState ) {
    const rootReducer = combineReducers( reducers );
    return createStore(
        rootReducer,
        initialState,
        applyMiddleware(...middlewares),
    );
}
