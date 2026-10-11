import { expect, it, describe, beforeEach } from 'vitest'
import {
  HabitRegister,
  HabitRegisterService,
} from '../src/logic/HabitRegisterService'

describe('HabitRegisterService', () => {
  // Registros válidos
  const register1: HabitRegister = {
    habitId: 1,
    date: new Date(2026, 8, 28),
    completed: true,
    realized: 2,
  }

  const register2: HabitRegister = {
    habitId: 1,
    date: new Date(2026, 8, 29),
    completed: false,
    realized: 1,
  }

  const register3: HabitRegister = {
    habitId: 2,
    date: new Date(2026, 8, 29),
    completed: true,
    realized: 5,
  }

  const register4: HabitRegister = {
    habitId: 2,
    date: new Date(2026, 8, 28),
    completed: true,
    realized: 5,
  }

  const modified_habit1: HabitRegister = {
    habitId: 1,
    date: new Date(2026, 8, 28),
    completed: true,
    realized: 7,
  }
  // Fecha futura
  const futureRegister: HabitRegister = {
    habitId: 1,
    date: new Date(2099, 0, 1),
    completed: false,
    realized: 1,
  }

  // Cantidad realizada inválida
  const invalidRealized: HabitRegister = {
    habitId: 1,
    date: new Date(2026, 8, 28),
    completed: true,
    realized: 0,
  }

  // Map inicial para el servicio
  const registers = new Map<number, Array<HabitRegister>>([
    [1, [register1, register2]],
    [2, [register3]],
  ])

  // Servicio que utilizaremos en las pruebas
  let service: HabitRegisterService

  beforeEach(() => {
    service = new HabitRegisterService(registers)
  })

  it('insertRegister works correctly', () => {
    expect(service.insertRegister(register4)).toBe(true)
    expect(service.insertRegister(register3)).toBe(false)
    expect(service.insertRegister(futureRegister)).toBe(false)
    expect(service.insertRegister(invalidRealized)).toBe(false)
  })

  it('modifyRegister works correctly', () => {
    expect(service.modifyRegister(modified_habit1)).toBe(true)
    expect(service.modifyRegister(invalidRealized)).toBe(false)
  })

  it('eraseRegister works correctly', () => {
    expect(service.eraseRegister(2, new Date(2026, 8, 28))).toBe(true)
    service.eraseRegister(2, new Date(2026, 8, 28))
    expect(service.searchRegister(2, new Date(2026, 8, 28)).found).toBe(false)
  })

  it('searchRegister works correcly', () => {
    expect(service.searchRegister(1, new Date(2026, 8, 29)).found).toBe(true)
    expect(service.searchRegister(1, new Date(2026, 8, 29)).register).toBe(
      register2
    )
    expect(service.searchRegister(1, new Date(2026, 8, 29)).index).toBe(1)

    expect(service.searchRegister(3, new Date(2026, 8, 29)).found).toBe(false)
    expect(service.searchRegister(3, new Date(2026, 8, 29)).register).toBe(
      undefined
    )
    expect(service.searchRegister(3, new Date(2026, 8, 29)).index).toBe(-1)
  })
})
