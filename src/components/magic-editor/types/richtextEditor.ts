export interface RichTextEditorOptions {
  /** 编辑器DOM元素ID */
  editorId?: string;
  /** 历史记录最大数量，默认30 */
  maxHistorySize?: number;
  /** 自动保存间隔（毫秒），默认1000ms */
  autoSaveInterval?: number;
  /** 支持的命令列表，用于自动检测是否需要启用历史记录 */
  supportedCommands?: string[];
}
