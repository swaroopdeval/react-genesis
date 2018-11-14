import path from "path";
import React from "react"
import express from "express"
import { readFile } from 'fs'
//import Helmet from 'react-helmet'
import { Provider } from "react-redux"
import App from '../app/react/layouts/app'
import { StaticRouter } from "react-router"
import serialize from 'serialize-javascript'
import ReactDOMServer from 'react-dom/server'
import configureStore from '../app/redux/store'
import cookiesMiddleware from "universal-cookie-express"
import { CookiesProvider } from 'react-cookie'
import asyncBootstrapper from 'react-async-bootstrapper'
import { AsyncComponentProvider, createAsyncContext } from 'react-async-component'

const app = express( )
app.use(cookiesMiddleware( ));

//Handle static resources
const PUBLIC_DIR = path.resolve( __dirname, "../../public" )
app.use( express.static( PUBLIC_DIR ) )


/*
	Uses EJS file instead of react element
 */
app.use((req, res) => {
	if(req.url === '/favicon.ico') return res.status(404)
	
	//Create initial states for various APIs and providers
	const routeContext = {}									//React Router
	/**
	 * @todo put node variables in store
	 */
	const reduxStore = configureStore()						//Redux
	const asyncContext = createAsyncContext()				//React Async Component

	//Create React App
	console.log('jaha ' + new Date())
	const reactAppJSX = (
			<Provider store={ reduxStore }>
				<AsyncComponentProvider asyncContext={asyncContext}>
					<CookiesProvider cookies={req.universalCookies}>
						<StaticRouter location={ req.url } context={ routeContext }>
							<App ssr={true} dispatch={reduxStore.dispatch}/>
						</StaticRouter>
					</CookiesProvider>
				</AsyncComponentProvider>
			</Provider>
		)
		console.log('after react ' + new Date())
	// 
	/**
	 * This makes sure we "bootstrap" resolve any async components prior to rendering
	 *
	 * asyncBootstrapper walks given React element tree using react-tree-walker library and check if any component has a function/method named "bootstrap".
	 * It halts the tree walk until given "bootstrap" returns true. Once it get true from current paused function, it will continue tree walk.
	 * It is used by react-async-component library.
	 * Also we are using it to frefetch data for Serverside rendring.
	 * 
	 * @param  {React Object} reactAppJSX
	 */
	//asyncBootstrapper(reactAppJSX).then(() => {
		// We can now render our app
		const reactApp = ReactDOMServer.renderToString(reactAppJSX);
		console.log('yaha ' + new Date())
		//Get asunc components' context and put it in DOM so that client side stay sync with server
		const asyncState = asyncContext.getState();
		const reduxState = JSON.stringify(reduxStore.getState());	//Get redux state

		const footerScript = `<script type="text/javascript">
			window.ASYNC_COMPONENTS_STATE	= ${serialize(asyncState)};
			window.REDUX_INITIAL_DATA		= ${reduxState};
		</script>`

		readFile(path.resolve(__dirname, '../../public/dist/', 'mobile.html'), 'utf8', function (err, file) {
	        if (err) return console.log(err)
	        const document = file.replace('<div id="root"></div>', `<div id="root">${reactApp}</div>${footerScript}`);
	        res.status(200).send(document)
	    })
	//})
})

/*
	Uses react element instead of EJS file
 */
// app.get('/', (req, res) => {
// 	console.log('here v r');
//     const reactApp = ReactDOMServer.renderToString(
//         <Html initialData={JSON.stringify(initialData)}>
//             <App {...initialData} />
//         </Html>
//     );
//     const helmet = Helmet.renderStatic()
//     const head = '<head>'
//     			+ helmet.title.toString()
//     			+ '<meta http-equiv="X-UA-Compatible" content="IE=edge">' //this is not supported in helmet
//     			+ helmet.meta.toString()
//     			+ helmet.link.toString()
//     			+ '</head>';
//     console.log(helmet.link.toString());
//     const document = '<!doctype html>' + reactApp.replace('<head></head>', head)
//     res.send(document);
// });

const PORT = process.env.NODE_PORT || 4001;
app.listen(PORT, ()=>{
	console.log(`Server is listening on port ${PORT}!`)
});
