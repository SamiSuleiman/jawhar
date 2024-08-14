import { z } from 'zod';

export const ConfigSchema = z.object({
  theme: z.union([
    z.literal('side'),
    z.literal('bottom'),
    z.literal('default'),
  ]),
  footerLinks: z.object({
    youtube: z.string(),
    x: z.string(),
    twitch: z.string(),
    linkedin: z.string(),
    instagram: z.string(),
    github: z.string(),
    gitlab: z.string(),
    facebook: z.string(),
    reddit: z.string(),
  }),
});

export type Config = z.infer<typeof ConfigSchema>;
