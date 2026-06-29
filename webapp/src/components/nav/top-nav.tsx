import Link from "next/link";
import {AcademicCapIcon} from "@heroicons/react/24/solid";
import {Button, SearchField} from "@heroui/react";
import ThemeToggle from "@/components/nav/theme-toggle";

export default function TopNav() {
    return (
        <header className={'p-2 w-full fixed top-0 z-50 border-b bg-white dark:bg-neutral-900'}>
            <div className={'flex px-10 mx-auto'}>
                <div className={'flex items-center gap-6'}>
                    <Link href={'/'} 
                          className={'flex items-center gap-3 max-h-16'}>
                        <AcademicCapIcon className={'size-10 text-secondary'} color={'#00a973'} />
                        <h3 className={'text-xl font-semibold uppercase'}>Overflow</h3>
                    </Link>
                    <nav className={'flex gap-3 my-2 text-md text-neutral-500'}>
                        <Link href={'/'}>About</Link>
                        <Link href={'/'}>Products</Link>
                        <Link href={'/'}>Contact</Link>
                    </nav>
                </div>
                
                <SearchField name="search" className={'ml-6 min-w-2/5'}>
                    <SearchField.Group>
                        <SearchField.SearchIcon />
                        <SearchField.Input className="w-70" placeholder="Search" />
                        <SearchField.ClearButton className="text-red-500" />
                    </SearchField.Group>
                </SearchField>
                
                <div className={'flex shrink-0 justify-end gap-3 ms-auto'}>
                    <ThemeToggle />
                    <Button variant={'outline'}>Login</Button>
                    <Button variant={'secondary'}>Register</Button>
                </div>
            </div>
        </header>
    );
}
