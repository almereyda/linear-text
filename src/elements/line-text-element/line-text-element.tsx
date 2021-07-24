import type React from 'react'

import {
  addLineAction,
  editLineTextAction,
  focusLineAction,
  removeLineAction,
  selectTableState
} from '../../store/table-slice/table-slice'
import {Line} from '../../line/line'
import {useAppDispatch, useAppSelector} from '../../hooks/use-store'
import {useCallback, useEffect, useRef, useState} from 'react'
import {useFocusSpellchecker} from '../../hooks/use-focus-spellcheck'

import './line-text-element.css'

export type LineTextElementProps = Readonly<{line: Readonly<Line>}>

export function LineTextElement({line}: LineTextElementProps): JSX.Element {
  const dispatch = useAppDispatch()
  const tableState = useAppSelector(selectTableState)

  const {spellcheck, onBlurSpellcheck, onFocusSpellcheck} =
    useFocusSpellchecker()
  const [text, setText] = useState(line.text)
  const onChange = useCallback(
    (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
      const text = ev.currentTarget.value
      setText(text)
      dispatch(editLineTextAction({id: line.id, text}))
    },
    [dispatch, line.id]
  )
  const onFocus = useCallback(
    (ev: React.FocusEvent<HTMLTextAreaElement>) => {
      onFocusSpellcheck(ev)
      ev.stopPropagation()
      // There is not a mirroring dispatch call for blur because focus is lost
      // on discard button press. Clear focus on GroupElement click instead.
      dispatch(focusLineAction(line))
    },
    [dispatch, line, onFocusSpellcheck]
  )
  const onKeyDown = useCallback(
    (ev: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // [todo]: Document keyboard navigation.
      const remove =
        (ev.key === 'Backspace' || ev.key === 'Delete') && Line.isEmpty(line)
      if (ev.key !== 'Enter' && !remove) return
      ev.preventDefault()
      ev.stopPropagation()
      dispatch(
        ev.key === 'Enter'
          ? addLineAction()
          : removeLineAction({
              line,
              focus: ev.key === 'Backspace' ? 'prev' : 'next'
            })
      )
    },
    [dispatch, line]
  )

  const textRef = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    if (tableState.focus === line) textRef.current?.focus()
  }, [tableState.focus, line, textRef])

  return (
    <div className='line-text-element' data-text={text}>
      <textarea
        ref={textRef}
        autoFocus={tableState.focus === line}
        className='line-text-element__text'
        onBlur={onBlurSpellcheck}
        onChange={onChange}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        rows={1}
        spellCheck={spellcheck}
        value={text}
      />
    </div>
  )
}