import { email, string, z } from 'zod'

export const RegisterDto = z.object({
    name: z
        .string()
        .trim()
        .min(3, 'Name must be at least 3 characters'),

    email: z
        .email('Invalid email address')
        .trim()
        .toLowerCase(),
        
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
})