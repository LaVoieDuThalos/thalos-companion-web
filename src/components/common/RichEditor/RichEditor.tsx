import { useCallback, useState } from 'react';
import { createEditor, Editor, type BaseEditor, type Descendant } from 'slate';
import {
  Editable,
  ReactEditor,
  Slate,
  withReact,
  type RenderLeafProps,
} from 'slate-react';
import IconButton from '../IconButton/IconButton';
import './RichEditor.scss';

type CustomElement = { type: 'paragraph'; children: CustomText[] };
type CustomText = { text: string };

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

type Props = {
  value?: string;
  disabled?: boolean;
  onChange?: (e: string) => void;
};

export default function RichEditor({
  value,
  disabled,
  onChange = () => {},
}: Props) {
  const [editor] = useState(() => withReact(createEditor()));

  const initialValue =
    (value && JSON.parse(value)) ||
    ([
      {
        type: 'paragraph',
        children: [{ text: '' }],
      },
    ] as Descendant[]);

  const renderLeaf = useCallback(
    ({ attributes, children, leaf }: RenderLeafProps) => {
      return (
        <span
          {...attributes}
          style={{
            fontWeight: leaf.bold ? 'bold' : 'normal',
            fontStyle: leaf.italic ? 'italic' : 'normal',
          }}
        >
          {children}
        </span>
      );
    },
    []
  );

  // Render the Slate context.
  return (
    <Slate
      editor={editor}
      onChange={(value) => onChange(JSON.stringify(value))}
      initialValue={initialValue}
    >
      <div>
        <IconButton
          icon="format_bold"
          variant="secondary"
          onClick={() => Editor.addMark(editor, 'bold', true)}
        />
        <IconButton
          icon="format_italic"
          variant="secondary"
          onClick={() => console.log('bold')}
        />
        <IconButton
          icon="format_underlined"
          variant="secondary"
          onClick={() => console.log('bold')}
        />
      </div>
      <Editable
        renderLeaf={renderLeaf}
        className="rich-editor"
        disabled={disabled}
      />
    </Slate>
  );
}
