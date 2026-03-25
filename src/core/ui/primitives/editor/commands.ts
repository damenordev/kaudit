export function commandsToCommandPaletteItems(commands: any) {
  return [
    { id: 'bold', label: 'Bold', category: 'Formatting', shortcut: '⌘B', action: () => commands.toggleBold() },
    { id: 'italic', label: 'Italic', category: 'Formatting', shortcut: '⌘I', action: () => commands.toggleItalic() },
    {
      id: 'underline',
      label: 'Underline',
      category: 'Formatting',
      shortcut: '⌘U',
      action: () => commands.toggleUnderline(),
    },
    {
      id: 'strikethrough',
      label: 'Strikethrough',
      category: 'Formatting',
      action: () => commands.toggleStrikethrough(),
    },
    { id: 'h1', label: 'Heading 1', category: 'Headings', action: () => commands.toggleHeading('h1') },
    { id: 'h2', label: 'Heading 2', category: 'Headings', action: () => commands.toggleHeading('h2') },
    { id: 'h3', label: 'Heading 3', category: 'Headings', action: () => commands.toggleHeading('h3') },
    { id: 'quote', label: 'Quote', category: 'Blocks', action: () => commands.toggleQuote() },
    { id: 'code', label: 'Code Block', category: 'Blocks', action: () => commands.toggleCodeBlock() },
    { id: 'ul', label: 'Bullet List', category: 'Lists', action: () => commands.toggleUnorderedList() },
    { id: 'ol', label: 'Numbered List', category: 'Lists', action: () => commands.toggleOrderedList() },
    { id: 'link', label: 'Add Link', category: 'Media', action: () => commands.insertLink('') },
  ]
}

export function registerKeyboardShortcuts(commands: any, element: HTMLElement) {
  const handler = (e: KeyboardEvent) => {
    // We rely on standard browser shortcuts for inputs where possible, but could add custom ones here
  }
  element.addEventListener('keydown', handler)
  return () => {
    element.removeEventListener('keydown', handler)
  }
}
