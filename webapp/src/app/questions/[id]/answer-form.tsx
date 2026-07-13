'use client';

import {useTransition} from "react";
import {Controller, useForm} from "react-hook-form";
import {answerSchema, AnswerSchema} from "@/lib/schemas/answer-schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {postAnswer} from "@/lib/actions/question-actions";
import {Answer} from "@/lib/types";
import {handleError} from "@/lib/util";
import RichTextEditor from "@/components/rte/rich-text-editor";
import {Button} from "@heroui/react";

type Props = {
    answer? : Answer;
    questionId: string;
}

export default function AnswerForm({answer, questionId}: Props) {
    const [pending, startTransition] = useTransition();
    const {control, handleSubmit, reset, formState} = useForm<AnswerSchema>({
        mode: 'onTouched',
        resolver: zodResolver(answerSchema)
    })
    
    const onSubmit = (data: AnswerSchema)=> {
        startTransition(async () => {
            const {error} = await postAnswer(data, questionId);
            if (error) handleError(error);
            reset();
        })
    }
    
    return (
        <div className={'flex flex-col gap-3 items-start my-4 w-full px-6'}>
            <h2 className={'text-2xl'}>Your answer</h2>
            <form className={'w-full flex-col flex gap-3'} onSubmit={handleSubmit(onSubmit)}>
                <Controller 
                    control={control}
                    name='content'
                    render={({field: {onChange, onBlur, value}, fieldState}) => 
                        (<>
                            <RichTextEditor 
                                onChange={onChange} 
                                onBlur={onBlur} 
                                value={value || ''}
                                errorMessage={fieldState.error?.message}
                            />
                            {fieldState.error && (
                                <span className={'text-xs text-danger -mt-1'}>
                                {fieldState.error.message}
                                </span>)}
                        </>)} 
                    />
                <Button 
                    type={'submit'}
                    isDisabled={!formState.isValid || pending}
                    isPending={pending}
                    variant={'primary'}
                >
                    Post your answer
                </Button>
            </form>
        </div>
    );
}
