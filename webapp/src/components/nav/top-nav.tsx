import Link from "next/link";
import {AcademicCapIcon} from "@heroicons/react/24/solid";
import ThemeToggle from "@/components/nav/theme-toggle";
import SearchInput from "@/components/nav/search-input";
import LoginButton from "@/components/nav/login-button";
import {getCurrentUser} from "@/lib/actions/auth-actions";
import UserMenu from "@/components/nav/user-menu";
import RegisterButton from "@/components/nav/register-button";

export default async function TopNav() {
    const user = await getCurrentUser();
    
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
                
                <SearchInput />
                
                <div className={'flex shrink-0 justify-end gap-3 ms-auto items-center'}>
                    <ThemeToggle />
                    {user ? (
                        <UserMenu user={user}/>
                    ):(
                        <>
                            <LoginButton />
                            <RegisterButton />  
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
