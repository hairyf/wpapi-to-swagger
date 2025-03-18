# wpapi-to-swagger

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]

Convert WordPress REST API schema to OpenAPI/Swagger v2 specification document

## Installation

```bash
# Using npm
npm install wpapi-to-swagger

# Using pnpm
pnpm add wpapi-to-swagger

# Using yarn
yarn add wpapi-to-swagger
```

## Usage

```ts
import { transform } from 'wpapi-to-swagger'

// Get WordPress REST API schema
const wpApiSchema = {
  routes: {
    '/wp/v2/posts': {
      namespace: 'wp/v2',
      endpoints: [
        {
          methods: ['get'],
          description: 'Get list of posts',
          args: {
            page: {
              type: 'integer',
              description: 'Page number',
              required: false
            },
            per_page: {
              type: 'integer',
              description: 'Number of items per page',
              required: false
            }
          }
        }
      ]
    },
    '/wp/v2/posts/(?P<id>[\\d]+)': {
      namespace: 'wp/v2',
      endpoints: [
        {
          methods: ['get'],
          description: 'Get a single post',
          args: {
            context: {
              type: 'string',
              description: 'Request context',
              required: false,
              enum: ['view', 'embed', 'edit']
            }
          }
        }
      ]
    }
  }
}

// Transform to Swagger specification
const swaggerSpec = transform(wpApiSchema)

// Output result
console.log(JSON.stringify(swaggerSpec, null, 2))
```

## Features

- Convert WordPress REST API schema to OpenAPI/Swagger v2 specification
- Automatically handle WordPress-style path parameters (e.g. `/wp/v2/posts/(?P<id>[\d]+)` → `/wp/v2/posts/{id}`)
- Automatically determine parameter locations based on HTTP methods (path, query, formData)
- Support parameter type conversion and validation rules
- Generate complete API documentation including paths, methods, parameters, and responses

## API

### transform(source)

Convert WordPress REST API schema to OpenAPI/Swagger v2 specification document.

**Parameters:**

- `source` (WordPressAPISchema): WordPress REST API schema object

**Returns:**

- (OpenAPISpecificationV2): Document object conforming to OpenAPI/Swagger v2 specification

## Type Definitions

```ts
// WordPress API schema
interface WordPressAPISchema {
  routes: Record<string, WordPressRoute>
}

// WordPress route
interface WordPressRoute {
  namespace: string
  endpoints: WordPressEndpoint[]
}

// WordPress endpoint
interface WordPressEndpoint {
  methods: ('get' | 'post' | 'put' | 'delete')[]
  description?: string
  args?: Record<string, WordPressArgument>
}

// WordPress argument
interface WordPressArgument {
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
```

## Utility Functions

The package also provides some useful utility functions:

- `convertEndpoint(endpoint)`: Convert WordPress-style endpoint paths to Swagger style
- `getParametersFromEndpoint(endpoint)`: Extract path parameters from endpoint paths
- `getParametersFromArgs(endpoint, args, method)`: Extract Swagger parameters from argument definitions

## Example Output

```json
{
  "swagger": "2.0",
  "basePath": "",
  "host": "",
  "info": {
    "title": "WordPress REST API",
    "version": "1.0",
    "description": "Using the WordPress REST API you can create a plugin to provide an entirely new admin experience for WordPress, build a brand new interactive front-end experience, or bring your WordPress content into completely separate applications."
  },
  "paths": {
    "/wp/v2/posts": {
      "get": {
        "tags": ["wp/v2"],
        "summary": "Get list of posts",
        "description": "Get list of posts",
        "operationId": "get_wp_v2_posts",
        "parameters": [
          {
            "name": "page",
            "in": "query",
            "description": "Page number",
            "required": false,
            "type": "integer",
            "format": "int64"
          },
          {
            "name": "per_page",
            "in": "query",
            "description": "Number of items per page",
            "required": false,
            "type": "integer",
            "format": "int64"
          }
        ],
        "responses": {
          "200": { "description": "OK" },
          "400": { "description": "Bad Request" },
          "404": { "description": "Not Found" }
        }
      }
    },
    "/wp/v2/posts/{id}": {
      "get": {
        "tags": ["wp/v2"],
        "summary": "Get a single post",
        "description": "Get a single post",
        "operationId": "get_wp_v2_posts_id",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "description": "",
            "required": true,
            "type": "integer",
            "format": "int64"
          },
          {
            "name": "context",
            "in": "query",
            "description": "Request context",
            "required": false,
            "type": "array",
            "items": {
              "type": "string",
              "enum": ["view", "embed", "edit"]
            },
            "collectionFormat": "multi"
          }
        ],
        "responses": {
          "200": { "description": "OK" },
          "400": { "description": "Bad Request" },
          "404": { "description": "Not Found" }
        }
      }
    }
  }
}
```

## Use Cases

- Generate API documentation for WordPress sites
- Create client applications based on WordPress API
- Provide interactive API documentation using Swagger UI
- Integrate with API development tools like Postman, Swagger Editor, etc.

## License

[MIT](./LICENSE) License © 2025 [Hairyf](https://github.com/hairyf)

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/wpapi-to-swagger?style=flat&colorA=080f12&colorB=1fa669
[npm-version-href]: https://npmjs.com/package/wpapi-to-swagger
[npm-downloads-src]: https://img.shields.io/npm/dm/wpapi-to-swagger?style=flat&colorA=080f12&colorB=1fa669
[npm-downloads-href]: https://npmjs.com/package/wpapi-to-swagger
[bundle-src]: https://img.shields.io/bundlephobia/minzip/wpapi-to-swagger?style=flat&colorA=080f12&colorB=1fa669&label=minzip
[bundle-href]: https://bundlephobia.com/result?p=wpapi-to-swagger
[license-src]: https://img.shields.io/github/license/antfu/wpapi-to-swagger.svg?style=flat&colorA=080f12&colorB=1fa669
[license-href]: https://github.com/antfu/wpapi-to-swagger/blob/main/LICENSE
[jsdocs-src]: https://img.shields.io/badge/jsdocs-reference-080f12?style=flat&colorA=080f12&colorB=1fa669
[jsdocs-href]: https://www.jsdocs.io/package/wpapi-to-swagger
