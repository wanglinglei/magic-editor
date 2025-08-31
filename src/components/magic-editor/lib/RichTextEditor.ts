import type { RichTextEditorOptions } from '../types'
import { Command } from './command'
export class RichTextEditor {
  private editor: HTMLElement
  private history: string[] = []
  private wordCountElement: HTMLElement
  private charCountElement: HTMLElement
  private command: Command
  private savedRange: Range | null = null
  private savedSelection: Selection | null = null

  constructor(options: RichTextEditorOptions) {
    const { editorId = 'editor' } = options
    this.editor = document.getElementById(editorId) as HTMLElement
    this.wordCountElement = document.getElementById('wordCount') as HTMLElement
    this.charCountElement = document.getElementById('charCount') as HTMLElement
    this.command = new Command(this.editor)
    this.bindEvents()
  }

  bindEvents() {
    const buttonElements = document.querySelectorAll('.commond-button')
    buttonElements.forEach((button) => {
      // 在 mousedown 时保存当前选择，防止点击按钮时选择丢失
      button.addEventListener('mousedown', (e) => {
        e.preventDefault() // 防止按钮获取焦点
        this.saveCurrentSelection()
      })

      button.addEventListener('click', (e) => {
        const command = (e.target as HTMLElement).dataset.command
        if (!command) {
          return
        }

        // 使用保存的选择状态
        const range = this.savedRange
        const selection = this.savedSelection
        if (!range || !selection) {
          return
        }
        if (command) {
          this.command.executeCommand({ command, range, selection })
        }
      })
    })
  }

  // 保存当前选择状态
  saveCurrentSelection() {
    const selection = this.getSelection()
    if (selection && selection.rangeCount > 0) {
      this.savedRange = selection.getRangeAt(0).cloneRange()
      this.savedSelection = selection
    }
  }

  // 获取当前选择
  getSelection(): Selection | null {
    return window.getSelection()
  }

  // 获取当前范围
  getRange(): Range | null {
    const selection = this.getSelection()
    if (!selection || selection.rangeCount === 0) {
      return null
    }
    return selection.getRangeAt(0)
  }

  // 获取编辑器内容
  getContent() {
    return this.editor.innerHTML
  }

  // 设置编辑器内容
  setContent(html: string) {
    this.editor.innerHTML = html
    this.updateWordCount()
  }

  // 获取纯文本内容
  getTextContent() {
    return this.editor.innerText || this.editor.textContent || ''
  }

  // 更新字数统计
  updateWordCount() {
    const text = this.editor.innerText || this.editor.textContent || ''
    const words = text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0)
    const wordCount = text.trim() === '' ? 0 : words.length
    const charCount = text.length

    this.wordCountElement.textContent = `字数: ${wordCount}`
    this.charCountElement.textContent = `字符数: ${charCount}`
  }
}
