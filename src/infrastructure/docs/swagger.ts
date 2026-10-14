import { Express, Request, Response } from 'express';
import swaggerJSDoc, { OAS3Options } from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const port = process.env.PORT || '4000';
const rawBaseUrl = process.env.BASE_URL_API || 'api';
const baseUrlApi = rawBaseUrl.replace(/^\/+|\/+$/g, '');

const swaggerOptions: OAS3Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ATS Management API',
      version: '1.0.0',
      description: 'API documentation for ATS Management built with Node.js, TypeScript and Clean Architecture',
    },
    servers: [
      {
        url: `http://localhost:${port}/${baseUrlApi}`,
        description: 'Development server with API prefix',
      },
      {
        url: `http://localhost:${port}`,
        description: 'Root server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        UserEntity: {
          type: 'object',
          properties: {
            usr_uuid: {
              type: 'string',
              format: 'uuid',
              example: 'b75f85b8-5cf6-4b2a-8742-ec32e35b7194',
            },
            usr_name: {
              type: 'string',
              example: 'John',
            },
            usr_surname: {
              type: 'string',
              example: 'Doe',
            },
            usr_email: {
              type: 'string',
              format: 'email',
              example: 'john.doe@example.com',
            },
            usr_nick: {
              type: 'string',
              example: 'johndoe',
            },
            usr_bio: {
              type: 'string',
              example: 'Senior Developer',
            },
            usr_socket: {
              type: 'string',
              example: '',
            },
            usr_online: {
              type: 'boolean',
              example: false,
            },
            usr_createdat: {
              type: 'string',
              format: 'date-time',
              example: '2026-01-01T00:00:00.000Z',
            },
            usr_updatedat: {
              type: 'string',
              format: 'date-time',
              example: '2026-01-01T00:00:00.000Z',
            },
          },
        },
        LoginDTO: {
          type: 'object',
          required: ['usr_user', 'usr_password'],
          properties: {
            usr_user: {
              type: 'string',
              description: 'Email or username of the user',
              example: 'alvaro.sacomani@gmail.com',
            },
            usr_password: {
              type: 'string',
              format: 'password',
              example: '12345678',
            },
            gettoken: {
              type: 'boolean',
              description: 'Flag to return JWT token string or user entity object',
              example: true,
            },
          },
        },
        StandardResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Operación exitosa',
            },
            data: {
              type: 'object',
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Mensaje descriptivo del error',
            },
          },
        },
      },
    },
  },
  apis: [
    './src/infrastructure/router/**/*.route.ts',
    './dist/infrastructure/router/**/*.route.js',
  ],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions) as swaggerUi.JsonObject;

export function configureSwagger(app: Express): void {
  const docsPath = `/${baseUrlApi}/api-docs`;
  const jsonPath = `/${baseUrlApi}/api-docs.json`;

  app.use(docsPath, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.get(jsonPath, (_req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
}

export default configureSwagger;
