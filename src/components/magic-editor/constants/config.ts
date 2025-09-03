export const DEFAULT_EDITOR_OPERATORS = [
  [
    {
      type: 'undo',
      operatorType: 'default',
      label: '撤销',
    },
    {
      type: 'reset',
      operatorType: 'default',
      label: '重置',
    },
  ],
  [
    {
      type: 'blod',
      operatorType: 'default',
      label: '加粗',
    },
    {
      type: 'italic',
      operatorType: 'default',
      label: '斜体',
    },
    {
      type: 'underline',
      operatorType: 'default',
      label: '下划线',
    },
    {
      type: 'strikeThrough',
      operatorType: 'default',
      label: '删除线',
    },
  ],
];

export const DEFAULT_EDITOR_ID = 'magic-editor';

export const DEFAULT_EDITOR_CONTENT = '欢迎使用富文本编辑器！在这里开始编写你的内容...';
