'use client';

import { RouterProvider } from 'react-aria-components';
import { useRouter } from 'next/navigation';
import {ThemeProvider as NextThemesProvider} from "next-themes";

export function NextHeroRouter({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    return (
        <RouterProvider navigate={(path, options) => router.push(path as never, options)}>
            <NextThemesProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                {children}
            </NextThemesProvider>
        </RouterProvider>
    );
}