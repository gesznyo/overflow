import {EditorContent, useEditor} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "@/components/rte/menu-bar";
import {useEffect, useRef} from "react";
import clsx from "clsx";
import Image from '@tiptap/extension-image'
import {extractPublicIdsFromHtml} from "@/lib/util";

type Props = {
    value: string;
    onChange: (body: string) => void;
    onBlur: () => void;
    errorMessage?: string;
}

export default function RichTextEditor({value, onChange, onBlur, errorMessage}: Props) {
    const prevPublicIds = useRef<string[]>([]);
    
    const editor = useEditor({
        extensions: [StarterKit, Image],
        content: '',
        editorProps: {
            attributes: {
                class: clsx('w-full p-3 bg-default rounded-cl min-h-60 ' +
                    'prose dark:prose-invert max-w-none', {
                    'border border-red-500': !!errorMessage
                })
            }
        },
        onBlur(){
            onBlur();
        },
        onUpdate({editor}){
            const html = editor.getHTML();
            onChange(html);
            
            const currentPublicIds = extractPublicIdsFromHtml(html);
            const prev = prevPublicIds.current;
            
            const deleted = prev.filter(id => !currentPublicIds.includes(id));
            if (deleted.length > 0){
                deleted.forEach(publicId => {
                    fetch('/api/delete-image',{
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({publicId})
                    }).then(()=> console.log('deleted ' + publicId))
                })
            }
            prevPublicIds.current = currentPublicIds;
        },
        immediatelyRender: false
    });
    
    useEffect(()=>{
        if(editor && value !== editor.getHTML()){
            editor.commands.setContent(value);
        }
    }, [editor, value])
    
    return (
        <div>
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
        
    );
}
