export type Stats = {
  health: number;
  strength: number;
  name: string;
};

export type Effect = {
  type: 'fire' | 'ice' | 'poison';
  damage: number;
  duration: number;
  startTurn: number;
};