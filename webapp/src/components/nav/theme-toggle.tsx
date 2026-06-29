"use client";

import {Button} from "@heroui/react";
import {useTheme} from "next-themes";
import {useEffect, useState} from "react";
import {MoonIcon, SunIcon} from "@heroicons/react/24/solid";

export default function ThemeToggle() {

    const [mounted, setMounted] = useState(false);
    const {setTheme, theme} = useTheme();

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);
    
    if (!mounted) return null;
    
    return (
        <Button
            variant='outline'
            isIconOnly
            aria-label='Toggle Theme'
            onPress={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
            {theme === 'light' ? (
                <MoonIcon className='h-8' />
            ) : (
                <SunIcon className='h-8 text-yellow-300' />
            )}
        </Button>
    );
}
