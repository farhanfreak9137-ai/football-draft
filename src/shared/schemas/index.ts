import { z } from 'zod';

export const PositionEnum = z.enum([
  'GK', 'CB', 'LB', 'RB', 'LWB', 'RWB',
  'CDM', 'CM', 'CAM', 'LM', 'RM',
  'LW', 'RW', 'CF', 'ST', 'SS'
]);

export const PoolTypeEnum = z.enum(['national', 'club']);

export const VerificationStatusEnum = z.enum([
  'verified',
  'partially_verified',
  'pending_research'
]);

export const SourceReferenceSchema = z.object({
  sourceId: z.string().min(1),
  fact: z.string().min(1),
});

export const SourceRecordSchema = z.object({
  id: z.string().min(1),
  sourceName: z.string().min(1),
  url: z.string().url(),
  accessDate: z.string(),
  factSupported: z.string().min(1),
  verificationStatus: VerificationStatusEnum,
  licenseNotes: z.string(),
});

export const PlayerIdentitySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  commonName: z.string().optional(),
  nationality: z.string().min(1),
  birthYear: z.number().int().min(1900).max(2010),
  canonicalPosition: PositionEnum,
});

export const TeamEditionSchema = z.object({
  id: z.string().min(1),
  teamId: z.string().min(1),
  teamName: z.string().min(1),
  editionType: PoolTypeEnum,
  yearOrSeason: z.string().min(1),
  competition: z.string().min(1),
  achievement: z.string().min(1),
  coach: z.string().min(1),
  tacticalFormation: z.string().min(1),
  verifiedSourceIds: z.array(z.string()).min(1),
  verificationStatus: VerificationStatusEnum,
});

export const PlayerVersionSchema = z.object({
  id: z.string().min(1),
  identityId: z.string().min(1),
  editionId: z.string().min(1),
  name: z.string().min(1),
  squadNumber: z.number().int().min(1).max(99),
  ovr: z.number().int().min(1).max(100),
  naturalPositions: z.array(PositionEnum).min(1),
  secondaryPositions: z.array(PositionEnum),
  hasLegendSeal: z.boolean(),
  legendSealReason: z.string().optional(),
  tournamentOrSeasonStats: z.object({
    appearances: z.number().int().nonnegative(),
    goals: z.number().int().nonnegative(),
    assists: z.number().int().nonnegative().optional(),
    cleanSheets: z.number().int().nonnegative().optional(),
  }),
  ratingRationale: z.string().min(5),
  methodologyVersion: z.string().min(1),
  reviewer: z.string().min(1),
  reviewDate: z.string(),
  verificationStatus: VerificationStatusEnum,
  sources: z.array(SourceReferenceSchema).min(1),
});

