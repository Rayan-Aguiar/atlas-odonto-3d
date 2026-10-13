import { render } from '@testing-library/react'
import { Tooltip } from 'radix-ui'
import type { ReactElement } from 'react'

export const renderWithProviders = (ui: ReactElement) => render(<Tooltip.Provider>{ui}</Tooltip.Provider>)
