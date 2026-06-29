"use client";

import {HomeIcon, TagIcon, UserIcon, QuestionMarkCircleIcon} from "@heroicons/react/24/solid";
import {Label, ListBox} from "@heroui/react";
import {usePathname} from "next/navigation";

export default function SideMenu() {
    
    const pathName = usePathname();
    const navLinks = [
        {name: 'home', icon: HomeIcon, text: 'Home', href: '/'},
        {name: 'questions', icon: QuestionMarkCircleIcon, text: 'Questions', href: '/questions'},
        {name: 'tags', icon: TagIcon, text: 'Tags', href: '/tags'},
        {name: 'session', icon: UserIcon, text: 'User Session', href: '/session'}
    ]
    
    return (
        <ListBox aria-label='nav links' items={navLinks} className={'sticky top-20 ml-6'}>
            {({name, href, icon: Icon, text})=>
                (
                    <ListBox.Item 
                        aria-labelledby={name}
                        aria-describedby={text}
                        key={name}
                        href={href}
                        textValue={text}
                        className={pathName === href ? 'bg-background-secondary text-accent' : ''}>
                        <Icon className={'h-6'} />
                            <Label className={pathName === href ? 'text-lg text-accent' : ''}>
                                {text}
                            </Label>
                        <ListBox.ItemIndicator />
                    </ListBox.Item>
                )}
        </ListBox>
    );
}
