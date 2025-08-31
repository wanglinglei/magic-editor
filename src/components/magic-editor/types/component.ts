/**
 * 编辑器操作类型
 * undo: 撤销
 * reset: 重置
 * blod: 加粗
 * italic: 斜体
 * underline: 下划线
 * strikeThrough: 删除线
 */
export type EditorToolType = 'undo' | 'reset' | 'blod' | 'italic' | 'underline' | 'strikeThrough'

/**
 * 编辑器操作类型
 * default: 默认
 * group: 组
 */
export type EditorOperatorType = 'default' | 'group'

export interface EditorOperator {
  type: EditorToolType
  operatorType: EditorOperatorType
  label?: string
  icon?: string
  children?: EditorOperator[]
}

/**
 * 编辑器属性
 */
export interface EditorProps {
  style?: CSSProperties
  editorId?: string
  operators?: EditorOperator[][]
}
