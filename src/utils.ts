/* eslint-disable no-cond-assign */

import type { SwaggerParameter, WordPressArgument } from './types'

/**
 * Converts WordPress-style endpoints to Swagger style
 * Example: /wp/v2/posts/(?P<id>[\d]+) -> /wp/v2/posts/{id}
 * @param endpoint WordPress endpoint path
 * @returns Swagger-compatible path
 */
export function convertEndpoint(endpoint: string): string {
  if (endpoint.includes('(?P<'))
    return endpoint.replace(/\(\?P<([^>]+)>[^)]+\)/g, '{$1}')

  return endpoint
}

/**
 * Extracts path parameters from an endpoint
 * @param endpoint WordPress endpoint path
 * @returns Array of Swagger parameters
 */
export function getParametersFromEndpoint(endpoint: string): SwaggerParameter[] {
  const pathParams: SwaggerParameter[] = []
  const regex = /\(\?P<([^>]+)>([^)]+)\)/g
  let match

  while ((match = regex.exec(endpoint)) !== null) {
    const name = match[1]
    const pattern = match[2]
    const type = pattern.includes('\\d') ? 'integer' : 'string'

    const param: SwaggerParameter = {
      name,
      in: 'path',
      description: '',
      required: true,
      type,
    }

    if (type === 'integer')
      param.format = 'int64'

    pathParams.push(param)
  }

  return pathParams
}

/**
 * Builds a parameter object from parameter definition
 * @param name Parameter name
 * @param method HTTP method
 * @param endpoint Endpoint path
 * @param detail Parameter details
 * @returns Swagger parameter object
 */
export function buildParam(name: string, method: string, endpoint: string, detail: WordPressArgument): SwaggerParameter {
  // Determine parameter type
  const typeValue = detail.type || 'string'
  let type = 'string'

  if (Array.isArray(typeValue) && typeValue.length > 0)
    type = typeValue[0]
  else if (typeof typeValue === 'string')
    type = typeValue

  if (!type) {
    // Infer type from name if not specified
    if (name.includes('_id') || name.toLowerCase() === 'id')
      type = 'integer'
    else
      type = 'string'
  }

  // Determine parameter location
  let paramIn: 'path' | 'query' | 'formData' = 'query'
  if (endpoint.includes(`{${name}}`))
    paramIn = 'path'
  else if (method === 'post' || method === 'put')
    paramIn = 'formData'

  // Determine if parameter is required
  let required = !!detail.required
  if (paramIn === 'path')
    required = true // Path parameters are always required

  const param: SwaggerParameter = {
    name,
    in: paramIn,
    description: detail.description || '',
    required,
    type,
  }

  // Handle enumerations
  if (detail.enum) {
    param.type = 'array'
    param.items = {
      type: typeof typeValue === 'string' ? typeValue : 'string',
      enum: detail.enum,
    }

    if (detail.default !== undefined && param.items)
      param.items.default = detail.default

    param.collectionFormat = 'multi'
  }
  // Handle arrays
  else if (detail.items) {
    param.items = {
      type: detail.items.type || 'string',
    }
  }

  // Handle numeric ranges
  if (detail.maximum !== undefined)
    param.maximum = detail.maximum

  if (detail.minimum !== undefined)
    param.minimum = detail.minimum

  // Handle format
  if (detail.format)
    param.format = detail.format
  else if (type === 'integer')
    param.format = 'int64'

  // Handle schema
  if (detail.schema)
    param.schema = detail.schema

  return param
}

/**
 * Extracts parameters from argument definitions
 * @param endpoint Endpoint path
 * @param args Argument definitions
 * @param method HTTP method
 * @returns Array of Swagger parameters
 */
export function getParametersFromArgs(endpoint: string, args: Record<string, WordPressArgument>, method: string): SwaggerParameter[] {
  const parameters: SwaggerParameter[] = []

  for (const [param, detail] of Object.entries(args))
    parameters.push(buildParam(param, method, endpoint, detail))

  return parameters
}
