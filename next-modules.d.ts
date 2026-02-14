declare module 'next/navigation' {
  export function useRouter(): {
    push(href: string): void;
    replace(href: string): void;
    back(): void;
    prefetch(href: string): void;
  };
  export function useParams(): Record<string, string | string[]>;
  export function usePathname(): string;
  export function useSearchParams(): { get(name: string): string | null };
}

declare module 'next/link' {
  import type { ComponentType } from 'react';
  const Link: ComponentType<{ href: string; children?: React.ReactNode; [key: string]: unknown }>;
  export default Link;
}
