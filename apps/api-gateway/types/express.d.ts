// types/express.d.ts
import { User } from '../auth/interfaces/user.interface'; // Ajusta según tu estructura

declare module 'express' {
  interface Request {
    user?: any;
  }
}
