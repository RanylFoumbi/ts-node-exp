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


  it("should throw an error when a questionId is unknown", async () => {
    const service = new BilanService();
    await expect(service.submitBilan({
      userId: "user123",
      answers: [
        { questionId: "q1", value: 4 },
        { questionId: "unknown", value: 5 },
      ],
    })).rejects.toThrow("Unknown questionId");
  });

  it("should return the correct bilan", async () => {
    const service = new BilanService();
    const result = await service.submitBilan({
      userId: "user123",
      answers: [
        { questionId: "q1", value: 4 },
        { questionId: "q2", value: 5 },
        { questionId: "q3", value: 3 },
      ],
    });
    expect(result).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        userId: "user123",
        score: expect.any(Number),
        level: expect.stringMatching(/optimal|good|at_risk|critical/),
        byDimension: expect.objectContaining({
          epanouissement: expect.any(Number),
          maitrise_de_soi: expect.any(Number),
          relations: expect.any(Number),
          resilience: expect.any(Number),
          estime_de_soi: expect.any(Number),
        }),
        createdAt: expect.any(Date),
      }),
    );
  });

  it("should not allow multiple bilans in the same day", async () => {
    const service = new BilanService();
    await service.submitBilan({
      userId: "user123",
      answers: [
        { questionId: "q1", value: 4 },
        { questionId: "q2", value: 5 },
        { questionId: "q3", value: 3 },
      ],
    });
    await expect(service.submitBilan({
      userId: "user123",
      answers: [
        { questionId: "q1", value: 4 },
        { questionId: "q2", value: 5 },
        { questionId: "q3", value: 3 },
      ],
    })).rejects.toThrow("Bilan already submitted today");
  });

  it("should return an empty array for a user with no bilans", () => {
    const service = new BilanService();
    const history = service.getHistory("newUser");
    expect(history).toEqual([]);
  });

  it("should return an array of bilans for a user with bilans", async () => {

    const service = new BilanService();
    await service.submitBilan({
      userId: "user123",
      answers: [
        { questionId: "q1", value: 4 },
        { questionId: "q2", value: 5 },
        { questionId: "q3", value: 3 },
      ],
    });
    const history = service.getHistory("user123");
    expect(history).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          userId: "user123",
          score: expect.any(Number),
          level: expect.stringMatching(/optimal|good|at_risk|critical/),
          byDimension: expect.objectContaining({
            epanouissement: expect.any(Number),
            maitrise_de_soi: expect.any(Number),
            relations: expect.any(Number),
            resilience: expect.any(Number),
            estime_de_soi: expect.any(Number),
          }),
          createdAt: expect.any(Date),
        }),
      ]),
    );
  });

  it("should return only bilans of the user", async () => {
    const service = new BilanService();
    await service.submitBilan({
      userId: "user123",
      answers: [
        { questionId: "q1", value: 4 },
        { questionId: "q2", value: 5 },
        { questionId: "q3", value: 3 },
      ],
    });
    await service.submitBilan({
      userId: "user456",
      answers: [
        { questionId: "q1", value: 2 },
        { questionId: "q2", value: 3 },
        { questionId: "q3", value: 4 },
      ],
    });
    const history = service.getHistory("user123");
    expect(history).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          userId: "user123",
        }),
      ]),
    );
    expect(history).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          userId: "user456",
        }),
      ]),
    );
  });
});