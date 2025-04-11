/// <reference types="@jest/globals" />

declare global {
  const jest: typeof import('@jest/globals').jest;
  const expect: typeof import('@jest/globals').expect;
  const describe: typeof import('@jest/globals').describe;
  const it: typeof import('@jest/globals').it;
  const beforeEach: typeof import('@jest/globals').beforeEach;
  const afterEach: typeof import('@jest/globals').afterEach;
  const beforeAll: typeof import('@jest/globals').beforeAll;
  const afterAll: typeof import('@jest/globals').afterAll;

  namespace jest {
    type Mock<T = any, Y extends any[] = any> = {
      (...args: Y): T;
      mockReset(): Mock<T, Y>;
      mockImplementation(fn: (...args: Y) => T): Mock<T, Y>;
      mockResolvedValue(value: T): Mock<T, Y>;
      mockRejectedValue(value: any): Mock<T, Y>;
      mockReturnValue(value: T): Mock<T, Y>;
      mockReturnThis(): Mock<T, Y>;
      getMockName(): string;
      mock: {
        calls: Y[];
        instances: T[];
        contexts: any[];
        results: Array<{ type: 'return' | 'throw'; value: any }>;
      };
    };

    const fn: <T = any, Y extends any[] = any>(implementation?: (...args: Y) => T) => Mock<T, Y>;
    const mock: (moduleName: string, factory?: any, options?: any) => typeof jest;
    const spyOn: <T extends {}, M extends keyof T>(object: T, method: M) => Mock;
    const resetModules: () => typeof jest;
    const isolateModules: (fn: () => void) => typeof jest;
  }
}

declare module 'jest' {
  export type Mock<T = any, Y extends any[] = any> = {
    (...args: Y): T;
    mockReset(): Mock<T, Y>;
    mockImplementation(fn: (...args: Y) => T): Mock<T, Y>;
    mockResolvedValue(value: T): Mock<T, Y>;
    mockRejectedValue(value: any): Mock<T, Y>;
    mockReturnValue(value: T): Mock<T, Y>;
    mockReturnThis(): Mock<T, Y>;
    getMockName(): string;
    mock: {
      calls: Y[];
      instances: T[];
      contexts: any[];
      results: Array<{ type: 'return' | 'throw'; value: any }>;
    };
  };
}

export {}; 