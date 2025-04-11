import '@testing-library/jest-dom';
import 'jest-fetch-mock';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => 'mock-url');

// Mock document.createElement
const originalCreateElement = document.createElement;
document.createElement = function(tagName: string) {
  const element = originalCreateElement.call(document, tagName);
  if (tagName === 'a') {
    element.click = jest.fn();
  }
  return element;
}; 