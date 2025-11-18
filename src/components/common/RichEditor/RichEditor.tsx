import {
  ContentState,
  convertFromRaw,
  convertToRaw,
  Editor,
  EditorState,
  RichUtils,
  type EditorCommand,
} from 'draft-js';
import 'draft-js/dist/Draft.css';
import { useEffect, useState } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';

import './RichEditor.scss';

type Props = {
  value?: string;
  readOnly?: boolean;
  onChange: (e: { target: { value: string } }) => void;
};

export default function RichEditor({ value, readOnly, onChange }: Props) {
  const createEditorStateFromValue = (value: string | undefined) => {
    try {
      if (value) {
        return EditorState.createWithContent(convertFromRaw(JSON.parse(value)));
      } else {
        return EditorState.createEmpty();
      }
    } catch (parseError) {
      console.error('Unable to parse rich text content', parseError);
      return EditorState.createWithContent(
        ContentState.createFromText(value || '')
      );
    }
  };

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  useEffect(() => {
    setEditorState(createEditorStateFromValue(value));
  }, [value]);

  const handleKeyCommand = (
    command: EditorCommand,
    editorState: EditorState
  ) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      setEditorState(newState);
      return 'handled';
    }

    return 'not-handled';
  };

  const _onEditorCommandClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    command: string
  ) => {
    e.preventDefault();
    setEditorState(RichUtils.toggleInlineStyle(editorState, command));
  };

  return (
    <div className="rich-text-editor">
      {!readOnly && (
        <div className="buttons">
          <ButtonGroup>
            <Button
              variant="secondary"
              onClick={(e) => _onEditorCommandClick(e, 'BOLD')}
            >
              B
            </Button>
            <Button
              variant="secondary"
              onClick={(e) => _onEditorCommandClick(e, 'ITALIC')}
            >
              I
            </Button>
            <Button
              variant="secondary"
              onClick={(e) => _onEditorCommandClick(e, 'UNDERLINE')}
            >
              U
            </Button>
          </ButtonGroup>
        </div>
      )}
      <Editor
        editorState={editorState}
        readOnly={readOnly}
        onChange={(e) => {
          setEditorState(e);
          onChange({
            target: {
              value: JSON.stringify(convertToRaw(e.getCurrentContent())),
            },
          });
        }}
        handleKeyCommand={handleKeyCommand}
      />
    </div>
  );
}
