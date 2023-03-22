import 'bootstrap/dist/css/bootstrap.min.css'
import Container from 'react-bootstrap/esm/Container';
import { Routes, Route, Navigate } from 'react-router-dom'
import { useLocalStorage } from './hooks/useLocalStorage';
import NewNote from './components/NewNote';
import { useMemo } from 'react'
import { v4 as uuidV4 } from 'uuid'
import NoteList from './components/NoteList';
import NoteLayout from './components/NoteLayout';
import { Note } from './components/Note';
import EditNote from './components/EditNote';

export type Note = {
  id: string
} & NoteData

export type RawNote = {

  id: string

} & RawNoteData

export type RawNoteData = {
  title: string
  markdown: string
  tagIds: string[]
}


export type NoteData = {
  title: string
  markdown: string
  tags: Tag[]
}

export type Tag = {
  id: string
  label: string
}
function App() {

  const [notes, setNotes] = useLocalStorage<RawNote[]>('NOTES', [])
  const [tags, setTags] = useLocalStorage<Tag[]>('TAGS', [])

  const notesWithTags = useMemo(() => {
    return notes.map(note => {//loop through all the different notes 
      return {
        ...note, tags: tags.filter(tag => note.tagIds.includes(tag.id)
        )
      }//keep the information about the notes and get the tags that have the associated id inside of our note that is being stored

    })
  }, [notes, tags])


  function onCreateNote({ tags, ...data }: NoteData) {
    setNotes(prevNotes => {
      return [
        ...prevNotes,
        { ...data, id: uuidV4(), tagIds: tags.map(tag => tag.id) }] //create a note and add it to the notes array to save them
    })
  }
  function onUpdateNote(id: string, { tags, ...data }: NoteData) {
    setNotes(prevNotes => {
      return prevNotes.map(note => {
        if (note.id === id) {//find the note that we clicked
          return { ...note, ...data, tagIds: tags.map(tag => tag.id) } //overwrite that data
        }
        else {
          return note
        }
      }
      )
    })
  }

  function onDeleteNote(id: string) {
    setNotes(prevNotes => {
      return prevNotes.filter(note => note.id !== id) //find the clicked note id and filter it from the notes array


    })

  }




  function addTag(tag: Tag) {
    setTags(prev => [...prev, tag])  
  }


  function updateTag(id: string, label: string) {

    setTags(prevTags => {
      return prevTags.map(tag => {
        if (tag.id === id) {  //find the tag that we clicked
          return { ...tag, label }  //overWrite it
        }
        else {
          return tag
        }
      }
      )
    })
  }
  function deleteTag(id: string) {
    setTags(prevTags => {
      return prevTags.filter(tag => tag.id !== id)


    })
  }



  return (
    <Container className="my-4 ">
      <Routes >
        <Route path='/' element={
          <NoteList
          
            notes={notesWithTags}
            onUpdateTag={updateTag}
            onDeleteTag={deleteTag}
            availableTags={tags} />} />
        <Route
          path='/new'
          element={
            <NewNote
              onSubmit={onCreateNote}
              onAddTag={addTag}
              availableTags={tags}

            />
          }
        />
        <Route path="/:id" element={<NoteLayout notes={notesWithTags} />}>
          <Route index element={<Note onDelete={onDeleteNote} />} />
          <Route path="edit" element={<EditNote
            onSubmit={onUpdateNote}
            onAddTag={addTag}
            availableTags={tags} />} />
        </Route>
        <Route path="*" element={<Navigate to='/' />} />
      </Routes>
    </Container>
  )
}

export default App;
