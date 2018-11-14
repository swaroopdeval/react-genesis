import config from '../../config'
import fetch from '../utils/fetch'
require('es6-promise').polyfill()

const baseUrl = config.API_BASE_URL

const apiService = ( { } ) => ( next ) => ( action ) => {
	if(typeof action === 'undefined'){
		return next(action)
	}

	//Array of promises
	var allCalls = []

	/*
	 * handle single vs multiple actions
	 *
	 * Action creators can return one action or multiple actions.
	 * We support multiple actions from single action creator so user can trigger multiple actions from just one function call.
	 * Below is the both formats of action creator:
	 *
	 * 1. Single Action
	 * 			return {
	 * 				type: ActionName [required]
	 * 				meta: Object Comtaining API info [optional]
	 * 				isApi: Boolean [optional]
	 * 			}
	 * 2. Multiple Actions
	 * 			return {
	 * 				bulk: [
	 * 					{
	 * 						type: ActionName [required]
	 * 						meta: Object Comtaining API info [optional]
	 * 						isApi: Boolean [optional]
	 * 					},
	 * 					{
	 * 						type: ActionName [required]
	 * 						meta: Object Comtaining API info [optional]
	 * 						isApi: Boolean [optional]
	 * 					},
	 * 				]
	 * 			}
	 *
	 */
	var allActions = (typeof action.bulk === 'undefined') ? {bulk: [action]} : action;

	//Take eatch action and send API for the same, if applicable. Put returned action or Promise in array named 'allCalls'. 
	allActions.bulk.map((action) => {
		allCalls.push(fetchAPI(action))
	})

	return Promise.all(allCalls).then( (results) => {
		results.map((result) => {
			next(result)
		})
	})
}


/**
 * Given action, chck if it is requires API call.
 * If yes: Return a promise who sends an async API call and append API payload to action and return updated action.
 * Else return action
 * @param  {Object} action Redux Action object
 * @return {Promise/Object}
 */
const fetchAPI = (action) => {
	//Check if Action is API related
	if(typeof action.isApi === 'undefined' || action.isApi === false || typeof action.meta === 'undefined'){
		return action
	}

	const { path, method = "GET", body } = action.meta
	const url = baseUrl + path
	const options = { method }

	return fetch( url, method, body ).then( res => Object.assign({}, action, {'payload': res}))
}

export default apiService
