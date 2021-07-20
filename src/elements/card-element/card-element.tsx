import type {ReactNode} from 'react'

import './card-element.css'

export type CardElementProps = Readonly<{children: ReactNode}>

export function CardElement({children}: CardElementProps) {
  return <div className='card-element'>{children}</div>
}
