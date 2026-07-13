'use client';

import {useTransition} from "react";
import {Controller, useForm} from "react-hook-form";
import {answerSchema, AnswerSchema} from "@/lib/schemas/answer-schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {editAnswer, postAnswer} from "@/lib/actions/question-actions";
import {handleError} from "@/lib/util";
import RichTextEditor from "@/components/rte/rich-text-editor";
import {Button} from "@heroui/react";
import {useAnswerStore} from "@/lib/hooks/use-answer-store";

type Props = {
    questionId: string;
}

export default function AnswerForm({questionId}: Props) {
    const [pending, startTransition] = useTransition();
    const editableAnswer = useAnswerStore(state => state.answer);
    const clearAnswer = useAnswerStore(state => state.clearAnswer);
    const {control, handleSubmit, reset, formState} = useForm<AnswerSchema>({
        mode: 'onTouched',
        resolver: zodResolver(answerSchema),
        values:{
            content: editableAnswer?.content
        }
    })

    const onSubmit = (data: AnswerSchema) => {
        startTransition(async () => {
            if (editableAnswer) {
                const {error} = await editAnswer(editableAnswer.id,
                    editableAnswer.questionId, data);
                if (error) handleError(error);
                clearAnswer();
                reset();
            } else {
                const {error} = await postAnswer(data, questionId);
                if (error) handleError(error);
                reset();
            }
        })
    }
    
    return (
        <div className={'flex flex-col gap-3 items-start my-4 w-full px-6'} id='answer-form'>
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
                <div className='flex items-start gap-3 mb-6'>
                    <Button
                        type={'submit'}
                        isDisabled={!formState.isValid || pending}
                        isPending={pending}
                        variant={'primary'}
                    >
                        {editableAnswer ? 'Update' : 'Post'} your answer
                    </Button>
                    <Button
                        isDisabled={!editableAnswer}
                        onPress={() => {
                            clearAnswer();
                            reset();
                        }}
                        className='w-fit'
                        type='button'
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
}
