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
        UserInputDTO: {
          type: 'object',
          required: ['usr_name', 'usr_surname', 'usr_nick', 'usr_email', 'usr_password'],
          properties: {
            usr_name: { type: 'string', example: 'John' },
            usr_surname: { type: 'string', example: 'Doe' },
            usr_nick: { type: 'string', example: 'johndoe' },
            usr_email: { type: 'string', format: 'email', example: 'john.doe@example.com' },
            usr_password: { type: 'string', format: 'password', example: 'StrongP@ssw0rd' },
            usr_bio: { type: 'string', example: 'Senior Engineer' },
            usr_image: { type: 'string', example: '' },
          },
        },
        UserUpdateDTO: {
          type: 'object',
          required: ['usr_nick', 'usr_email'],
          properties: {
            usr_name: { type: 'string', example: 'John' },
            usr_surname: { type: 'string', example: 'Doe' },
            usr_nick: { type: 'string', example: 'johndoe' },
            usr_email: { type: 'string', format: 'email', example: 'john.doe@example.com' },
            usr_bio: { type: 'string', example: 'Lead Developer' },
            usr_image: { type: 'string', example: '' },
            usr_online: { type: 'boolean', example: true },
          },
        },
        RegisterDTO: {
          type: 'object',
          required: ['usr_name', 'usr_surname', 'usr_email', 'usr_password', 'usr_nick'],
          properties: {
            usr_name: { type: 'string', example: 'John' },
            usr_surname: { type: 'string', example: 'Doe' },
            usr_email: { type: 'string', format: 'email', example: 'john.doe@example.com' },
            usr_password: { type: 'string', format: 'password', example: 'StrongP@ssw0rd' },
            usr_nick: { type: 'string', example: 'johndoe' },
            usr_bio: { type: 'string', example: 'Software Engineer' },
          },
        },
        ConfirmAccountDTO: {
          type: 'object',
          required: ['token'],
          properties: {
            token: { type: 'string', example: 'confirmation_jwt_token_here' },
          },
        },
        ForgotPasswordDTO: {
          type: 'object',
          required: ['usr_email'],
          properties: {
            usr_email: { type: 'string', format: 'email', example: 'user@example.com' },
          },
        },
        ResetPasswordDTO: {
          type: 'object',
          required: ['token', 'newPassword'],
          properties: {
            token: { type: 'string', example: 'reset_token_here' },
            newPassword: { type: 'string', format: 'password', example: 'NewSecret123!' },
          },
        },
        PersonEntity: {
          type: 'object',
          properties: {
            prs_uuid: { type: 'string', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440000' },
            scp_uuid: { type: 'string', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440001' },
            usr_uuidlinked: { type: 'string', format: 'uuid', nullable: true, example: null },
            prs_name: { type: 'string', example: 'Empresa Demo S.A.' },
            prs_type: { type: 'string', example: 'CLIENT', description: 'Tipo de persona: CLIENT, SUPPLIER, etc.' },
            prs_phone: { type: 'string', nullable: true, example: '+5491122334455' },
            prs_email: { type: 'string', format: 'email', nullable: true, example: 'contacto@empresa.com' },
            prs_taxid: { type: 'string', nullable: true, example: '30-71234567-9' },
            prs_commissionrate: { type: 'number', nullable: true, example: 2.5 },
            prs_active: { type: 'boolean', example: true },
            prs_createdat: { type: 'string', format: 'date-time' },
            prs_updatedat: { type: 'string', format: 'date-time' },
          },
        },
        PersonInputDTO: {
          type: 'object',
          required: ['scp_uuid', 'prs_name', 'prs_type'],
          properties: {
            scp_uuid: { type: 'string', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440001' },
            prs_name: { type: 'string', example: 'Empresa Demo S.A.' },
            prs_type: { type: 'string', example: 'CLIENT' },
            usr_uuidlinked: { type: 'string', format: 'uuid', nullable: true, example: null },
            prs_phone: { type: 'string', example: '+5491122334455' },
            prs_email: { type: 'string', format: 'email', example: 'contacto@empresa.com' },
            prs_taxid: { type: 'string', example: '30-71234567-9' },
            prs_commissionrate: { type: 'number', example: 2.5 },
            prs_active: { type: 'boolean', example: true },
          },
        },
        ScopeEntity: {
          type: 'object',
          properties: {
            scp_uuid: { type: 'string', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440001' },
            scp_name: { type: 'string', example: 'Ámbito Principal' },
            scp_description: { type: 'string', nullable: true, example: 'Ámbito default para operaciones' },
            scp_isshared: { type: 'boolean', example: false },
            scp_color: { type: 'string', nullable: true, example: '#3498db' },
            scp_icon: { type: 'string', nullable: true, example: 'folder' },
            usr_uuidowner: { type: 'string', format: 'uuid', example: 'b75f85b8-5cf6-4b2a-8742-ec32e35b7194' },
            scp_active: { type: 'boolean', example: true },
            scp_createdat: { type: 'string', format: 'date-time' },
            scp_updatedat: { type: 'string', format: 'date-time' },
          },
        },
        ScopeInputDTO: {
          type: 'object',
          required: ['scp_name', 'usr_uuidowner'],
          properties: {
            scp_name: { type: 'string', example: 'Ámbito Comercial' },
            usr_uuidowner: { type: 'string', format: 'uuid', example: 'b75f85b8-5cf6-4b2a-8742-ec32e35b7194' },
            scp_description: { type: 'string', example: 'Ámbito para gestión comercial' },
            scp_isshared: { type: 'boolean', example: true },
            scp_color: { type: 'string', example: '#2ecc71' },
            scp_icon: { type: 'string', example: 'briefcase' },
            scp_active: { type: 'boolean', example: true },
          },
        },
        ScopeUserEntity: {
          type: 'object',
          properties: {
            scp_uuid: { type: 'string', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440001' },
            usr_uuid: { type: 'string', format: 'uuid', example: 'b75f85b8-5cf6-4b2a-8742-ec32e35b7194' },
            scpu_role: { type: 'string', example: 'ADMIN', description: 'Rol en el ámbito: ADMIN, MEMBER, VIEWER' },
            scpu_createdat: { type: 'string', format: 'date-time' },
          },
        },
        ScopeUserInputDTO: {
          type: 'object',
          required: ['scp_uuid', 'usr_uuid', 'scpu_role'],
          properties: {
            scp_uuid: { type: 'string', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440001' },
            usr_uuid: { type: 'string', format: 'uuid', example: 'b75f85b8-5cf6-4b2a-8742-ec32e35b7194' },
            scpu_role: { type: 'string', example: 'ADMIN' },
          },
        },
        BankEntity: {
          type: 'object',
          properties: {
            usr_uuid: { type: 'string', format: 'uuid', example: 'b75f85b8-5cf6-4b2a-8742-ec32e35b7194' },
            ban_uuid: { type: 'string', format: 'uuid', example: '660e8400-e29b-41d4-a716-446655440001' },
            ban_name: { type: 'string', example: 'Banco Santander' },
            ban_description: { type: 'string', example: 'Cuenta corriente operativa' },
            ban_createdat: { type: 'string', format: 'date-time' },
            ban_updatedat: { type: 'string', format: 'date-time' },
          },
        },
        BankInputDTO: {
          type: 'object',
          required: ['usr_uuid', 'ban_name'],
          properties: {
            usr_uuid: { type: 'string', format: 'uuid', example: 'b75f85b8-5cf6-4b2a-8742-ec32e35b7194' },
            ban_name: { type: 'string', example: 'Banco Galicia' },
            ban_description: { type: 'string', example: 'Caja de ahorro principal' },
          },
        },
        BankUpdateDTO: {
          type: 'object',
          properties: {
            ban_name: { type: 'string', example: 'Banco Galicia Actualizado' },
            ban_description: { type: 'string', example: 'Descripción actualizada' },
          },
        },
        BrandCardEntity: {
          type: 'object',
          properties: {
            brcrd_uuid: { type: 'string', format: 'uuid', example: '770e8400-e29b-41d4-a716-446655440001' },
            brcrd_name: { type: 'string', example: 'VISA' },
            brcrd_description: { type: 'string', example: 'Red internacional Visa' },
            brcrd_createdat: { type: 'string', format: 'date-time' },
            brcrd_updatedat: { type: 'string', format: 'date-time' },
          },
        },
        BrandCardInputDTO: {
          type: 'object',
          required: ['brcrd_name'],
          properties: {
            brcrd_name: { type: 'string', example: 'Mastercard' },
            brcrd_description: { type: 'string', example: 'Red Mastercard' },
          },
        },
        TypeCardEntity: {
          type: 'object',
          properties: {
            tycrd_uuid: { type: 'string', format: 'uuid', example: '880e8400-e29b-41d4-a716-446655440001' },
            tycrd_name: { type: 'string', example: 'Crédito' },
            tycrd_description: { type: 'string', example: 'Tarjeta de crédito corporativa o personal' },
            tycrd_createdat: { type: 'string', format: 'date-time' },
            tycrd_updatedat: { type: 'string', format: 'date-time' },
          },
        },
        TypeCardInputDTO: {
          type: 'object',
          required: ['tycrd_name'],
          properties: {
            tycrd_name: { type: 'string', example: 'Débito' },
            tycrd_description: { type: 'string', example: 'Tarjeta de débito en cuenta bancaria' },
          },
        },
        CardEntity: {
          type: 'object',
          properties: {
            usr_uuid: { type: 'string', format: 'uuid', example: 'b75f85b8-5cf6-4b2a-8742-ec32e35b7194' },
            crd_uuid: { type: 'string', format: 'uuid', example: '990e8400-e29b-41d4-a716-446655440001' },
            scp_uuid: { type: 'string', format: 'uuid', nullable: true, example: null },
            crd_alias: { type: 'string', nullable: true, example: 'Visa Santander Corporativa' },
            crd_cardholdername: { type: 'string', nullable: true, example: 'Juan Perez' },
            crd_maskedcardnumber: { type: 'string', example: '4509********1234' },
            crd_last4digits: { type: 'string', example: '1234' },
            tycrd_uuid: { type: 'string', format: 'uuid', example: '880e8400-e29b-41d4-a716-446655440001' },
            brcrd_uuid: { type: 'string', format: 'uuid', example: '770e8400-e29b-41d4-a716-446655440001' },
            ban_uuid: { type: 'string', format: 'uuid', example: '660e8400-e29b-41d4-a716-446655440001' },
            crd_expirationdate: { type: 'string', format: 'date-time', example: '2028-12-31T00:00:00.000Z' },
            crd_creditlimit: { type: 'number', nullable: true, example: 500000 },
            crd_active: { type: 'boolean', example: true },
            crd_allowdelegation: { type: 'boolean', example: false },
            crd_createdat: { type: 'string', format: 'date-time' },
            crd_updatedat: { type: 'string', format: 'date-time' },
          },
        },
        CardInputDTO: {
          type: 'object',
          required: ['usr_uuid', 'crd_maskedcardnumber', 'crd_last4digits', 'tycrd_uuid', 'brcrd_uuid', 'ban_uuid', 'crd_expirationdate'],
          properties: {
            usr_uuid: { type: 'string', format: 'uuid', example: 'b75f85b8-5cf6-4b2a-8742-ec32e35b7194' },
            crd_maskedcardnumber: { type: 'string', example: '4509********1234' },
            crd_last4digits: { type: 'string', example: '1234' },
            tycrd_uuid: { type: 'string', format: 'uuid', example: '880e8400-e29b-41d4-a716-446655440001' },
            brcrd_uuid: { type: 'string', format: 'uuid', example: '770e8400-e29b-41d4-a716-446655440001' },
            ban_uuid: { type: 'string', format: 'uuid', example: '660e8400-e29b-41d4-a716-446655440001' },
            crd_expirationdate: { type: 'string', format: 'date-time', example: '2028-12-31T00:00:00.000Z' },
            crd_creditlimit: { type: 'number', example: 500000 },
            crd_active: { type: 'boolean', example: true },
            scp_uuid: { type: 'string', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440001' },
            crd_alias: { type: 'string', example: 'Visa Santander' },
            crd_cardholdername: { type: 'string', example: 'Juan Perez' },
            crd_allowdelegation: { type: 'boolean', example: false },
          },
        },
        CardUpdateDTO: {
          type: 'object',
          properties: {
            crd_alias: { type: 'string', example: 'Visa Santander Personal' },
            crd_cardholdername: { type: 'string', example: 'Juan Perez' },
            crd_creditlimit: { type: 'number', example: 750000 },
            crd_active: { type: 'boolean', example: true },
            crd_allowdelegation: { type: 'boolean', example: true },
          },
        },
        PaymentMethodEntity: {
          type: 'object',
          properties: {
            paym_uuid: { type: 'string', format: 'uuid', example: 'aa0e8400-e29b-41d4-a716-446655440001' },
            paym_name: { type: 'string', example: 'Transferencia Bancaria' },
            paym_description: { type: 'string', example: 'Pago por transferencia directa CBU/CVU' },
            paym_createdat: { type: 'string', format: 'date-time' },
            paym_updatedat: { type: 'string', format: 'date-time' },
          },
        },
        PaymentMethodInputDTO: {
          type: 'object',
          required: ['paym_name'],
          properties: {
            paym_name: { type: 'string', example: 'Mercado Pago' },
            paym_description: { type: 'string', example: 'Cobro a través de QR de Mercado Pago' },
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
