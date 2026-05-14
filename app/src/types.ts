export type Position =
  | 'TW'   // Torwart
  | 'IV'   // Innenverteidiger
  | 'LV'   // Linker Verteidiger
  | 'RV'   // Rechter Verteidiger
  | 'ZDM'  // Zentrales defensives Mittelfeld
  | 'ZM'   // Zentrales Mittelfeld
  | 'ZOM'  // Zentrales offensives Mittelfeld
  | 'LM'   // Linkes Mittelfeld
  | 'RM'   // Rechtes Mittelfeld
  | 'LA'   // Linksaußen
  | 'RA'   // Rechtsaußen
  | 'ST';  // Stürmer

export type PositionGroup = 'TOR' | 'ABWEHR' | 'MITTELFELD' | 'STURM';

export type PlayerStatus = 'fit' | 'verletzt';

export interface Player {
  id: string;
  name: string;
  number: number;
  position: Position;
  age: number;
  games: number;
  goals: number;
  status: PlayerStatus;
  injury?: string; // e.g. "Muskelfaserriss · 2 Wochen"
}

export const positionToGroup: Record<Position, PositionGroup> = {
  TW: 'TOR',
  IV: 'ABWEHR',
  LV: 'ABWEHR',
  RV: 'ABWEHR',
  ZDM: 'MITTELFELD',
  ZM: 'MITTELFELD',
  ZOM: 'MITTELFELD',
  LM: 'MITTELFELD',
  RM: 'MITTELFELD',
  LA: 'STURM',
  RA: 'STURM',
  ST: 'STURM',
};

export const positionGroupOrder: PositionGroup[] = ['TOR', 'ABWEHR', 'MITTELFELD', 'STURM'];

export const allPositions: Position[] = ['TW', 'IV', 'LV', 'RV', 'ZDM', 'ZM', 'ZOM', 'LM', 'RM', 'LA', 'RA', 'ST'];
