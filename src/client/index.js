import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import App from '../app/react/layouts/app'
import configureStore from '../app/redux/store'
import { BrowserRouter } from 'react-router-dom'
import asyncBootstrapper from 'react-async-bootstrapper'
import { AsyncComponentProvider, createAsyncContext } from 'react-async-component'
import { CookiesProvider } from 'react-cookie';

//Match initial states for various APIs and providers with server side
const rehydrateState = window.ASYNC_COMPONENTS_STATE			//React Async Component
const reduxStore = configureStore( window.REDUX_INITIAL_DATA )	//Redux

const app = (
	<Provider store={ reduxStore }>
		<AsyncComponentProvider rehydrateState={rehydrateState}>
			<CookiesProvider>
				<BrowserRouter>
					<App ssr={false}/>
				</BrowserRouter>
			</CookiesProvider>
		</AsyncComponentProvider>
	</Provider>
)


asyncBootstrapper(app).then(() => ReactDOM.hydrate(app, document.getElementById('root')))
