import { z } from 'zod';

export const ConfigSchema = z
  .object({
    theme: z
      .union([z.literal('side'), z.literal('bottom'), z.literal('top')])
      .default('top'),
    footerLinks: z
      .object({
        youtube: z.string().url(),
        x: z.string().url(),
        twitch: z.string().url(),
        linkedin: z.string().url(),
        instagram: z.string().url(),
        github: z.string().url(),
        gitlab: z.string().url(),
        facebook: z.string().url(),
        reddit: z.string().url(),
      })
      .partial(),
  })
  .partial();

export type Config = z.infer<typeof ConfigSchema>;
