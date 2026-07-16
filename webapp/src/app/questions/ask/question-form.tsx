'use client';

import {useTagStore} from "@/lib/hooks/use-tag-store";
import { Form } from "@heroui/react/form";
import {Button, FieldError, Input, Label, ListBox, Select, Spinner, TextField} from "@heroui/react";
import {questionSchema, QuestionSchema} from "@/lib/schemas/question-schema";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import clsx from "clsx";
import {useRouter} from "next/navigation";
import {postQuestion, updateQuestion} from "@/lib/actions/question-actions";
import {handleError} from "@/lib/util";
import {Question} from "@/lib/types";
import {useEffect, useTransition} from "react";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(()=> 
    import('@/components/rte/rich-text-editor'), {ssr: false});

type Props = {
    questionToUpdate?: Question
}

export default function QuestionForm({questionToUpdate}: Props) {
    const [pending, startTransition] = useTransition();
    
    const tags = useTagStore(state => state.tags);
    
    // Initialize React Hook Form
    const {register, handleSubmit, control, reset, formState: {isSubmitting, isValid, errors}} =
        useForm({
            resolver: zodResolver(questionSchema),
            mode: 'onTouched'
        });
    
    const router = useRouter();

    useEffect(() => {
        if (questionToUpdate) reset({
            ...questionToUpdate,
            tags: questionToUpdate.tagSlugs
        })
    }, [questionToUpdate, reset])

    const onSubmit = (data: QuestionSchema) => {
        startTransition(async () => {
            if(questionToUpdate){
                const {error} = await updateQuestion(data, questionToUpdate.id);
                if(error) handleError(error);
                router.push(`/questions/${questionToUpdate.id}`);
            } else {
                const {data: question, error} = await postQuestion(data);
                if (error) handleError(error);
                if (question) router.push(`/questions/${question.id}`);
            }
        });
    }

    return (
        <Form onSubmit={handleSubmit(onSubmit)}
              className={'flex flex-col gap-3 p-6 shadow-xl bg-white dark:bg-black'}
              validationBehavior="aria"
        >

            {/* Title Section */}
            <div className={'flex flex-col gap-3 w-full'}>
                <h3 className={'text-2xl font-semibold'}>Title</h3>
                <TextField isInvalid={!!errors.title} className="w-full">
                    <Label className={'text-sm text-gray-500 dark:text-gray-400'}>
                        Be specific and imagine you are asking a question to another person
                    </Label>
                    <Input placeholder="e.g how would you truncate text in tailwind" 
                           {...register("title")} 
                           className={'bg-default'}
                    />
                    {errors.title && <FieldError>{errors.title.message}</FieldError>}
                </TextField>
            </div>

            {/* Content Body Section */}
            <div className={'flex flex-col gap-3 w-full'}>
                <h3 className={'text-2xl font-semibold'}>Body</h3>
                <Controller
                    control={control}
                    name={"content"}
                    render={({ field: { value, onChange, onBlur }, fieldState }) => (
                        <>
                            <p className={clsx('text-sm', {
                                'text-danger': fieldState.error?.message,
                                'text-gray-500 dark:text-gray-400': !fieldState.error?.message
                            })}>
                                Include all the information someone would need to answer your question
                            </p>
                            <RichTextEditor
                                onChange={onChange}
                                onBlur={onBlur}
                                value={value || ''}
                                errorMessage={fieldState.error?.message}
                            />
                            {fieldState.error?.message && (
                                <span className={'text-xs text-danger -mt-2'}>
                                    {fieldState.error?.message}
                                </span>
                            )}
                        </>
                    )}
                />
            </div>

            {/* Tags Multiple Selection Section */}
            <div className={'flex flex-col gap-3 w-full'}>
                <h3 className={'text-2xl font-semibold'}>Tags</h3>
                <p className={'text-sm text-gray-500 dark:text-gray-400'}>
                    Add up to 5 tags to describe what your question is about
                </p>
                <Controller
                    control={control}
                    name="tags"
                    render={({ field, fieldState }) => (
                        <Select
                            className="w-full"
                            placeholder="Select countries"
                            selectionMode="multiple"
                            // HeroUI v3 passes and receives the Array directly
                            value={field.value ?? []}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            isInvalid={!!fieldState.error}
                        >
                            <Label>Select 1-5 tags</Label>
                            <Select.Trigger className={'bg-default'}>
                                <Select.Value />
                                <Select.Indicator />
                            </Select.Trigger>
                            <Select.Popover>
                                <ListBox>
                                    {tags.map((tag)=> (
                                        <ListBox.Item key={tag.id} id={tag.id} textValue={tag.name}>
                                            {tag.name}
                                            <ListBox.ItemIndicator />
                                        </ListBox.Item>
                                    ))}
                                </ListBox>
                            </Select.Popover>
                            {fieldState.error && (
                                <FieldError>{fieldState.error.message}</FieldError>
                            )}
                        </Select>
                    )}
                />
            </div>

            <Button type={'submit'} className={'w-fit'} isPending={isSubmitting || pending} isDisabled={!isValid || pending}>
                {({isPending}) => (
                    <>
                        {isPending ? <Spinner color="current" className="animate-spin" size="sm" /> : null}
                        {questionToUpdate ? 'Edit your question' : 'Post your question'}
                    </>
                )}
            </Button>
            
        </Form>
    );
}
