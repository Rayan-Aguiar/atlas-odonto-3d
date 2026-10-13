import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { DetailsPanel } from '@/features/anatomy-details/DetailsPanel'
import { FiltersPanel } from '@/features/anatomy-filters/FiltersPanel'
import { ViewerOverlay } from '@/features/anatomy-viewer/components/ViewerOverlay'
import { useViewer } from '@/features/anatomy-viewer/store'
import { SearchBox } from '@/features/search/SearchBox'
import { useStudy } from '@/features/study-mode/studyStore'
import { renderWithProviders } from './render'

beforeEach(() => {
  useViewer.getState().restoreDefault()
  useViewer.setState({ moduleStatus: {}, moduleErrors: {} })
  useStudy.setState({ favorites: [], history: [], notes: {}, studied: [], quiz: { answered: 0, correct: 0, byStructure: {} } })
})

describe('painel de detalhes', () => {
  it('mostra orientação quando nada está selecionado', () => {
    renderWithProviders(<DetailsPanel />)
    expect(screen.getByText('Escolha uma estrutura')).toBeInTheDocument()
  })

  it('o botão de limpar remove a seleção e volta ao estado inicial', async () => {
    act(() => useViewer.getState().select('masseter'))
    renderWithProviders(<DetailsPanel />)
    await userEvent.click(screen.getByRole('button', { name: 'Limpar seleção' }))
    expect(useViewer.getState().selectedId).toBeNull()
    expect(screen.getByText('Escolha uma estrutura')).toBeInTheDocument()
  })

  it('apresenta os campos do músculo com origem, inserção e inervação', async () => {
    act(() => useViewer.getState().select('masseter'))
    renderWithProviders(<DetailsPanel />)
    expect(screen.getByRole('heading', { level: 2, name: 'Músculo masseter' })).toBeInTheDocument()
    expect(screen.getByText('Masseter', { selector: 'p' })).toBeInTheDocument()
    expect(screen.getByText('Parcialmente verificado')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('tab', { name: 'Anatomia' }))
    expect(screen.getByRole('heading', { name: /Origem/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Inserção/ })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('tab', { name: 'Inervação e irrigação' }))
    expect(screen.getByText(/Nervo mandibular \(V3\)/)).toBeInTheDocument()
  })

  it('exibe apenas seções pertinentes (forame não tem aba de inervação)', () => {
    act(() => useViewer.getState().select('mandibular-foramen'))
    renderWithProviders(<DetailsPanel />)
    expect(screen.queryByRole('tab', { name: 'Inervação e irrigação' })).not.toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Anatomia' })).toBeInTheDocument()
  })

  it('informa explicitamente quando a estrutura não está no 3D e indica onde localizá-la', () => {
    act(() => useViewer.getState().select('mandibular-foramen'))
    renderWithProviders(<DetailsPanel />)
    expect(screen.getByText('Sem representação 3D')).toBeInTheDocument()
    expect(screen.getByText(/não está individualizada no modelo 3D atual/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Mandíbula' })).toBeInTheDocument()
  })

  it('não inventa conteúdo para estruturas só com nomenclatura', async () => {
    act(() => useViewer.getState().select('vertebra-c4'))
    renderWithProviders(<DetailsPanel />)
    expect(screen.getByText('Informação não disponível')).toBeInTheDocument()
    expect(screen.getByText(/ficha descritiva desta estrutura ainda não foi escrita/)).toBeInTheDocument()
  })

  it('links de relações selecionam a estrutura relacionada', async () => {
    act(() => useViewer.getState().select('mental-foramen'))
    renderWithProviders(<DetailsPanel />)
    await userEvent.click(screen.getByRole('tab', { name: 'Relações' }))
    await userEvent.click(within(screen.getByRole('tabpanel')).getByRole('button', { name: /Nervo mentual/ }))
    expect(useViewer.getState().selectedId).toBe('mental-nerve')
  })

  it('favoritar persiste no armazenamento local', async () => {
    act(() => useViewer.getState().select('mandible'))
    renderWithProviders(<DetailsPanel />)
    await userEvent.click(screen.getByRole('button', { name: 'Adicionar aos favoritos' }))
    expect(useStudy.getState().favorites).toEqual(['mandible'])
    expect(localStorage.getItem('atlas-odonto:study')).toContain('mandible')
  })

  it('isolar e ocultar atualizam o estado da cena', async () => {
    act(() => useViewer.getState().select('mandible'))
    renderWithProviders(<DetailsPanel />)
    await userEvent.click(screen.getByRole('button', { name: 'Isolar estrutura' }))
    expect(useViewer.getState().isolatedIds).toEqual(['mandible'])
    await userEvent.click(screen.getByRole('button', { name: 'Ocultar estrutura' }))
    expect(useViewer.getState().hiddenIds).toContain('mandible')
  })
})

describe('pesquisa global (teclado)', () => {
  it('sugere durante a digitação e seleciona com setas + Enter', async () => {
    renderWithProviders(<SearchBox />)
    const input = screen.getByRole('combobox')
    await userEvent.type(input, 'alveolar inferior')
    expect(screen.getAllByRole('option').length).toBeGreaterThan(0)
    await userEvent.keyboard('{Enter}')
    expect(useViewer.getState().selectedId).toBe('inferior-alveolar-nerve')
  })

  it('avisa quando nada é encontrado', async () => {
    renderWithProviders(<SearchBox />)
    await userEvent.type(screen.getByRole('combobox'), 'xyzxyz')
    expect(screen.getByText(/Nada encontrado/)).toBeInTheDocument()
  })
})

describe('filtros (interface)', () => {
  it('liga e desliga camadas pelo teclado', async () => {
    renderWithProviders(<FiltersPanel />)
    const muscles = screen.getByRole('checkbox', { name: /Músculos/ })
    expect(muscles).toHaveAttribute('aria-checked', 'false')
    muscles.focus()
    await userEvent.keyboard('{Enter}')
    expect(useViewer.getState().categories).toContain('muscles')
    await userEvent.keyboard(' ')
    expect(useViewer.getState().categories).not.toContain('muscles')
  })

  it('mostra a quantidade de estruturas encontradas e limpa os filtros', async () => {
    renderWithProviders(<FiltersPanel />)
    await userEvent.click(screen.getByRole('button', { name: 'Região da ATM' }))
    expect(screen.getByText(/encontradas/)).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /Limpar filtros/ }))
    expect(useViewer.getState().regions).toEqual([])
  })
})

describe('modelos indisponíveis', () => {
  it('mostra falha de carregamento com opção de tentar novamente', async () => {
    const retries: string[] = []
    act(() => useViewer.getState().setModuleStatus('nerves', 'error', 'HTTP 404'))
    renderWithProviders(<ViewerOverlay onRetry={(m) => retries.push(m)} />)
    expect(screen.getByRole('alert')).toHaveTextContent('O módulo de nervos não carregou')
    await userEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }))
    expect(retries).toEqual(['nerves'])
  })

  it('indica quando nenhuma estrutura está visível', () => {
    act(() => useViewer.getState().setCategories([]))
    renderWithProviders(<ViewerOverlay onRetry={() => {}} />)
    expect(screen.getByText('Nenhuma estrutura visível')).toBeInTheDocument()
  })
})
