import ErrorButtons from "@/app/session/error-buttons";
import AuthTestButton from "@/app/session/auth-test-button";
import {auth} from "@/auth";
import {Snippet} from "@/components/snippet";


export default async function Page() {
    const session = await auth();
    
    return (
            <div className={'px-6'}>
                <div className={'text-center'}>
                    <h3 className={'text-3xl'}>Session dashboard</h3>
                    <Snippet 
                        symbol="" 
                        variant="bordered" 
                        className={'w-full mt-4 text-wrap whitespace-pre-wrap break-all text-left font-semibold'}
                        color={"accent"}
                    >
                        {JSON.stringify(session, null, 2)}
                    </Snippet>
                </div>
                <div className={'flex items-center gap-3 justify-center mt-6'}>
                    <ErrorButtons />
                    <AuthTestButton />
                </div>
            </div>
        

    );
}
