/**
 * Interface for WordPress REST API route
 */
export interface WordPressRoute {
  namespace: string
  endpoints: WordPressEndpoint[]
}
export interface WordPressAPISchema {
  routes: Record<string, WordPressRoute>
}
/**
 * Interface for WordPress REST API endpoint
 */
export interface WordPressEndpoint {
  methods: ('get' | 'post' | 'put' | 'delete')[]
  description?: string
  args?: Record<string, WordPressArgument>
}

/**
 * Interface for WordPress REST API argument
 */
export interface WordPressArgument {
  type?: string | string[]
  description?: string
  required?: boolean
  enum?: string[]
  default?: any
  items?: {
    type?: string
  }
  maximum?: number
  minimum?: number
  format?: string
  schema?: any
}

/**
 * Interface for Swagger parameter
 */
export interface SwaggerParameter {
  name: string
  in: 'path' | 'query' | 'formData' | 'body' | 'header'
  description: string
  required: boolean
  type: string
  format?: string
  items?: {
    type: string
    enum?: string[]
    default?: any
  }
  collectionFormat?: string
  maximum?: number
  minimum?: number
  schema?: any
}

/**
 * Interface for Swagger document
 */
export interface OpenAPISpecificationV2 {
  swagger: string
  basePath: string
  host: string
  info: {
    title: string
    version: string
    description: string
  }
  definitions: Record<string, any>
  consumes: string[]
  externalDocs: Record<string, any>
  paths: Record<string, Record<string, SwaggerPath>>
  schemes: string[]
  securityDefinitions: Record<string, any>
  tags: any[]
}

/**
 * Interface for Swagger path
 */
export interface SwaggerPath {
  tags: string[]
  summary: string
  description: string
  operationId: string
  consumes: string[]
  produces: string[]
  parameters: SwaggerParameter[]
  responses: Record<string, any>
  security: any[]
}
