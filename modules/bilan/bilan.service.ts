import  { BilanLevel, type BilanParams, type Bilan } from "../../shared/types/bilan.ts";

export class BilanService {

   private _hasBilanToday(){}

    private _computeScore(){}

    private _getLevel(score: number): string {
        if (score >= 0 && score <= 25) return BilanLevel.Optimal;
        if (score >= 26 && score <= 50) return BilanLevel.Good;
        if (score >= 51 && score <= 75) return BilanLevel.at_risk;
        if (score >= 76 && score <= 100) return BilanLevel.critical;
        throw new Error("Invalid score");
    }

    public submitBilan(userId: string, params: BilanParams): Promise<Bilan> {
        return new Promise((resolve, reject) => {});

    }

    public getHistory() {}

}