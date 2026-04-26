import type { Config } from 'jest';

const config: Config = {
	testEnvironment: 'node',
	clearMocks: true,
	collectCoverage: false,
	testTimeout: 10000,
	transform: {
		'^.+\\.ts$': ['ts-jest', { tsconfig: 'tsconfig.jest.json' }],
	},
};

export default config;
