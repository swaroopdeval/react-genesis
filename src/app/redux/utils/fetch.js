require('es6-promise').polyfill();
require('isomorphic-fetch');

/**
 * one place for API calls
 *
 * GIven url, method of request and body of the request send an API call using isomorphic fetch
 * @param  {String} url    full url of the API
 * @param  {String} method Method of the request (GET/POST/PUT/DELETE etc)
 * @param  {Object} body   Json body of the request
 * @return {promise}
 */
export default ( url, method, body ) => {
    let options = {method}

    if(method !== "GET"){
        options['body'] = JSON.stringify( body )
    }

    //return isomorphic fetch promise
    //if API connection fails, go to catch and return 500 response code
    //if API connection success, return Response with API response header code
    return fetch( url, options ).then( res => parseStatus( res.status, res) ).catch((err) => parseStatus( 500));
};

function parseStatus( status, res ) {
    if(status >= 200 && status < 300){
        return res.json();
    }
    return {success:0, error:status, response:[]}
}
