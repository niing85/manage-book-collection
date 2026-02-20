const openapiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Manage Book Collections API',
    version: '1.0.0',
    description: 'API documentation for Auth and Books endpoints.'
  },
  servers: [{ url: 'http://localhost:4000' }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      RegisterRequest: {
        type: 'object',
        required: ['username', 'password', 'firstname', 'lastname'],
        properties: {
          username: { type: 'string', example: 'alice' },
          password: { type: 'string', example: 'P@ssw0rd!' },
          firstname: { type: 'string', example: 'Alice' },
          lastname: { type: 'string', example: 'Wong' }
        }
      },
      LoginRequest: {
        type: 'object',
        required: ['username', 'password'],
        properties: {
          username: { type: 'string', example: 'alice' },
          password: { type: 'string', example: 'P@ssw0rd!' }
        }
      },
      LoginResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Login successful' },
          token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
        }
      },
      BookCreateUpdateRequest: {
        type: 'object',
        required: ['title', 'category'],
        properties: {
          title: { type: 'string', example: 'Clean Code' },
          category: { type: 'string', example: 'Software Engineering' }
        }
      },
      Book: {
        type: 'object',
        properties: {
          book_id: { type: 'integer', example: 1 },
          user_id: { type: 'integer', example: 1 },
          title: { type: 'string', example: 'Clean Code' },
          category: { type: 'string', example: 'Software Engineering' },
          created_at: { type: 'string', format: 'date-time', example: '2026-02-20T10:00:00.000Z' }
        }
      },
      ErrorResponse: {
        type: 'object',
        properties: { message: { type: 'string' } }
      }
    }
  },
  paths: {
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/RegisterRequest' } }
          }
        },
        responses: {
          '201': { description: 'Created' },
          '409': { description: 'Username already exists', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '500': { description: 'Internal server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } }
          }
        },
        responses: {
          '200': { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginResponse' } } } },
          '401': { description: 'Invalid username or password', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '500': { description: 'Internal server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },
    '/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Logout',
        responses: {
          '200': { description: 'OK' },
          '500': { description: 'Internal server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },
    '/books': {
      get: {
        tags: ['Books'],
        summary: 'List books',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'category', in: 'query', required: false, schema: { type: 'string' } },
          { name: 'title', in: 'query', required: false, schema: { type: 'string' } },
          { name: 'user_id', in: 'query', required: false, schema: { type: 'integer' } }
        ],
        responses: {
          '200': { description: 'OK', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Book' } } } } },
          '401': { description: 'Access token is required', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      },
      post: {
        tags: ['Books'],
        summary: 'Create book',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/BookCreateUpdateRequest' } }
          }
        },
        responses: {
          '201': { description: 'Created' },
          '401': { description: 'Access token is required', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          '500': { description: 'Internal server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    },
    '/books/{bookId}': {
      get: {
        tags: ['Books'],
        summary: 'Get book by id',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'bookId', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        responses: {
          '200': { description: 'OK', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Book' } } } } },
          '404': { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      },
      put: {
        tags: ['Books'],
        summary: 'Update book',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'bookId', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/BookCreateUpdateRequest' } } }
        },
        responses: {
          '200': { description: 'OK' },
          '404': { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      },
      delete: {
        tags: ['Books'],
        summary: 'Delete book',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'bookId', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        responses: {
          '200': { description: 'OK' },
          '404': { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } }
        }
      }
    }
  }
};

export default openapiSpec;


