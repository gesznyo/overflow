'use client';

import { RouterProvider } from 'react-aria-components';
import { useRouter } from 'next/navigation';
import {ThemeProvider as NextThemesProvider} from "next-themes";
import { Toast } from '@heroui/react';
import {useTagStore} from "@/lib/use-tag-store";
import {useEffect} from "react";
import {getTags} from "@/lib/actions/tag-actions";

export function NextHeroRouter({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const setTags = useTagStore((state) => state.setTags);

    useEffect(()=>{
        const loadTags = async ()=>{
            const {data: tags} = await getTags();
            if (tags) setTags(tags);
        }
        
        void loadTags();
    },[setTags])
    
    return (
        <RouterProvider navigate={(path, options) => router.push(path as never, options)}>
            <Toast.Provider placement={'bottom end'} />
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