'use client' 

import { useEffect } from 'react'
import {Button} from "@heroui/react";

export default function ErrorPage({
                                      error,
                                      unstable_retry,
                                  }: {
    error: Error & { digest?: string }
    unstable_retry: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div className={'flex h-full items-center justify-center space-y-6'}>
            <div className={'flex flex-col items-center gap-6'}>
                <h2 className={'text-5xl font-bold'}>Something went wrong!</h2>
                <h3 className={'text-3xl text-danger'}>{error.message}</h3>
                <Button variant={'danger-soft'} onPress={() => unstable_retry()}>
                    Try again
                </Button>
            </div>
        </div>
    )
}