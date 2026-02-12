import { FC, memo } from 'react'
import ReactMarkdown, { Options } from 'react-markdown'

export const MemoizedReactMarkdown: FC<Options & { className?: string }> = memo(
  ReactMarkdown as FC<Options & { className?: string }>,
  (prevProps, nextProps) =>
    prevProps.children === nextProps.children &&
    prevProps.className === nextProps.className
)
