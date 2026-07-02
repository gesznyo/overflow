'use client';

import {testAuth} from "@/lib/actions/auth-actions";
import {handleError, successToast} from "@/lib/util";
import {Button} from "@heroui/react";

export default function AuthTestButton() {
    const onClick = async () =>{
        const {data, error} = await testAuth();
        if(error) handleError(error);
        if (data) successToast(data, 'Authentication Successful');
    }
    
    return (
        <Button 
            onPress={onClick}
            variant={'primary'}
        >
            Test Auth
        </Button>
    );
}
