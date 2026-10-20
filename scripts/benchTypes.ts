export interface BenchPlayerInput {
  id: string;
  identityId: string;
  editionId: string;
  name: string;
  commonName: string;
  nationality: string;
  birthYear: number;
  canonicalPosition: string;
  squadNumber: number;
  ovr: number;
  naturalPositions: string[];
  secondaryPositions: string[];
  hasLegendSeal?: boolean;
  legendSealReason?: string;
  appearances: number;
  goals: number;
  assists?: number;
  cleanSheets?: number;
  ratingRationale: string;
  sourceId: string;
  sourceFact: string;
}

