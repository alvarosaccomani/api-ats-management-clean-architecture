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
        VoucherEntity: {
          type: 'object',
          properties: {
            usr_uuid: { type: 'string', format: 'uuid', example: 'b75f85b8-5cf6-4b2a-8742-ec32e35b7194' },
            crd_uuid: { type: 'string', format: 'uuid', example: '990e8400-e29b-41d4-a716-446655440001' },
            per_uuid: { type: 'string', format: 'uuid', example: 'bb0e8400-e29b-41d4-a716-446655440001' },
            vou_uuid: { type: 'string', format: 'uuid', example: 'cc0e8400-e29b-41d4-a716-446655440001' },
            vou_authorizationnumber: { type: 'string', example: '123456' },
            vou_transactionnumber: { type: 'string', example: '987654' },
            vou_datetime: { type: 'string', format: 'date-time', example: '2026-10-14T15:30:00.000Z' },
            vou_amount: { type: 'number', example: 15450.50 },
            vou_currency: { type: 'string', example: 'ARS' },
            vou_commercename: { type: 'string', example: 'Supermercado Central' },
            vou_commercecuit: { type: 'string', example: '30-70894561-2' },
            vou_commercecategory: { type: 'string', example: 'Supermercados' },
            tyop_uuid: { type: 'string', format: 'uuid', example: 'dd0e8400-e29b-41d4-a716-446655440001' },
            vou_installments: { type: 'boolean', example: true },
            vou_installmentcount: { type: 'number', example: 3 },
            vou_installmentinterest: { type: 'number', example: 0 },
            vou_poscode: { type: 'string', example: 'POS-001' },
            vou_reference: { type: 'string', example: 'Ticket #4521' },
            vous_uuid: { type: 'string', format: 'uuid', example: 'ee0e8400-e29b-41d4-a716-446655440001' },
            vou_image: { type: 'string', example: 'https://storage.example.com/voucher.jpg' },
            vou_notes: { type: 'string', example: 'Gasto operativo autorizado' },
            vou_createdat: { type: 'string', format: 'date-time' },
            vou_updatedat: { type: 'string', format: 'date-time' },
          },
        },
        VoucherInputDTO: {
          type: 'object',
          required: ['usr_uuid', 'crd_uuid', 'per_uuid', 'vou_amount', 'vou_datetime'],
          properties: {
            usr_uuid: { type: 'string', format: 'uuid', example: 'b75f85b8-5cf6-4b2a-8742-ec32e35b7194' },
            crd_uuid: { type: 'string', format: 'uuid', example: '990e8400-e29b-41d4-a716-446655440001' },
            per_uuid: { type: 'string', format: 'uuid', example: 'bb0e8400-e29b-41d4-a716-446655440001' },
            vou_amount: { type: 'number', example: 15450.50 },
            vou_datetime: { type: 'string', format: 'date-time', example: '2026-10-14T15:30:00.000Z' },
            vou_currency: { type: 'string', example: 'ARS' },
            vou_authorizationnumber: { type: 'string', example: '123456' },
            vou_transactionnumber: { type: 'string', example: '987654' },
            vou_commercename: { type: 'string', example: 'Supermercado Central' },
            vou_commercecuit: { type: 'string', example: '30-70894561-2' },
            vou_commercecategory: { type: 'string', example: 'Supermercados' },
            tyop_uuid: { type: 'string', format: 'uuid', example: 'dd0e8400-e29b-41d4-a716-446655440001' },
            vous_uuid: { type: 'string', format: 'uuid', example: 'ee0e8400-e29b-41d4-a716-446655440001' },
            vou_installments: { type: 'boolean', example: false },
            vou_installmentcount: { type: 'number', example: 1 },
            vou_installmentinterest: { type: 'number', example: 0 },
            vou_poscode: { type: 'string', example: 'POS-001' },
            vou_reference: { type: 'string', example: 'Ticket #4521' },
            vou_image: { type: 'string', example: '' },
            vou_notes: { type: 'string', example: 'Compra de insumos' },
          },
        },
        VoucherUpdateDTO: {
          type: 'object',
          properties: {
            vou_amount: { type: 'number', example: 16000 },
            vou_currency: { type: 'string', example: 'ARS' },
            vou_authorizationnumber: { type: 'string', example: '123456' },
            vou_transactionnumber: { type: 'string', example: '987654' },
            vou_commercename: { type: 'string', example: 'Supermercado Central' },
            vou_commercecuit: { type: 'string', example: '30-70894561-2' },
            vou_commercecategory: { type: 'string', example: 'Supermercados' },
            tyop_uuid: { type: 'string', format: 'uuid', example: 'dd0e8400-e29b-41d4-a716-446655440001' },
            vous_uuid: { type: 'string', format: 'uuid', example: 'ee0e8400-e29b-41d4-a716-446655440001' },
            vou_installments: { type: 'boolean', example: false },
            vou_installmentcount: { type: 'number', example: 1 },
            vou_installmentinterest: { type: 'number', example: 0 },
            vou_notes: { type: 'string', example: 'Gasto corregido' },
          },
        },
        VoucherStateEntity: {
          type: 'object',
          properties: {
            vous_uuid: { type: 'string', format: 'uuid', example: 'ee0e8400-e29b-41d4-a716-446655440001' },
            vous_name: { type: 'string', example: 'Aprobado' },
            vous_description: { type: 'string', example: 'Cupón validado y liquidado' },
            vous_createdat: { type: 'string', format: 'date-time' },
            vous_updatedat: { type: 'string', format: 'date-time' },
          },
        },
        VoucherStateInputDTO: {
          type: 'object',
          required: ['vous_name'],
          properties: {
            vous_name: { type: 'string', example: 'Pendiente' },
            vous_description: { type: 'string', example: 'Cupón pendiente de aprobación' },
          },
        },
        VoucherFeeEntity: {
          type: 'object',
          properties: {
            usr_uuid: { type: 'string', format: 'uuid', example: 'b75f85b8-5cf6-4b2a-8742-ec32e35b7194' },
            crd_uuid: { type: 'string', format: 'uuid', example: '990e8400-e29b-41d4-a716-446655440001' },
            per_uuid: { type: 'string', format: 'uuid', example: 'bb0e8400-e29b-41d4-a716-446655440001' },
            vou_uuid: { type: 'string', format: 'uuid', example: 'cc0e8400-e29b-41d4-a716-446655440001' },
            vouf_uuid: { type: 'string', format: 'uuid', example: 'fa0e8400-e29b-41d4-a716-446655440001' },
            vouf_quotanumber: { type: 'number', example: 1 },
            vouf_quotaamount: { type: 'number', example: 5150.16 },
            vouf_quotaduedate: { type: 'string', format: 'date-time', example: '2026-11-10T00:00:00.000Z' },
            voufs_uuid: { type: 'string', format: 'uuid', example: 'fb0e8400-e29b-41d4-a716-446655440001' },
            vouf_createdat: { type: 'string', format: 'date-time' },
            vouf_updatedat: { type: 'string', format: 'date-time' },
          },
        },
        VoucherFeeInputDTO: {
          type: 'object',
          required: ['usr_uuid', 'crd_uuid', 'per_uuid', 'vou_uuid', 'vouf_quotanumber', 'vouf_quotaamount', 'vouf_quotaduedate', 'voufs_uuid'],
          properties: {
            usr_uuid: { type: 'string', format: 'uuid', example: 'b75f85b8-5cf6-4b2a-8742-ec32e35b7194' },
            crd_uuid: { type: 'string', format: 'uuid', example: '990e8400-e29b-41d4-a716-446655440001' },
            per_uuid: { type: 'string', format: 'uuid', example: 'bb0e8400-e29b-41d4-a716-446655440001' },
            vou_uuid: { type: 'string', format: 'uuid', example: 'cc0e8400-e29b-41d4-a716-446655440001' },
            vouf_quotanumber: { type: 'number', example: 1 },
            vouf_quotaamount: { type: 'number', example: 5150.16 },
            vouf_quotaduedate: { type: 'string', format: 'date-time', example: '2026-11-10T00:00:00.000Z' },
            voufs_uuid: { type: 'string', format: 'uuid', example: 'fb0e8400-e29b-41d4-a716-446655440001' },
          },
        },
        VoucherFeeUpdateDTO: {
          type: 'object',
          properties: {
            vouf_quotanumber: { type: 'number', example: 1 },
            vouf_quotaamount: { type: 'number', example: 5150.16 },
            vouf_quotaduedate: { type: 'string', format: 'date-time', example: '2026-11-10T00:00:00.000Z' },
            voufs_uuid: { type: 'string', format: 'uuid', example: 'fb0e8400-e29b-41d4-a716-446655440001' },
          },
        },
        VoucherFeeStatusEntity: {
          type: 'object',
          properties: {
            voufs_uuid: { type: 'string', format: 'uuid', example: 'fb0e8400-e29b-41d4-a716-446655440001' },
            voufs_name: { type: 'string', example: 'Pagada' },
            voufs_description: { type: 'string', example: 'Cuota saldada' },
            voufs_createdat: { type: 'string', format: 'date-time' },
            voufs_updatedat: { type: 'string', format: 'date-time' },
          },
        },
        VoucherFeeStatusInputDTO: {
          type: 'object',
          required: ['voufs_name'],
          properties: {
            voufs_name: { type: 'string', example: 'Pendiente' },
            voufs_description: { type: 'string', example: 'Cuota pendiente de vencimiento' },
          },
        },
        PendingVoucherEntity: {
          type: 'object',
          properties: {
            usr_uuid: { type: 'string', format: 'uuid', example: 'b75f85b8-5cf6-4b2a-8742-ec32e35b7194' },
            pevou_uuid: { type: 'string', format: 'uuid', example: 'fc0e8400-e29b-41d4-a716-446655440001' },
            pevou_name: { type: 'string', example: 'Ticket supermercado escaneado' },
            pevou_image: { type: 'string', example: 'https://storage.example.com/scanned.jpg' },
            pevou_unreadcontent: { type: 'string', example: 'RAW OCR DATA' },
            pevou_unreadtext: { type: 'string', example: 'TEXT DETECTED FROM RECEIPT' },
            pevou_createdat: { type: 'string', format: 'date-time' },
            pevou_updatedat: { type: 'string', format: 'date-time' },
          },
        },
        PendingVoucherInputDTO: {
          type: 'object',
          required: ['usr_uuid', 'pevou_name', 'pevou_image'],
          properties: {
            usr_uuid: { type: 'string', format: 'uuid', example: 'b75f85b8-5cf6-4b2a-8742-ec32e35b7194' },
            pevou_name: { type: 'string', example: 'Ticket pendiente' },
            pevou_image: { type: 'string', example: 'https://storage.example.com/scanned.jpg' },
            pevou_unreadcontent: { type: 'string', example: 'JSON raw ocr' },
            pevou_unreadtext: { type: 'string', example: 'Total $15.450' },
          },
        },
        PendingVoucherUpdateDTO: {
          type: 'object',
          properties: {
            pevou_name: { type: 'string', example: 'Ticket revisado' },
            pevou_image: { type: 'string', example: 'https://storage.example.com/scanned2.jpg' },
            pevou_unreadcontent: { type: 'string', example: 'OCR revisado' },
            pevou_unreadtext: { type: 'string', example: 'Texto verificado' },
          },
        },
        SellerCommissionSummaryEntity: {
          type: 'object',
          properties: {
            usr_uuid: { type: 'string', format: 'uuid', example: 'b75f85b8-5cf6-4b2a-8742-ec32e35b7194' },
            total_sales: { type: 'number', example: 1250000.75 },
            total_commission: { type: 'number', example: 31250.00 },
            sales_count: { type: 'number', example: 45 },
            sales: {
              type: 'array',
              items: {
                type: 'object',
              },
            },
          },
        },
        PeriodEntity: {
          type: 'object',
          properties: {
            usr_uuid: { type: 'string', format: 'uuid', example: 'b75f85b8-5cf6-4b2a-8742-ec32e35b7194' },
            crd_uuid: { type: 'string', format: 'uuid', example: '990e8400-e29b-41d4-a716-446655440001' },
            per_uuid: { type: 'string', format: 'uuid', example: 'bb0e8400-e29b-41d4-a716-446655440001' },
            per_periodnumber: { type: 'number', example: 10 },
            per_startdate: { type: 'string', format: 'date-time', example: '2026-10-01T00:00:00.000Z' },
            per_enddate: { type: 'string', format: 'date-time', example: '2026-10-31T00:00:00.000Z' },
            per_duedate: { type: 'string', format: 'date-time', example: '2026-11-10T00:00:00.000Z' },
            sper_uuid: { type: 'string', format: 'uuid', example: 'ba0e8400-e29b-41d4-a716-446655440001' },
            per_previousbalance: { type: 'number', example: 0 },
            per_interest: { type: 'number', example: 0 },
            per_createdat: { type: 'string', format: 'date-time' },
            per_updatedat: { type: 'string', format: 'date-time' },
          },
        },
        PeriodInputDTO: {
          type: 'object',
          required: ['usr_uuid', 'crd_uuid', 'per_periodnumber', 'per_startdate', 'per_enddate', 'per_duedate', 'sper_uuid'],
          properties: {
            usr_uuid: { type: 'string', format: 'uuid', example: 'b75f85b8-5cf6-4b2a-8742-ec32e35b7194' },
            crd_uuid: { type: 'string', format: 'uuid', example: '990e8400-e29b-41d4-a716-446655440001' },
            per_periodnumber: { type: 'number', example: 10 },
            per_startdate: { type: 'string', format: 'date-time', example: '2026-10-01T00:00:00.000Z' },
            per_enddate: { type: 'string', format: 'date-time', example: '2026-10-31T00:00:00.000Z' },
            per_duedate: { type: 'string', format: 'date-time', example: '2026-11-10T00:00:00.000Z' },
            sper_uuid: { type: 'string', format: 'uuid', example: 'ba0e8400-e29b-41d4-a716-446655440001' },
            per_previousbalance: { type: 'number', example: 0 },
            per_interest: { type: 'number', example: 0 },
          },
        },
        PeriodUpdateDTO: {
          type: 'object',
          properties: {
            per_periodnumber: { type: 'number', example: 10 },
            per_startdate: { type: 'string', format: 'date-time', example: '2026-10-01T00:00:00.000Z' },
            per_enddate: { type: 'string', format: 'date-time', example: '2026-10-31T00:00:00.000Z' },
            per_duedate: { type: 'string', format: 'date-time', example: '2026-11-10T00:00:00.000Z' },
            sper_uuid: { type: 'string', format: 'uuid', example: 'ba0e8400-e29b-41d4-a716-446655440001' },
            per_previousbalance: { type: 'number', example: 0 },
            per_interest: { type: 'number', example: 0 },
          },
        },
        StatusPeriodEntity: {
          type: 'object',
          properties: {
            sper_uuid: { type: 'string', format: 'uuid', example: 'ba0e8400-e29b-41d4-a716-446655440001' },
            sper_name: { type: 'string', example: 'Abierto' },
            sper_description: { type: 'string', example: 'Período en curso y acumulando operaciones' },
            sper_createdat: { type: 'string', format: 'date-time' },
            sper_updatedat: { type: 'string', format: 'date-time' },
          },
        },
        StatusPeriodInputDTO: {
          type: 'object',
          required: ['sper_name'],
          properties: {
            sper_name: { type: 'string', example: 'Cerrado' },
            sper_description: { type: 'string', example: 'Período liquidado y cerrado' },
          },
        },
        PaymentPeriodEntity: {
          type: 'object',
          properties: {
            usr_uuid: { type: 'string', format: 'uuid', example: 'b75f85b8-5cf6-4b2a-8742-ec32e35b7194' },
            crd_uuid: { type: 'string', format: 'uuid', example: '990e8400-e29b-41d4-a716-446655440001' },
            per_uuid: { type: 'string', format: 'uuid', example: 'bb0e8400-e29b-41d4-a716-446655440001' },
            payp_uuid: { type: 'string', format: 'uuid', example: 'ca0e8400-e29b-41d4-a716-446655440001' },
            payp_paymentdate: { type: 'string', format: 'date-time', example: '2026-11-05T10:00:00.000Z' },
            payp_amountpaid: { type: 'number', example: 45000 },
            paym_uuid: { type: 'string', format: 'uuid', example: 'aa0e8400-e29b-41d4-a716-446655440001' },
            payp_paymentreference: { type: 'string', example: 'REF-789012' },
            payps_uuid: { type: 'string', format: 'uuid', example: 'cb0e8400-e29b-41d4-a716-446655440001' },
            payp_createdat: { type: 'string', format: 'date-time' },
            payp_updatedat: { type: 'string', format: 'date-time' },
          },
        },
        PaymentPeriodInputDTO: {
          type: 'object',
          required: ['usr_uuid', 'crd_uuid', 'per_uuid', 'payp_paymentdate', 'payp_amountpaid', 'paym_uuid', 'payps_uuid'],
          properties: {
            usr_uuid: { type: 'string', format: 'uuid', example: 'b75f85b8-5cf6-4b2a-8742-ec32e35b7194' },
            crd_uuid: { type: 'string', format: 'uuid', example: '990e8400-e29b-41d4-a716-446655440001' },
            per_uuid: { type: 'string', format: 'uuid', example: 'bb0e8400-e29b-41d4-a716-446655440001' },
            payp_paymentdate: { type: 'string', format: 'date-time', example: '2026-11-05T10:00:00.000Z' },
            payp_amountpaid: { type: 'number', example: 45000 },
            paym_uuid: { type: 'string', format: 'uuid', example: 'aa0e8400-e29b-41d4-a716-446655440001' },
            payp_paymentreference: { type: 'string', example: 'REF-789012' },
            payps_uuid: { type: 'string', format: 'uuid', example: 'cb0e8400-e29b-41d4-a716-446655440001' },
          },
        },
        PaymentPeriodUpdateDTO: {
          type: 'object',
          properties: {
            payp_paymentdate: { type: 'string', format: 'date-time', example: '2026-11-05T10:00:00.000Z' },
            payp_amountpaid: { type: 'number', example: 45000 },
            paym_uuid: { type: 'string', format: 'uuid', example: 'aa0e8400-e29b-41d4-a716-446655440001' },
            payp_paymentreference: { type: 'string', example: 'REF-789012' },
            payps_uuid: { type: 'string', format: 'uuid', example: 'cb0e8400-e29b-41d4-a716-446655440001' },
          },
        },
        PaymentPeriodStatusEntity: {
          type: 'object',
          properties: {
            payps_uuid: { type: 'string', format: 'uuid', example: 'cb0e8400-e29b-41d4-a716-446655440001' },
            payps_name: { type: 'string', example: 'Confirmado' },
            payps_description: { type: 'string', example: 'Pago imputado en el resumen' },
            payps_createdat: { type: 'string', format: 'date-time' },
            payps_updatedat: { type: 'string', format: 'date-time' },
          },
        },
        PaymentPeriodStatusInputDTO: {
          type: 'object',
          required: ['payps_name'],
          properties: {
            payps_name: { type: 'string', example: 'Pendiente' },
            payps_description: { type: 'string', example: 'Pago en proceso de acreditación' },
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
