'use client';

import {Button, Tabs} from "@heroui/react";
import Link from "next/link";
import {useTagStore} from "@/lib/hooks/use-tag-store";

type Props = {
    tag?: string;
    total: number;
}

export default function QuestionsHeader({tag, total}: Props) {
    
    const selectedTag = useTagStore((state) => state.getTagBySlug(tag ?? ''));
    
    const tabs = [
        {key: 'newest', label: 'Newest'},
        {key: 'active', label: 'Active'},
        {key: 'unanswered', label: 'Unanswered'},
    ]
    
    return (
        <div className={'flex flex-col w-full border-b gap-4 pb-4'}>
            <div className={'flex justify-between px-6'}>
                <div className={'flex flex-col items-start gap-2'}>
                    <div className={'text-3xl font-semibold'}>
                        {tag? `[${tag}]` : 'Newest Questions'}
                    </div>
                    <p className={'font-light'}>{selectedTag?.description}</p>
                </div>

                <Link href={'/questions/ask'}>
                    <Button variant={'secondary'}>
                        Ask Question
                    </Button>                    
                </Link>
            </div>
            <div className={'flex justify-between px-6 items-center'}>
                <div>{total} {total === 1 ? 'Question': 'Questions'}</div>
                <div className={'flex items-center'}>
                    <Tabs>
                        <Tabs.ListContainer>
                            <Tabs.List aria-label="Options">
                                {tabs.map(item => (
                                    <Tabs.Tab key={item.key} id={item.key}>
                                        {item.label}
                                        <Tabs.Indicator />
                                    </Tabs.Tab>
                                ))}
                            </Tabs.List>
                        </Tabs.ListContainer>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
