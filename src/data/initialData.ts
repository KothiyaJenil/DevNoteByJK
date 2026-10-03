import type { Note, NotesFlow } from '../types';

export const INITIAL_NOTES: Note[] = [
  {
    id: 'note-express-route',
    title: 'Express Route Handler Pattern',
    description: 'Structure REST API HTTP route definitions and delegate processing cleanly to controllers.',
    createdAt: '2026-08-20T14:30:00Z',
    updatedAt: '2026-08-26T09:15:00Z',
    isFavorite: true,
    viewCount: 142,
    tags: ['express', 'backend', 'routing', 'nodejs', 'rest-api'],
    references: [
      { id: 'ref-1', title: 'Express Routing Guide', url: 'https://expressjs.com/en/guide/routing.html' }
    ],
    sections: [
      {
        id: 'sec-route-concept',
        heading: 'What is an Express Route?',
        explanation: 'Express routes map incoming HTTP URI paths and HTTP verbs (GET, POST, PUT, DELETE) to designated handler functions.',
        points: [
          'Routes define endpoint paths like /api/v1/users or /api/v1/auth/login.',
          'Routes acts as entry points, invoking middleware pipelines before hitting controllers.',
          'Decouple route definitions into modular router files using express.Router().'
        ],
        codeSnippets: [
          {
            id: 'snip-route-1',
            language: 'javascript',
            title: 'routes/userRoutes.js',
            code: `const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createUserSchema } = require('../validators/userValidator');

// GET all users (Protected)
router.get('/', authMiddleware, userController.getUsers);

// POST create user (Validated & Protected)
router.post('/', authMiddleware, validate(createUserSchema), userController.createUser);

module.exports = router;`
          }
        ]
      },
      {
        id: 'sec-route-best-practices',
        heading: 'Routing Principles & Standard Practices',
        explanation: 'Keep router files lean. Route definitions should strictly handle route mapping and middleware placement.',
        points: [
          'Do NOT place business logic inside route files.',
          'Group endpoints by resource domain (e.g., authRoutes, orderRoutes, productRoutes).',
          'Prefix API versions consistently at mount level in app.js: app.use("/api/v1/users", userRoutes).'
        ],
        codeSnippets: [
          {
            id: 'snip-route-2',
            language: 'javascript',
            title: 'app.js mounting pattern',
            code: `const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

app.use(express.json());

// API Versioning Mount
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);`
          }
        ]
      }
    ]
  },
  {
    id: 'note-express-middleware',
    title: 'Express Middleware Pattern',
    description: 'Interception logic executing during HTTP request processing with req, res, and next invocation.',
    createdAt: '2026-08-21T10:00:00Z',
    updatedAt: '2026-08-27T08:20:00Z',
    isFavorite: true,
    viewCount: 310,
    tags: ['express', 'middleware', 'backend', 'nodejs', 'security'],
    references: [
      { id: 'ref-2', title: 'Writing Express Middleware', url: 'https://expressjs.com/en/guide/writing-middleware.html' }
    ],
    sections: [
      {
        id: 'sec-mw-concept',
        heading: 'What is Middleware?',
        explanation: 'Middleware functions have access to the request object (req), response object (res), and the next middleware function in the application request-response cycle.',
        points: [
          'Middleware functions can execute any custom code.',
          'They can modify req and res objects (e.g., attaching req.user).',
          'They end the request-response cycle or invoke next() to pass control to the next handler.',
          'Failing to call next() or return res.send() will leave the client HTTP request hanging.'
        ],
        codeSnippets: [
          {
            id: 'snip-mw-1',
            language: 'javascript',
            title: 'middleware/auth.js',
            code: `const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach payload to request
    next(); // Pass control to next middleware/controller
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }
};

module.exports = authMiddleware;`
          }
        ]
      },
      {
        id: 'sec-mw-types',
        heading: 'Why & When to Use Middleware',
        explanation: 'Middleware decouples cross-cutting concerns from core controller business logic.',
        points: [
          'Authentication & Role Verification (JWT, OAuth, RBAC)',
          'Request Body Validation (Zod, Joi)',
          'Logging & Telemetry (Morgan, Winston)',
          'Rate Limiting & Security Headers (Helmet, express-rate-limit)'
        ],
        codeSnippets: []
      }
    ]
  },
  {
    id: 'note-request-validation',
    title: 'Request Validation with Zod & Joi',
    description: 'Ensure incoming req.body, req.query, and req.params conform strictly to predefined schema definitions.',
    createdAt: '2026-08-22T16:45:00Z',
    updatedAt: '2026-08-25T11:10:00Z',
    isFavorite: false,
    viewCount: 189,
    tags: ['validation', 'zod', 'typescript', 'express', 'security'],
    references: [
      { id: 'ref-3', title: 'Zod Documentation', url: 'https://zod.dev' }
    ],
    sections: [
      {
        id: 'sec-val-zod',
        heading: 'Schema Validation Middleware',
        explanation: 'Validate incoming payloads before hitting business logic to prevent malformed data insertion or runtime type errors.',
        points: [
          'Define strict schema validators for request body, query params, and route parameters.',
          'Return standard 400 Bad Request responses with detailed field validation messages.',
          'Sanitize input data to protect against XSS and injection vulnerabilities.'
        ],
        codeSnippets: [
          {
            id: 'snip-val-1',
            language: 'javascript',
            title: 'middleware/validate.js',
            code: `const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    query: req.query,
    params: req.params,
  });

  if (!result.success) {
    const errorDetails = result.error.issues.map(issue => ({
      field: issue.path.join('.'),
      message: issue.message
    }));
    return res.status(400).json({ error: 'Validation Failed', details: errorDetails });
  }

  req.validatedData = result.data;
  next();
};

module.exports = validate;`
          },
          {
            id: 'snip-val-2',
            language: 'typescript',
            title: 'schemas/userSchema.ts',
            code: `import { z } from 'zod';

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address format'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    role: z.enum(['admin', 'developer', 'viewer']).optional()
  })
});`
          }
        ]
      }
    ]
  },
  {
    id: 'note-express-controller',
    title: 'Express Controller Layer',
    description: 'Process validated request input, invoke service logic, and format HTTP responses.',
    createdAt: '2026-08-23T11:20:00Z',
    updatedAt: '2026-08-26T18:00:00Z',
    isFavorite: true,
    viewCount: 245,
    tags: ['controller', 'express', 'architecture', 'backend', 'clean-code'],
    references: [],
    sections: [
      {
        id: 'sec-ctrl-role',
        heading: 'Controller Responsibility',
        explanation: 'Controllers bridge HTTP requests with underlying backend services. They handle request context extraction and client response delivery.',
        points: [
          'Extract params from req.params, req.body, and req.user.',
          'Invoke domain Service functions to perform business rules.',
          'Send status codes (200 OK, 201 Created, 404 Not Found) with formatted JSON output.',
          'Catch async errors and delegate them to global error middleware.'
        ],
        codeSnippets: [
          {
            id: 'snip-ctrl-1',
            language: 'javascript',
            title: 'controllers/userController.js',
            code: `const userService = require('../services/userService');

const createUser = async (req, res, next) => {
  try {
    const { body } = req.validatedData || req;
    const newUser = await userService.registerUser(body);
    
    return res.status(201).json({
      success: true,
      data: newUser
    });
  } catch (error) {
    next(error); // Pass to global error middleware
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers(req.query);
    return res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
};

module.exports = { createUser, getUsers };`
          }
        ]
      }
    ]
  },
  {
    id: 'note-service-layer',
    title: 'Business Service Layer Pattern',
    description: 'Encapsulate core domain business rules and multi-repository transactions independent of HTTP routing.',
    createdAt: '2026-08-24T09:30:00Z',
    updatedAt: '2026-08-26T20:00:00Z',
    isFavorite: false,
    viewCount: 165,
    tags: ['service-layer', 'architecture', 'clean-code', 'nodejs', 'backend'],
    references: [],
    sections: [
      {
        id: 'sec-svc-concept',
        heading: 'Why Decouple Services from Controllers?',
        explanation: 'Service functions contain reusable application logic. Decoupling services makes unit testing effortless without mocking HTTP request/response objects.',
        points: [
          'Never access req or res inside a Service file.',
          'Services communicate directly with ORM/ODM Models or Database clients.',
          'Enforce business constraints (e.g., check for duplicate email before creating user).',
          'Throw custom Error instances (e.g., ConflictError, NotFoundError).'
        ],
        codeSnippets: [
          {
            id: 'snip-svc-1',
            language: 'javascript',
            title: 'services/userService.js',
            code: `const User = require('../models/User');
const bcrypt = require('bcryptjs');

const registerUser = async (userData) => {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    const error = new Error('Email is already registered.');
    error.statusCode = 409;
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password, salt);

  const user = await User.create({
    ...userData,
    password: hashedPassword
  });

  const userObject = user.toObject();
  delete userObject.password;
  return userObject;
};

module.exports = { registerUser };`
          }
        ]
      }
    ]
  },
  {
    id: 'note-mongoose-model',
    title: 'Mongoose Schema & Model Layer',
    description: 'MongoDB object modeling, schema definitions, indexes, hooks, and static methods in Mongoose.',
    createdAt: '2026-08-24T14:10:00Z',
    updatedAt: '2026-08-25T15:30:00Z',
    isFavorite: true,
    viewCount: 220,
    tags: ['mongoose', 'mongodb', 'database', 'schema', 'backend'],
    references: [
      { id: 'ref-4', title: 'Mongoose Docs', url: 'https://mongoosejs.com/docs/' }
    ],
    sections: [
      {
        id: 'sec-model-schema',
        heading: 'Defining Mongoose Schemas',
        explanation: 'Schemas define document properties, types, default values, validations, and database indexes.',
        points: [
          'Add compound indexes for frequent queries to ensure high throughput.',
          'Use pre/post middleware hooks for automatic timestamping or hashing.',
          'Exclude sensitive attributes (like password hash) by default using select: false.'
        ],
        codeSnippets: [
          {
            id: 'snip-model-1',
            language: 'javascript',
            title: 'models/User.js',
            code: `const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['admin', 'developer', 'viewer'], default: 'developer' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);`
          }
        ]
      }
    ]
  },
  {
    id: 'note-error-handling',
    title: 'Centralized Express Error Handling',
    description: 'Global error handling middleware catching runtime errors, formatted standard API error responses.',
    createdAt: '2026-08-25T08:00:00Z',
    updatedAt: '2026-08-27T07:10:00Z',
    isFavorite: false,
    viewCount: 175,
    tags: ['error-handling', 'express', 'middleware', 'backend'],
    references: [],
    sections: [
      {
        id: 'sec-err-global',
        heading: 'Global Error Middleware Handler',
        explanation: 'Express recognizes error handling middleware when 4 parameters (err, req, res, next) are declared.',
        points: [
          'Always place global error middleware at the very end of app.js after all routes.',
          'Format standard response structure `{ success: false, error: message, stack }`.',
          'Hide stack traces in production environment (`process.env.NODE_ENV === "production"`).'
        ],
        codeSnippets: [
          {
            id: 'snip-err-1',
            language: 'javascript',
            title: 'middleware/errorHandler.js',
            code: `const errorHandler = (err, req, res, next) => {
  console.error('[API Error]:', err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};

module.exports = errorHandler;`
          }
        ]
      }
    ]
  }
];

export const INITIAL_FLOWS: NotesFlow[] = [
  {
    id: 'flow-mern-api',
    title: 'MERN API Request Processing Sequence',
    description: 'The end-to-end logical lifecycle of an incoming HTTP request through an Express & MongoDB architecture.',
    createdAt: '2026-08-24T12:00:00Z',
    updatedAt: '2026-08-26T16:00:00Z',
    isFavorite: true,
    tags: ['mern', 'architecture', 'express', 'mongodb', 'rest-api'],
    notes: [
      { noteId: 'note-express-route', order: 1, noteStepTitle: '1. Express Route', notesSummary: 'Matches HTTP path & verb' },
      { noteId: 'note-express-middleware', order: 2, noteStepTitle: '2. Auth Middleware', notesSummary: 'Verifies JWT authorization token' },
      { noteId: 'note-request-validation', order: 3, noteStepTitle: '3. Request Validation', notesSummary: 'Validates req.body schema with Zod' },
      { noteId: 'note-express-controller', order: 4, noteStepTitle: '4. Controller Layer', notesSummary: 'Extracts request inputs & returns status code' },
      { noteId: 'note-service-layer', order: 5, noteStepTitle: '5. Business Service', notesSummary: 'Executes domain rules & hashes passwords' },
      { noteId: 'note-mongoose-model', order: 6, noteStepTitle: '6. Mongoose Model', notesSummary: 'Performs MongoDB collection queries' },
      { noteId: 'note-error-handling', order: 7, noteStepTitle: '7. Centralized Error Handler', notesSummary: 'Catches async errors & formats 500/400 responses' }
    ]
  },
  {
    id: 'flow-auth-pipeline',
    title: 'JWT Authentication & Authorization Flow',
    description: 'How user credentials are verified, tokens issued, and protected routes authenticated.',
    createdAt: '2026-08-25T15:00:00Z',
    updatedAt: '2026-08-27T08:00:00Z',
    isFavorite: true,
    tags: ['auth', 'security', 'jwt', 'express'],
    notes: [
      { noteId: 'note-express-route', order: 1, noteStepTitle: 'Route Listener', notesSummary: 'Intercepts POST /api/v1/auth/login' },
      { noteId: 'note-request-validation', order: 2, noteStepTitle: 'Input Validation', notesSummary: 'Ensures valid email format & password length' },
      { noteId: 'note-express-controller', order: 3, noteStepTitle: 'Auth Controller', notesSummary: 'Coordinates auth login flow' },
      { noteId: 'note-service-layer', order: 4, noteStepTitle: 'Auth Service', notesSummary: 'Compares bcrypt password hashes & signs JWT' },
      { noteId: 'note-express-middleware', order: 5, noteStepTitle: 'Bearer Middleware', notesSummary: 'Intercepts subsequent requests to verify Bearer JWT' }
    ]
  }
];
