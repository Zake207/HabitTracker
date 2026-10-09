export interface DailyNote {
    date: Date
    notes: string
}

export class DailyNoteService {
    private daily_notes: Array<DailyNote> = []

    constructor (notes: Array<DailyNote> = []) {
        this.daily_notes = notes
    }

    getNotes(): Array<DailyNote> {
        return this.daily_notes
    }

    searchNote(date: Date): DailyNote | undefined {
            return this.daily_notes.find(
        (note) =>
            note.date.getFullYear() === date.getFullYear() &&
            note.date.getMonth() === date.getMonth() &&
            note.date.getDate() === date.getDate()
        )
    }

    addNote(date: Date, note: string) : boolean {
        const selected_note = this.searchNote(date)
        if (selected_note != undefined) {
            selected_note.notes += '\n' + note
            return true
        }
        else {
            const new_note: DailyNote = {
                date: date,
                notes: note
            }
            this.daily_notes.push(new_note)
            return true
        }
    }

    
}