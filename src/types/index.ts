export interface CodeSnippet {
  id: string;
  language: string;
  code: string;
  title?: string;
}

export interface NoteSection {
  id: string;
  heading: string;
  explanation?: string;
  points: string[];
  codeSnippets: CodeSnippet[];
}

export interface ReferenceLink {
  id: string;
  title: string;
  url: string;
}

export interface Note {
  id: string;
  title: string;
  description: string;
  sections: NoteSection[];
  tags: string[];
  references: ReferenceLink[];
  createdAt: string;
  updatedAt: string;
  isFavorite?: boolean;
  viewCount?: number;
}

export interface FlowNoteReference {
  noteId: string;
  order: number;
  noteStepTitle?: string;
  notesSummary?: string;
}

export interface NotesFlow {
  id: string;
  title: string;
  description: string;
  notes: FlowNoteReference[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isFavorite?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  githubHandle?: string;
}

export type ViewMode = 
  | 'landing'
  | 'login'
  | 'signup'
  | 'dashboard'
  | 'notes-list'
  | 'create-note'
  | 'edit-note'
  | 'view-note'
  | 'flows-list'
  | 'create-flow'
  | 'edit-flow'
  | 'view-flow'
  | 'favorites'
  | 'tags'
  | 'settings';
