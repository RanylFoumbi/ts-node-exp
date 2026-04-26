import { BilanService } from "../modules/bilan/bilan.service.ts";

describe('BilanService', () => {

  it('should compute the correct level for a given score', () => {
    const service = new BilanService();
    expect(service['_getLevel'](10)).toBe('optimal');
    expect(service['_getLevel'](30)).toBe('good');
    expect(service['_getLevel'](60)).toBe('at_risk');
    expect(service['_getLevel'](80)).toBe('critical');
    expect(() => service['_getLevel'](-10)).toThrow("Invalid score");
    expect(() => service['_getLevel'](110)).toThrow("Invalid score");
  });


  it('should return the correct bilan', async () => {
    const service = new BilanService();
    const result = await service.submitBilan( "user123",{
    answers: [
        { questionId: "q1", value: 4 },
        { questionId: "q2", value: 5 },
        { questionId: "q3", value: 3 }
    ]
    });
    expect(result).toEqual(expect.objectContaining({ 
      id: expect.any(String), 
      userId: "user123",
      score: expect.any(Number), 
      level: expect.stringMatching(/optimal|modéré|à risque|critique/) 
    }));
  });
});