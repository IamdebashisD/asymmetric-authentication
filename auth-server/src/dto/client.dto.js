import { z } from 'zod'

export const clientDto = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Client name must be at least 3 characters"),

    redirectUris: z
        .array(
            z.string().url("Each redirect URI must be a valid URL")
        )
        .min(1, "At least one redirect URI is required"),
})