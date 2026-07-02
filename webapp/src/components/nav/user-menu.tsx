'use client';

import {User} from "next-auth";
import {Avatar, Dropdown, Label} from "@heroui/react";
import { signOut } from "next-auth/react";

type Props = {
    user: User;
}

export default function UserMenu({user}: Props) {
    return (
        <Dropdown>
            <Dropdown.Trigger>
                <div className={'flex items-center gap-2 cursor-pointer'}>
                    <Avatar size="sm" color={'accent'} variant={'soft'}>
                        <Avatar.Fallback>
                            {user.name?.charAt(0)}
                        </Avatar.Fallback>
                    </Avatar>
                    {user.name}
                </div>
            </Dropdown.Trigger>
            <Dropdown.Popover>
                <Dropdown.Menu>
                    
                    <Dropdown.Item id="edit" textValue="Edit Profile">
                        <Label>
                            Edit Profile
                        </Label>
                        <Dropdown.ItemIndicator />
                    </Dropdown.Item>
                    
                    <Dropdown.Item 
                        id="logout" 
                        textValue="Sign out" 
                        onClick={() => signOut({redirectTo: '/'})}>
                        <Label className={'text-danger'} color={'danger'}>
                            Sign out
                        </Label>
                        <Dropdown.ItemIndicator />
                    </Dropdown.Item>
                    
                </Dropdown.Menu>
            </Dropdown.Popover>
        </Dropdown>
    );
}
