/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React from 'react'
import { memo } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { AuthProtect } from '../AuthProtect'
import { DataContext } from './DataContext'
import { Layout } from './Layout'
import { Routes } from './Routes'
import { StyleContext } from './StyleContext'

export const App: React.FC = memo(function App() {
	return (
		<DataContext>
			<AuthProtect>
				<Router>
					<StyleContext>
						<Layout>
							<Routes />
						</Layout>
					</StyleContext>
				</Router>
			</AuthProtect>
		</DataContext>
	)
})
