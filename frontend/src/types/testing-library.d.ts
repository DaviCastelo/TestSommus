declare module '@testing-library/react' {
  import { ReactElement } from 'react';
  import { RenderOptions } from '@testing-library/react';

  export function render(
    ui: ReactElement,
    options?: RenderOptions
  ): {
    container: HTMLElement;
    baseElement: HTMLElement;
    debug: (baseElement?: HTMLElement | DocumentFragment) => void;
    rerender: (ui: ReactElement) => void;
    unmount: () => void;
    asFragment: () => DocumentFragment;
  };

  export const screen: {
    getByText: (text: string | RegExp) => HTMLElement;
    getByRole: (role: string, options?: { name?: string | RegExp }) => HTMLElement;
    getAllByRole: (role: string, options?: { name?: string | RegExp }) => HTMLElement[];
    queryByText: (text: string | RegExp) => HTMLElement | null;
    queryByRole: (role: string, options?: { name?: string | RegExp }) => HTMLElement | null;
  };

  export const fireEvent: {
    click: (element: HTMLElement) => void;
    change: (element: HTMLElement, event?: { target: { value: string } }) => void;
  };

  export function waitFor(
    callback: () => void | Promise<void>,
    options?: { timeout?: number }
  ): Promise<void>;
} 