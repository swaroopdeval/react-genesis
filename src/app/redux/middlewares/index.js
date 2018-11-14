import apiService from "./apiService"
import thunkMiddleware from "redux-thunk";

let middleware = [thunkMiddleware, apiService]

export default middleware