import {Editor, useEditorState} from "@tiptap/react";
import {BoldIcon, CodeBracketIcon, ItalicIcon, LinkIcon, PhotoIcon, StrikethroughIcon} from "@heroicons/react/20/solid";
import {Button} from "@heroui/react";
import {CldUploadWidget, CloudinaryUploadWidgetResults} from "next-cloudinary";
import {errorToast} from "@/lib/util";

type Props = {
    editor: Editor | null;
}

export default function MenuBar({editor}: Props) {
    const editorState = useEditorState({
        editor,
        selector: ({editor}) => {
            if (!editor) return null;
            
            return {
                isBold: editor.isActive('bold'),
                isItalic: editor.isActive('italic'),
                IsStrike: editor.isActive('strike'),
                isCodeBlock: editor.isActive('codeBlock'),
                isLink: editor.isActive('link'),
            }
        }
    });
    
    if (!editor || !editorState) return null;
    
    const onUploadImage = (result: CloudinaryUploadWidgetResults)=> {
        if(result.info && typeof result.info === 'object') {
            editor?.chain().focus().setImage({src: result.info.secure_url}).run();
        } else{
            errorToast({message: 'Problem adding image'});
        }
    }
    
    const options = [
        {
            icon: <BoldIcon className={'w-5 h-5'} />,
            onClick: () => editor?.chain().focus().toggleBold().run(),
            pressed: editorState.isBold,
        },
        {
            icon: <ItalicIcon className={'w-5 h-5'} />,
            onClick: () => editor?.chain().focus().toggleItalic().run(),
            pressed: editorState.isItalic,
        },
        {
            icon: <StrikethroughIcon className={'w-5 h-5'} />,
            onClick: () => editor?.chain().focus().toggleStrike().run(),
            pressed: editorState.IsStrike,
        },
        {
            icon: <CodeBracketIcon className={'w-5 h-5'} />,
            onClick: () => editor?.chain().focus().toggleCodeBlock().run(),
            pressed: editorState.isCodeBlock,
        },
        {
            icon: <LinkIcon className={'w-5 h-5'} />,
            onClick: () => editor?.chain().focus().toggleLink().run(),
            pressed: editorState.isLink,
        },
    ]
    
    return (
        <div className={'rounded-md space-x-1 pb-1 z-50'}>
            {options.map((option, index) => (
                <Button
                    key={index}
                    type="button"
                    size="sm"
                    isIconOnly
                    variant={option.pressed ? 'secondary' : 'tertiary'}
                    onPress={option.onClick}
                >
                    {option.icon}
                </Button>
            ))}

            <CldUploadWidget
                options={{ maxFiles: 1 }}
                onSuccess={onUploadImage}
                signatureEndpoint="/api/sign-image" 
                uploadPreset="overflow"
            >
                {({ open }) => (
                    <Button
                        isIconOnly
                        size="sm"
                        type="button"
                        onPress={() => open()}
                    >
                        <PhotoIcon className="w-5 h-5" />
                    </Button>
                )}
            </CldUploadWidget>
        </div>
    );
}
