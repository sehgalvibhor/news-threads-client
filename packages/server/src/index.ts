/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable graphql/template-strings */
import { ApolloServer, gql } from 'apollo-server-azure-functions'
import config from 'config'
import { createDataSources } from './dataSources'
import { decodeToken } from './decodeToken'
import { resolvers } from './resolvers'
import { schemaText } from './schema'

const debug = config.get<boolean>('apollo.debug')
const playground = config.get<boolean>('apollo.playground')
const muteErrors = config.get('apollo.muteErrors')
const tracing = config.get<boolean>('apollo.perfTracing')
const authDisabled = config.get('auth.disabled')

// Set up Apollo Server
export const server = new ApolloServer({
	typeDefs: gql`
		${schemaText}
	`,
	resolvers: resolvers as any,
	context: async ({ context, request }) => {
		if (authDisabled) {
			return { user: null }
		} else {
			const token = request.headers.authorization
			const user = await decodeToken(token)
			if (!user) {
				throw new Error('could not authenticate user with token ' + token)
			}
			return { user }
		}
	},
	dataSources: createDataSources as any,
	debug,
	playground,
	tracing,
	formatError: err => (muteErrors ? new Error('Internal Server Error') : err),
	engine: {
		// apiKey: process.env.ENGINE_API_KEY,
	},
})

const handler = server.createHandler({
	cors: {
		origin: '*',
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		credentials: true,
	},
})

module.exports = handler
