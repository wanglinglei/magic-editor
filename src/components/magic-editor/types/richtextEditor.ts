import type { EditorOperator } from './component';

export interface RichTextEditorOptions {
  editorId: string;
  operators?: EditorOperator[][];
}
