import  { BilanLevel, type BilanParams, type Bilan } from "../../shared/types/bilan.ts";

export class BilanService {

    bilans = [
    {
      "id": "bilan-1761234567890",
      "userId": "user123",
      "score": 80,
      'level': "critical",
      "byDimension": { "epanouissement": 85, "maitrise_de_soi": 75, "relations": 70, "resilience": 80, "estime_de_soi": 90 },
      "createdAt": "2026-04-26T14:30:00.000Z"
    },
    {
      "id": "bilan-1759456789012",
      "userId": "user3",
      "score": 65,
      "level": "good",
      "byDimension": { "epanouissement": 70, "maitrise_de_soi": 60, "relations": 65, "resilience": 65, "estime_de_soi": 65 },
      "createdAt": "2026-03-15T10:00:00.000Z"
    }
  ];

   private _hasBilanToday(userId: string, ): boolean {
        const today = new Date().toISOString().split('T')[0];
        return this.bilans.some(bilan => bilan.userId === userId && bilan.createdAt.startsWith(String(today)));
   }

    private _computeScore(){}

    private _getLevel(score: number): string {
        if (score >= 0 && score <= 25) return BilanLevel.Optimal;
        if (score >= 26 && score <= 50) return BilanLevel.Good;
        if (score >= 51 && score <= 75) return BilanLevel.at_risk;
        if (score >= 76 && score <= 100) return BilanLevel.critical;
        throw new Error("Invalid score");
    }

    public submitBilan(params: BilanParams): Promise<Bilan> {
        if (this._hasBilanToday(params.userId)) {
            throw new Error("Bilan already submitted today");
        }
        return new Promise((resolve, reject) => {});

    }

    public getHistory() {}

}