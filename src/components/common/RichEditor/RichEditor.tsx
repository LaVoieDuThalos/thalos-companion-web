import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
  AutoLink,
  Bold,
  DecoupledEditor,
  Emoji,
  Essentials,
  Heading,
  HorizontalLine,
  Indent,
  IndentBlock,
  Italic,
  Link,
  List,
  Mention,
  Paragraph,
  Strikethrough,
  Underline,
  type EditorConfig,
} from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import './RichEditor.scss';

type Props = {
  value?: string;
  readOnly?: boolean;
  onChange: (e: { target: { value: string } }) => void;
};

export default function RichEditor({ value, readOnly, onChange }: Props) {
  const editorContainerRef = useRef<HTMLDivElement | null>(null);
  const editorToolbarRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef(null);
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  useEffect(() => {
    setIsLayoutReady(true);
    return () => setIsLayoutReady(false);
  }, []);

  const { editorConfig } = useMemo(() => {
    if (!isLayoutReady) {
      return {};
    }

    return {
      editorConfig: {
        toolbar: {
          items: [
            'undo',
            'redo',
            '|',
            'heading',
            '|',
            'bold',
            'italic',
            'underline',
            'strikethrough',
            /*'|',
            'link', NOT WORKING !*/
            '|',
            'emoji',
            'horizontalLine',
            'bulletedList',
            'numberedList',
            '|',
            'outdent',
            'indent',
            'indentblock',
          ],
          shouldNotGroupWhenFull: false,
        },
        plugins: [
          Heading,
          Bold,
          Essentials,
          Italic,
          Underline,
          Strikethrough,
          Paragraph,
          Indent,
          IndentBlock,
          Link,
          Mention,
          Emoji,
          AutoLink,
          HorizontalLine,
          List,
        ],
        initialData: value || '',
        licenseKey: 'GPL',
        link: {
          addTargetToExternalLinks: true,
          toolbar: ['linkPreview', '|', 'editLink', 'linkProperties', 'unlink'],
        },
        placeholder: 'Ajoutez un peu de détails ici',
      } as EditorConfig,
    };
  }, [isLayoutReady]);

  return (
    <div className="main-container">
      <div
        className="editor-container editor-container_document-editor"
        ref={editorContainerRef}
      >
        <div className="editor-container__toolbar" ref={editorToolbarRef}></div>
        <div className="editor-container__editor-wrapper">
          <div className="editor-container__editor">
            <div ref={editorRef}>
              {editorConfig && (
                <CKEditor
                  disabled={readOnly}
                  onReady={(editor) => {
                    if (editorToolbarRef.current && !readOnly) {
                      editorToolbarRef.current.appendChild(
                        editor.ui.view.toolbar?.element as HTMLElement
                      );
                    }
                  }}
                  onAfterDestroy={() => {
                    if (editorToolbarRef.current !== null && !readOnly) {
                      Array.from(editorToolbarRef.current.children).forEach(
                        (child) => child.remove()
                      );
                    }
                  }}
                  editor={DecoupledEditor}
                  config={editorConfig}
                  data={value}
                  onChange={(_, editor) => {
                    onChange({ target: { value: editor.getData() } });
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
