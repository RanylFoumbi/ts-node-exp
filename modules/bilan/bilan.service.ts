import { CustomError } from "../../shared/errors.ts";
import {
  BilanLevel,
  type Bilan,
  type BilanAnswer,
  type BilanDimensions,
  type BilanParams,
} from "../../shared/types/bilan.ts";

const QUESTIONNAIRE = [
  { id: "q1", dimension: "epanouissement" },
  { id: "q2", dimension: "epanouissement" },
  { id: "q3", dimension: "maitrise_de_soi" },
  { id: "q4", dimension: "maitrise_de_soi" },
  { id: "q5", dimension: "relations" },
  { id: "q6", dimension: "relations" },
  { id: "q7", dimension: "resilience" },
  { id: "q8", dimension: "resilience" },
  { id: "q9", dimension: "estime_de_soi" },
  { id: "q10", dimension: "estime_de_soi" },
];

export class BilanService {
  bilans: Bilan[] = [
    {
      id: "bilan-1761234567890",
      userId: "user123",
      score: 80,
      level: BilanLevel.critical,
      byDimension: {
        epanouissement: 85,
        maitrise_de_soi: 75,
        relations: 70,
        resilience: 80,
        estime_de_soi: 90,
      },
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    {
      id: "bilan-1759456789012",
      userId: "user3",
      score: 65,
      level: BilanLevel.Good,
      byDimension: {
        epanouissement: 70,
        maitrise_de_soi: 60,
        relations: 65,
        resilience: 65,
        estime_de_soi: 65,
      },
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  ];

  private _hasBilanToday(userId: string): boolean {
    const today = new Date().toISOString().split("T")[0];
    return this.bilans.some(
      (bilan) =>
        bilan.userId === userId &&
        bilan.createdAt.toISOString().split("T")[0] === today,
    );
  }

  private _getLevel(score: number): string {
    if (score <= 25) return BilanLevel.critical;
    if (score <= 50) return BilanLevel.at_risk;
    if (score <= 75) return BilanLevel.Good;
    return BilanLevel.Optimal;
  }

  private _computeScore(answers: BilanAnswer[]): {
    score: number;
    byDimension: Record<string, number>;
  } {
    const dimensions = Array.from(
      new Set(QUESTIONNAIRE.map((q) => q.dimension)),
    );
    const answersMap = answers.reduce(
      (prev, cur) => {
        prev[cur.questionId] = cur.value;
        return prev;
      },
      {} as Record<string, number>,
    );

    const byDimension: Record<string, number> = {};
    dimensions.forEach((dimension: string) => {
      const questions = QUESTIONNAIRE.filter((q) => q.dimension === dimension);
      const totalSur100 = questions.reduce(
        (sum, q) => sum + ((answersMap[q.id] || 0) * 100) / 5,
        0,
      );
      byDimension[dimension] = totalSur100 / questions.length;
    });

    const score =
      Object.values(byDimension).reduce((sum, val) => sum + val, 0) /
      dimensions.length;
    return { score, byDimension };
  }

  public async submitBilan(params: BilanParams): Promise<Bilan> {
    if (this._hasBilanToday(params.userId)) {
      throw new CustomError("ALREADY_SUBMITTED_TODAY");
    }
    const unknownAnswer = params.answers.find(
      (answer) => !QUESTIONNAIRE.some((q) => q.id === answer.questionId),
    );
    if (unknownAnswer) {
      throw new CustomError("UNKNOWN_QUESTION_ID", unknownAnswer.questionId);
    }
    const { score, byDimension } = this._computeScore(params.answers);
    const level = this._getLevel(score);
    const newBilan: Bilan = {
      id: `bilan-${Date.now()}`,
      userId: params.userId,
      score,
      level: level as BilanLevel,
      byDimension: byDimension as BilanDimensions,
      createdAt: new Date(),
    };
    this.bilans.push(newBilan);
    return Promise.resolve(newBilan);
  }

  public getHistory(userId: string): Bilan[] {
    return this.bilans.filter((bilan) => bilan.userId === userId);
  }
}
