import {ListBox, Select} from "@heroui/react";

type Props = {
    answerCount: number;
}

export default function AnswersHeader({answerCount}: Props) {
    return (
        <div className={'flex items-center justify-between pt-3 w-full px-6'}>
            <div className={'text-2xl'}>{answerCount} {answerCount === 1 ? 'answer' : 'answers'}</div>
            <div className={'flex items-center gap-3 justify-end w-[50%] ml-auto'}>
                <Select
                    aria-label={'Sort answers'}
                    defaultValue={'highScore'}
                >
                    <Select.Trigger>
                        <Select.Value />
                        <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                        <ListBox>
                            <ListBox.Item id="highScore" textValue="highScore">
                                Highest score (default)
                                <ListBox.ItemIndicator />
                            </ListBox.Item>
                            <ListBox.Item id="created" textValue="created">
                                Date created
                                <ListBox.ItemIndicator />
                            </ListBox.Item>
                        </ListBox>
                    </Select.Popover>
                </Select>
            </div>
        </div>
    );
}
