import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Note, NotesFlow, User, ViewMode } from '../types';
import { INITIAL_NOTES, INITIAL_FLOWS } from '../data/initialData';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
}

interface AppContextType {
  notes: Note[];
  flows: NotesFlow[];
  user: User | null;
  activeView: ViewMode;
  activeNoteId: string | null;
  activeFlowId: string | null;
  activeTagFilter: string | null;
  theme: 'dark' | 'light';
  sidebarCollapsed: boolean;
  isSearchOpen: boolean;
  toasts: ToastMessage[];
  codeFont: string;

  // Navigation & UI controls
  navigate: (view: ViewMode, noteId?: string | null, flowId?: string | null, tag?: string | null) => void;
  setSidebarCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  setIsSearchOpen: (open: boolean) => void;
  toggleTheme: () => void;
  setCodeFont: (font: string) => void;
  addToast: (title: string, message?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;

  // CRUD Operations - Notes
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Note;
  updateNote: (id: string, note: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  toggleFavoriteNote: (id: string) => void;

  // CRUD Operations - Flows
  addFlow: (flow: Omit<NotesFlow, 'id' | 'createdAt' | 'updatedAt'>) => NotesFlow;
  updateFlow: (id: string, flow: Partial<NotesFlow>) => void;
  deleteFlow: (id: string) => void;
  toggleFavoriteFlow: (id: string) => void;

  // Auth Operations
  loginUser: (email: string, name?: string) => void;
  logoutUser: () => void;

  // Data Actions
  resetToInitialData: () => void;
  exportKnowledgeBase: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_NOTES_KEY = 'devnotes_notes_v1';
const LOCAL_STORAGE_FLOWS_KEY = 'devnotes_flows_v1';
const LOCAL_STORAGE_THEME_KEY = 'devnotes_theme_v1';
const LOCAL_STORAGE_USER_KEY = 'devnotes_user_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_NOTES_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_NOTES;
  });

  const [flows, setFlows] = useState<NotesFlow[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_FLOWS_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_FLOWS;
  });

  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    // Default logged in demo user for immediate experience
    return {
      id: 'usr-1',
      name: 'Alex Rivera',
      email: 'alex.rivera@devnotes.io',
      githubHandle: 'alexrivera-dev',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
    };
  });

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_THEME_KEY);
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  const [activeView, setActiveView] = useState<ViewMode>('dashboard');
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [activeFlowId, setActiveFlowId] = useState<string | null>(null);
  const [activeTagFilter, setActiveTagFilter] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [codeFont, setCodeFont] = useState('jetbrains');

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_NOTES_KEY, JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_FLOWS_KEY, JSON.stringify(flows));
  }, [flows]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_THEME_KEY, theme);
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
    }
  }, [theme]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    }
  }, [user]);

  // Global Ctrl+K listener for Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const addToast = (title: string, message?: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const navigate = (view: ViewMode, noteId?: string | null, flowId?: string | null, tag?: string | null) => {
    setActiveView(view);
    if (noteId !== undefined) setActiveNoteId(noteId);
    if (flowId !== undefined) setActiveFlowId(flowId);
    if (tag !== undefined) setActiveTagFilter(tag);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Notes CRUD
  const addNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Note => {
    const now = new Date().toISOString();
    const newNote: Note = {
      ...noteData,
      id: `note-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      isFavorite: noteData.isFavorite ?? false,
      viewCount: 1
    };
    setNotes(prev => [newNote, ...prev]);
    addToast('Note Created', `"${newNote.title}" saved successfully`, 'success');
    return newNote;
  };

  const updateNote = (id: string, noteUpdates: Partial<Note>) => {
    setNotes(prev =>
      prev.map(note =>
        note.id === id
          ? { ...note, ...noteUpdates, updatedAt: new Date().toISOString() }
          : note
      )
    );
    addToast('Note Updated', 'Changes saved successfully', 'success');
  };

  const deleteNote = (id: string) => {
    const noteToDelete = notes.find(n => n.id === id);
    setNotes(prev => prev.filter(note => note.id !== id));
    // Remove note reference from flows
    setFlows(prev =>
      prev.map(flow => ({
        ...flow,
        notes: flow.notes.filter(fn => fn.noteId !== id)
      }))
    );
    if (activeNoteId === id) {
      setActiveNoteId(null);
      setActiveView('notes-list');
    }
    addToast('Note Deleted', `"${noteToDelete?.title || 'Note'}" moved to trash`, 'info');
  };

  const toggleFavoriteNote = (id: string) => {
    setNotes(prev =>
      prev.map(note => {
        if (note.id === id) {
          const nextFav = !note.isFavorite;
          addToast(nextFav ? 'Added to Favorites' : 'Removed from Favorites', note.title, 'info');
          return { ...note, isFavorite: nextFav };
        }
        return note;
      })
    );
  };

  // Flows CRUD
  const addFlow = (flowData: Omit<NotesFlow, 'id' | 'createdAt' | 'updatedAt'>): NotesFlow => {
    const now = new Date().toISOString();
    const newFlow: NotesFlow = {
      ...flowData,
      id: `flow-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      isFavorite: flowData.isFavorite ?? false
    };
    setFlows(prev => [newFlow, ...prev]);
    addToast('Notes Flow Created', `"${newFlow.title}" created successfully`, 'success');
    return newFlow;
  };

  const updateFlow = (id: string, flowUpdates: Partial<NotesFlow>) => {
    setFlows(prev =>
      prev.map(flow =>
        flow.id === id
          ? { ...flow, ...flowUpdates, updatedAt: new Date().toISOString() }
          : flow
      )
    );
    addToast('Flow Updated', 'Changes saved successfully', 'success');
  };

  const deleteFlow = (id: string) => {
    const flowToDelete = flows.find(f => f.id === id);
    setFlows(prev => prev.filter(flow => flow.id !== id));
    if (activeFlowId === id) {
      setActiveFlowId(null);
      setActiveView('flows-list');
    }
    addToast('Flow Deleted', `"${flowToDelete?.title || 'Flow'}" deleted`, 'info');
  };

  const toggleFavoriteFlow = (id: string) => {
    setFlows(prev =>
      prev.map(flow => {
        if (flow.id === id) {
          const nextFav = !flow.isFavorite;
          addToast(nextFav ? 'Flow Favorited' : 'Flow Unfavorited', flow.title, 'info');
          return { ...flow, isFavorite: nextFav };
        }
        return flow;
      })
    );
  };

  // Auth
  const loginUser = (email: string, name?: string) => {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: name || email.split('@')[0],
      email,
      githubHandle: email.split('@')[0],
      avatarUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${email}`
    };
    setUser(newUser);
    addToast('Welcome back!', `Logged in as ${newUser.name}`, 'success');
    navigate('dashboard');
  };

  const logoutUser = () => {
    setUser(null);
    addToast('Logged out', 'You have been signed out of your workspace', 'info');
    navigate('landing');
  };

  const resetToInitialData = () => {
    setNotes(INITIAL_NOTES);
    setFlows(INITIAL_FLOWS);
    localStorage.removeItem(LOCAL_STORAGE_NOTES_KEY);
    localStorage.removeItem(LOCAL_STORAGE_FLOWS_KEY);
    addToast('Data Reset', 'Restored sample developer notes and flows', 'info');
  };

  const exportKnowledgeBase = () => {
    const exportData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      user: user,
      notes: notes,
      flows: flows
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `devnotes-knowledge-base-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Export Successful', 'Knowledge base downloaded as JSON', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        notes,
        flows,
        user,
        activeView,
        activeNoteId,
        activeFlowId,
        activeTagFilter,
        theme,
        sidebarCollapsed,
        isSearchOpen,
        toasts,
        codeFont,
        navigate,
        setSidebarCollapsed,
        setIsSearchOpen,
        toggleTheme,
        setCodeFont,
        addToast,
        removeToast,
        addNote,
        updateNote,
        deleteNote,
        toggleFavoriteNote,
        addFlow,
        updateFlow,
        deleteFlow,
        toggleFavoriteFlow,
        loginUser,
        logoutUser,
        resetToInitialData,
        exportKnowledgeBase
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
