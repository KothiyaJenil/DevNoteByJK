import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { CommandPalette } from './components/layout/CommandPalette';
import { ToastContainer } from './components/common/ToastContainer';

// Views & Screens
import { LandingPage } from './components/landing/LandingPage';
import { Login } from './components/auth/Login';
import { SignUp } from './components/auth/SignUp';
import { DashboardView } from './views/DashboardView';
import { NotesList } from './components/notes/NotesList';
import { NoteEditor } from './components/notes/NoteEditor';
import { NoteDetail } from './components/notes/NoteDetail';
import { FlowsList } from './components/flows/FlowsList';
import { FlowEditor } from './components/flows/FlowEditor';
import { FlowDetail } from './components/flows/FlowDetail';
import { FavoritesView } from './views/FavoritesView';
import { TagsView } from './views/TagsView';
import { SettingsView } from './views/SettingsView';

const MainContentRouter: React.FC = () => {
  const { activeView, activeNoteId, activeFlowId } = useApp();

  // Non-authenticated layout screens
  if (activeView === 'landing') return <LandingPage />;
  if (activeView === 'login') return <Login />;
  if (activeView === 'signup') return <SignUp />;

  // Authenticated workspace shell
  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      <Navbar />

      <div className="flex-1 flex w-full">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto max-w-full pb-24 md:pb-8">
          {activeView === 'dashboard' && <DashboardView />}
          {activeView === 'notes-list' && <NotesList />}
          {activeView === 'create-note' && <NoteEditor mode="create" />}
          {activeView === 'edit-note' && <NoteEditor mode="edit" noteId={activeNoteId} />}
          {activeView === 'view-note' && <NoteDetail noteId={activeNoteId} />}
          {activeView === 'flows-list' && <FlowsList />}
          {activeView === 'create-flow' && <FlowEditor mode="create" />}
          {activeView === 'edit-flow' && <FlowEditor mode="edit" flowId={activeFlowId} />}
          {activeView === 'view-flow' && <FlowDetail flowId={activeFlowId} />}
          {activeView === 'favorites' && <FavoritesView />}
          {activeView === 'tags' && <TagsView />}
          {activeView === 'settings' && <SettingsView />}
        </main>
      </div>

      <MobileNav />
      <CommandPalette />
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContentRouter />
    </AppProvider>
  );
}

export default App;
