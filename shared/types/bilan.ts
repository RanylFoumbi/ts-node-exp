export type BilanAnswer = { questionId: string; value: number };

export type BilanParams = { userId: string; answers: BilanAnswer[] };

export enum BilanLevel {
  Optimal = 'optimal',
  Good = 'good',
  at_risk = 'at_risk',
  critical = 'critical',
}

type BilanDimensions = {
  epanouissement: number;
  maitrise_de_soi: number;
  relations: number;
  resilience: number;
  estime_de_soi: number;
};

export type Bilan = {
  id: string;
  userId: string;
  score: number;
  level: BilanLevel;
  byDimension: BilanDimensions;
  createdAt: string;
};
