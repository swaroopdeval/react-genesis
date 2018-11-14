import React from 'react'
import { asyncComponent } from 'react-async-component'

let chunkLoading = <p>chunk Loading</p>

let splitComponent = (name) => 
	asyncComponent({
    	resolve: () => import( /* webpackChunkName: "[request]" */ `./../react/views/container/${name}`),
    	LoadingComponent: ({ }) => chunkLoading,
    	ErrorComponent: ({ error }) => <div>{error.message}</div>
	})

export default splitComponent