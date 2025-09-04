import type { RichTextEditorOptions } from '../types';
import type { CommandType } from '../types/command';
import { Command } from './command';

/**
 * 富文本编辑器类
 * 负责管理编辑器的核心功能，包括事件绑定、选择状态管理、内容操作等
 */
export class RichTextEditor {
  private readonly editor: HTMLElement;
  private readonly history: string[] = [];
  private readonly wordCountElement: HTMLElement;
  private readonly charCountElement: HTMLElement;
  private readonly command: Command;
  private savedRange: Range | null = null;
  private savedSelection: Selection | null = null;

  constructor(options: RichTextEditorOptions) {
    const { editorId = 'editor' } = options;

    // 初始化DOM元素
    this.editor = this.getElementById(editorId);
    this.wordCountElement = this.getElementById('wordCount');
    this.charCountElement = this.getElementById('charCount');

    // 初始化命令处理器
    this.command = new Command(this.editor);

    // 绑定事件
    this.bindEvents();

    // 初始化字数统计
    this.updateWordCount();
  }

  /**
   * 安全获取DOM元素
   */
  private getElementById(id: string): HTMLElement {
    const element = document.getElementById(id);
    if (!element) {
      throw new Error(`Element with id '${id}' not found`);
    }
    return element;
  }

  /**
   * 绑定编辑器事件
   */
  private bindEvents(): void {
    this.bindCommandButtons();
    this.bindEditorEvents();
  }

  /**
   * 绑定命令按钮事件
   */
  private bindCommandButtons(): void {
    const buttonElements = document.querySelectorAll('.commond-button');

    buttonElements.forEach((button) => {
      // 在 mousedown 时保存当前选择，防止点击按钮时选择丢失
      button.addEventListener('mousedown', this.handleButtonMouseDown.bind(this));
      button.addEventListener('click', this.handleButtonClick.bind(this));
    });
  }

  /**
   * 绑定编辑器内容变化事件
   */
  private bindEditorEvents(): void {
    this.editor.addEventListener('input', this.handleEditorInput.bind(this));
    this.editor.addEventListener('keyup', this.handleEditorKeyUp.bind(this));
  }

  /**
   * 处理按钮鼠标按下事件
   */
  private handleButtonMouseDown(event: Event): void {
    event.preventDefault(); // 防止按钮获取焦点
    this.saveCurrentSelection();
  }

  /**
   * 处理按钮点击事件
   */
  private handleButtonClick(event: Event): void {
    const target = event.target as HTMLElement;
    const command = target.dataset.command;

    if (!command) {
      console.warn('Button missing data-command attribute');
      return;
    }

    this.executeCommand(command as CommandType);
  }

  /**
   * 处理编辑器输入事件
   */
  private handleEditorInput(): void {
    this.updateWordCount();
  }

  /**
   * 处理编辑器按键事件
   */
  private handleEditorKeyUp(): void {
    // 可以在这里添加快捷键处理逻辑
  }

  /**
   * 执行命令
   */
  private executeCommand(command: CommandType): void {
    const range = this.savedRange;
    const selection = this.savedSelection;

    if (!range || !selection) {
      console.warn('No saved selection found');
      return;
    }

    const result = this.command.executeCommand({ command, range, selection });

    if (!result.success) {
      console.error('Failed to execute command:', command, result.error);
      return;
    }

    this.updateWordCount();
  }

  /**
   * 保存当前选择状态
   */
  private saveCurrentSelection(): void {
    const selection = this.getSelection();
    if (selection && selection.rangeCount > 0) {
      this.savedRange = selection.getRangeAt(0).cloneRange();
      this.savedSelection = selection;
    }
  }

  /**
   * 获取当前选择
   */
  public getSelection(): Selection | null {
    return window.getSelection();
  }

  /**
   * 获取当前范围
   */
  public getRange(): Range | null {
    const selection = this.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return null;
    }
    return selection.getRangeAt(0);
  }

  /**
   * 获取编辑器HTML内容
   */
  public getContent(): string {
    return this.editor.innerHTML;
  }

  /**
   * 设置编辑器HTML内容
   */
  public setContent(html: string): void {
    if (typeof html !== 'string') {
      throw new Error('Content must be a string');
    }

    this.editor.innerHTML = html;
    this.updateWordCount();
  }

  /**
   * 获取纯文本内容
   */
  public getTextContent(): string {
    return this.editor.innerText || this.editor.textContent || '';
  }

  /**
   * 更新字数统计
   */
  private updateWordCount(): void {
    const text = this.getTextContent();
    const { wordCount, charCount } = this.calculateWordCount(text);

    this.updateWordCountDisplay(wordCount, charCount);
  }

  /**
   * 计算字数和字符数
   */
  private calculateWordCount(text: string): { wordCount: number; charCount: number } {
    const trimmedText = text.trim();

    if (trimmedText === '') {
      return { wordCount: 0, charCount: 0 };
    }

    const words = trimmedText.split(/\s+/).filter((word) => word.length > 0);

    return {
      wordCount: words.length,
      charCount: text.length,
    };
  }

  /**
   * 更新字数统计显示
   */
  private updateWordCountDisplay(wordCount: number, charCount: number): void {
    if (this.wordCountElement) {
      this.wordCountElement.textContent = `字数: ${wordCount}`;
    }

    if (this.charCountElement) {
      this.charCountElement.textContent = `字符数: ${charCount}`;
    }
  }

  /**
   * 移除事件监听器
   */
  private removeEventListener(eventType: string, handler: EventListener): void {
    this.editor.removeEventListener(eventType, handler);
  }

  /**
   * 销毁编辑器，清理事件监听器
   */
  public destroy(): void {
    // 清理事件监听器
    this.removeEventListener('input', this.handleEditorInput.bind(this));
    this.removeEventListener('keyup', this.handleEditorKeyUp.bind(this));

    // 清理按钮事件
    const buttonElements = document.querySelectorAll('.commond-button');
    buttonElements.forEach((button) => {
      button.removeEventListener('mousedown', this.handleButtonMouseDown.bind(this));
      button.removeEventListener('click', this.handleButtonClick.bind(this));
    });
  }

  /**
   * 获取编辑器状态
   */
  public getEditorState(): {
    content: string;
    textContent: string;
    wordCount: number;
    charCount: number;
    hasSelection: boolean;
  } {
    const textContent = this.getTextContent();
    const { wordCount, charCount } = this.calculateWordCount(textContent);

    return {
      content: this.getContent(),
      textContent,
      wordCount,
      charCount,
      hasSelection: this.savedRange !== null && this.savedSelection !== null,
    };
  }
}
