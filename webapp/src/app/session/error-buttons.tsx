'use client';

import {Button} from "@heroui/react";
import {triggerError} from "@/lib/actions/error-actions";
import {useState, useTransition} from "react";
import {handleError} from "@/lib/util";

export default function ErrorButtons() {
    
    const [pending, startTransition] = useTransition();
    const [target, setTarget] = useState(0);
    
    const onClick = (code: number)=> {
        setTarget(code);
        startTransition(async () => {
            const {error} = await triggerError(code);
            if (error) handleError(error);
            setTarget(0)
        })
    }
    
    return (
        <div className={'flex gap-3'}>
            {[400,401,403,404,500].map((code) => (
                <Button 
                    key={code} 
                    onPress={ () => onClick(code)}
                    variant={'danger-soft'}
                    type={'button'}
                    isPending={pending && target === code}
                >
                    Test {code}
                </Button>
            ))}
        </div>
    );
}
