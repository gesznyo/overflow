'use client'

import {SearchField, Tabs} from "@heroui/react";

export default function TagHeader() {
    const tabs = [
        {key: 'popular', label: 'Popular'},
        {key: 'name', label: 'Name'}
    ]

    return (
        <div className='flex flex-col w-full gap-4 pb-4'>
            <div className='flex flex-col items-start gap-3'>
                <div className='text-3xl font-semibold'>Tags</div>
                <p>A tag is a keyword or label that categorizes your question with other,
                    similar questions. Using the right tags makes it easier for others to find
                    and answer your question.</p>
            </div>
            <div className='flex items-center justify-between'>
                <SearchField name="search" isRequired aria-label={'Search for tags'}>
                    <SearchField.Group>
                        <SearchField.SearchIcon />
                        <SearchField.Input className="w-fit" placeholder="Search" />
                        <SearchField.ClearButton />
                    </SearchField.Group>
                </SearchField>

                <Tabs>
                    <Tabs.ListContainer>
                        <Tabs.List aria-label="Options">
                            {tabs.map((item) => (
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
    )
}