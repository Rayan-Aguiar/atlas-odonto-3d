import { act, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { STRUCTURE_BY_ID, verificationStatus } from '@/features/anatomy-catalog/catalog'
import { useViewer } from '@/features/anatomy-viewer/store'
import { StudyPanel } from '@/features/study-mode/StudyPanel'
import { buildQuiz, eligibleStructures, flashcardDeck, seededRng } from '@/features/study-mode/quiz'
import { useStudy } from '@/features/study-mode/studyStore'
import { useUi } from '@/app/uiStore'
import { renderWithProviders } from './render'

beforeEach(() => {
  useViewer.getState().restoreDefault()
  useStudy.setState({ favorites: [], history: [], notes: {}, studied: [], quiz: { answered: 0, correct: 0, byStructure: {} } })
})

describe('geração de questões', () => {
  it('usa apenas estruturas com malha própria e conteúdo com fonte', () => {
    for (const s of eligibleStructures()) {
      expect(s.meshIds.length).toBeGreaterThan(0)
      expect(['verified', 'partial']).toContain(verificationStatus(s))
    }
  })

  it('cada questão tem 4 alternativas únicas e a resposta está entre elas', () => {
    const quiz = buildQuiz({ categories: ['muscles', 'nerves'] }, 15, seededRng(42))
    expect(quiz.length).toBeGreaterThan(5)
    for (const q of quiz) {
      expect(q.options).toHaveLength(4)
      expect(new Set(q.options).size).toBe(4)
      expect(q.options).toContain(q.answer)
      expect(STRUCTURE_BY_ID.get(q.structureId)?.meshIds.length).toBeGreaterThan(0)
    }
  })

  it('é reprodutível com a mesma semente', () => {
    expect(buildQuiz({ categories: ['muscles'] }, 5, seededRng(7))).toEqual(buildQuiz({ categories: ['muscles'] }, 5, seededRng(7)))
  })

  it('não gera perguntas sobre estruturas sem dados validados', () => {
    const deck = flashcardDeck({ ids: ['vertebra-c4', 'mandibular-foramen'] }, seededRng(1))
    expect(deck).toEqual([])
  })
})

describe('modo de estudo (interface)', () => {
  it('oculta nomes durante a sessão e revela a resposta', async () => {
    renderWithProviders(<StudyPanel />)
    await userEvent.click(screen.getByRole('button', { name: 'Começar' }))
    expect(useUi.getState().studyActive).toBe(true)
    const selected = useViewer.getState().selectedId
    expect(selected).toBeTruthy()
    const name = STRUCTURE_BY_ID.get(selected!)!.name
    expect(screen.queryByText(name)).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /Revelar resposta/ }))
    expect(screen.getByText(name)).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Acertei' }))
    expect(useStudy.getState().quiz).toMatchObject({ answered: 1, correct: 1 })
  })

  it('questionário dá feedback após a resposta', async () => {
    renderWithProviders(<StudyPanel />)
    await userEvent.click(screen.getByRole('radio', { name: /Questionário/ }))
    await userEvent.click(screen.getByRole('button', { name: 'Começar' }))
    const options = screen.getAllByRole('listitem').map((li) => li.querySelector('button')!).filter(Boolean)
    await userEvent.click(options[0]!)
    expect(screen.getByRole('status')).toHaveTextContent(/Correto!|Não foi dessa vez/)
    expect(useStudy.getState().quiz.answered).toBe(1)
  })

  it('encerrar a sessão libera os nomes novamente', async () => {
    renderWithProviders(<StudyPanel />)
    await userEvent.click(screen.getByRole('button', { name: 'Começar' }))
    await userEvent.click(screen.getByRole('button', { name: /Encerrar/ }))
    expect(useUi.getState().studyActive).toBe(false)
  })
})

describe('progresso local', () => {
  it('registra histórico sem duplicar e com limite', () => {
    const { recordVisit } = useStudy.getState()
    act(() => {
      recordVisit('mandible')
      recordVisit('maxilla')
      recordVisit('mandible')
    })
    expect(useStudy.getState().history).toEqual(['mandible', 'maxilla'])
    expect(useStudy.getState().studied).toEqual(['mandible', 'maxilla'])
  })

  it('anotações vazias são removidas', () => {
    act(() => useStudy.getState().setNote('mandible', 'forame mentual abaixo do 2º PM'))
    expect(useStudy.getState().notes.mandible).toBeDefined()
    act(() => useStudy.getState().setNote('mandible', '   '))
    expect(useStudy.getState().notes.mandible).toBeUndefined()
  })
})
