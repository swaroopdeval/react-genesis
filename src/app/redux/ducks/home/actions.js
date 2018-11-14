import types from "./types"

export function ssr() {
    return {
    	bulk: [
    		// fetchCollections(),
            //flushHome()
            fetchDemoHome()
    	]
    }
}
export function fetchDemoHome()
{
    return {
        type: types.FETCH_DEMOHOME,
        isApi: true,
        meta: {
            path: "/todos/1", //collection api url
            method: "GET",
        }
    }
}

export function fetchCollections() {
    return {
        type: types.FETCH_COLLECTIONS,
        isApi: true,
        meta: {
            path: "/", //collection api url
            method: "GET",
        }
    }
}

export function flushHome() {
    return {
        type: types.FLUSH_HOME
    }
}