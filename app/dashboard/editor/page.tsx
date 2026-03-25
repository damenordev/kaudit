'use client'

import { useState } from 'react'

import { Button } from '@/core/ui/button'
import { Editor } from '@/core/ui/editor'
import type { TOutputFormat } from '@/core/ui/editor/editor.types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/core/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/core/ui/sheet'

export default function EditorDemoPage() {
  const [content, setContent] = useState(
    '<h1>Rich Text Editor Demo</h1><p>Welcome to the newly integrated <b>LexKit</b> editor.</p><p>You can use the toolbar above to format this text or add links and images.</p>'
  )
  const [format, setFormat] = useState<TOutputFormat>('html')

  return (
    <div className="flex flex-col gap-3 p-4 h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={format} onValueChange={(value: TOutputFormat) => setFormat(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Output format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="html">HTML String</SelectItem>
              <SelectItem value="markdown">Markdown</SelectItem>
              <SelectItem value="json">Lexical JSON</SelectItem>
            </SelectContent>
          </Select>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Ver Output</Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-4xl w-[95vw] sm:w-[85vw] overflow-y-auto border-l border-border p-6 shadow-2xl">
              <SheetHeader className="mb-6 pb-4 border-b border-border/50">
                <SheetTitle className="text-xl font-medium tracking-tight">
                  Output: <span className="text-muted-foreground font-normal uppercase text-sm ml-2">{format}</span>
                </SheetTitle>
              </SheetHeader>
              <div className="relative rounded-md bg-muted/30 p-4 border border-border/50">
                <pre className="text-sm font-mono whitespace-pre-wrap wrap-break-word text-foreground/90 selection:bg-primary/20 selection:text-foreground">
                  {content}
                </pre>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <Editor
        className="flex-1"
        value={content}
        onChange={setContent}
        minHeight="100%"
        config={{ output: format }}
        placeholder="Escribe algo aquí..."
        onImageUpload={async file => {
          // Dummy upload for demo purposes
          return new Promise(resolve => {
            setTimeout(() => {
              resolve(URL.createObjectURL(file))
            }, 1000)
          })
        }}
      />
    </div>
  )
}
