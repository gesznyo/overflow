"use client";

import {ListBox, SearchField} from "@heroui/react";
import {useEffect, useRef, useState} from "react";
import {Question} from "@/lib/types";
import {searchQuestions} from "@/lib/actions/question-actions";

export default function SearchInput() {
    const [query, setQuery] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [results, setResults] = useState<Question[] | null>(null);
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        
        if (!query) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setResults(null);
            setShowDropdown(false);
            return;
        }

        timeoutRef.current = setTimeout(async () => {
            setLoading(true);
            const {data: questions} = await searchQuestions(query);
            setResults(questions);
            setLoading(false);
            setShowDropdown(true);
        }, 300);
    
        }, [query]);
    
    const onAction = () => {
        setQuery('');
        setResults(null);
    }
    
    return (
        <div className={'flex flex-col w-full me-10'}>
            <SearchField name="search" className={'ml-6 min-w-2/5'} aria-label={'Search'}>
                <SearchField.Group>
                    <SearchField.SearchIcon />
                    <SearchField.Input
                        className="w-70"
                        placeholder="Search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    {/*<SearchField.ClearButton className="text-red-500" />*/}
                </SearchField.Group>
            </SearchField>
            {showDropdown && results && (
                <div 
                    className={'absolute top-full z-50 bg-white ' +
                    'dark:bg-default shadow-lg border-2 border-default-500 w-[50%]'}>
                    <ListBox 
                        className={'flex flex-col overflow-y-auto'}
                        onAction={onAction}
                        items={results}
                    >
                        {question => 
                            <ListBox.Item 
                                href={`/questions/${question.id}`}
                                key={question.id}
                            >
                                <div className={'flex flex-col h-14 min-w-14 ' +
                                    'justify-center items-center border border-success rounded-md'}
                                >
                                    <span>{question.answerCount}</span>
                                    <span className={'text-xs'}>{question.answerCount > 1 ? 'answers' : 'answer'}</span>
                                </div>
                                <div>
                                    <div className={'font-semibold'}>{question.title}</div>
                                    <div className={'text-xs opacity-60 line-clamp-2'}>{question.content}</div>
                                </div>
                                <ListBox.ItemIndicator />
                            </ListBox.Item>}
                    </ListBox>
                </div>
            )}
        </div>
    );
}
