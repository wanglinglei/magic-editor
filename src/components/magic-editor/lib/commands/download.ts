import { BaseCommandExecutor } from './base';

export class ExportCommandExecutor extends BaseCommandExecutor {
  constructor(private readonly editor: HTMLElement) {
    super();
  }

  protected executeCommand(): void {
    this.exportContent();
  }

  private exportContent(): void {
    const content = this.editor.innerHTML;
    const htmlContent = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>导出的文档</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
        }
        p { margin-bottom: 12px; }
        ul, ol { margin: 12px 0; padding-left: 24px; }
        li { margin-bottom: 4px; }
        a { color: #007acc; text-decoration: underline; }
        a:hover { text-decoration: none; }
    </style>
</head>
<body>
    ${content}
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// 导出常量，从统一的常量文件中重新导出
export { DEFAULT_EXPORT_COMMANDS_CONFIG, EXPORT_COMMANDS } from '../../constants/commands';
