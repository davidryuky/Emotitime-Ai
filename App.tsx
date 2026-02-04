
import React, { useState } from 'react';
import Layout from './components/Layout';
import HomeView from './components/HomeView';
import LogForm from './components/LogForm';
import HistoryView from './components/HistoryView';
import InsightsView from './components/InsightsView';
import BreathingView from './components/BreathingView';
import PomodoroView from './components/PomodoroView';
import ZenMenuView from './components/ZenMenuView';
import FireView from './components/FireView';
import GratitudeView from './components/GratitudeView';
import Onboarding from './components/Onboarding';
import SettingsMenu from './components/SettingsMenu';
import JournalView from './components/JournalView';
import WorldEchoView from './components/WorldEchoView';
import { useRecords } from './hooks/useRecords';
import { useReminders } from './hooks/useReminders';
import { storage } from './services/storage';
import { UserProfile, ThemeId, Activity } from './types/index';

type Tab = 'home' | 'history' | 'insights' | 'log' | 'breathing' | 'pomodoro' | 'zen' | 'fire' | 'gratitude';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [profile, setProfile] = useState<UserProfile | null>(storage.getProfile());
  const [themeId, setThemeId] = useState<ThemeId>(storage.getTheme());
  const [activities, setActivities] = useState<Activity[]>(storage.getActivities());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [isWorldEchoOpen, setIsWorldEchoOpen] = useState(false);
  const [isSharing, setIsSharing] = useState(false); 
  
  const { records, localInsights, addRecord, deleteRecord } = useRecords(profile, activities);
  const { showPrompt, closePrompt } = useReminders();

  const handleProfileComplete = (newProfile: UserProfile) => {
    storage.saveProfile(newProfile);
    setProfile(newProfile);
  };

  const handleSave = (data: any) => {
    addRecord(data);
    closePrompt();
    setActiveTab('home');
  };

  const handleThemeChange = (newTheme: ThemeId) => {
    setThemeId(newTheme);
    storage.saveTheme(newTheme);
  };

  const handleActivitiesChange = (newActivities: Activity[]) => {
    setActivities(newActivities);
    storage.saveActivities(newActivities);
  };

  const handleAddActivity = (newActivity: Activity) => {
    const updated = [...activities, newActivity];
    setActivities(updated);
    storage.saveActivities(updated);
  };

  if (!profile) {
    return <Onboarding onComplete={handleProfileComplete} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeView 
            records={records} 
            insights={localInsights.patterns} 
            mentorNote={localInsights.mentorNote}
            profile={profile}
            onLogNew={() => setActiveTab('log')} 
            onTabChange={(tab) => setActiveTab(tab)}
            showReminderPrompt={showPrompt} 
            onCloseReminder={closePrompt}
            currentTheme={themeId}
            timeCapsule={localInsights.timeCapsule}
            energyLevel={localInsights.energyLevel}
            batteryAdvice={localInsights.batteryAdvice}
            activities={activities}
          />
        );
      case 'log':
        return (
          <LogForm 
            activities={activities} 
            onSave={handleSave} 
            onCancel={() => setActiveTab('home')} 
            themeId={themeId}
            onAddActivity={handleAddActivity}
          />
        );
      case 'history':
        return (
          <HistoryView 
            records={records} 
            onDelete={deleteRecord} 
            themeId={themeId} 
            activities={activities} 
            onSharingChange={setIsSharing} 
          />
        );
      case 'insights':
        return <InsightsView records={records} localInsights={localInsights} themeId={themeId} />;
      case 'zen':
        return <ZenMenuView themeId={themeId} onSelect={(tool) => setActiveTab(tool)} />;
      case 'breathing':
        return <BreathingView themeId={themeId} onExit={() => setActiveTab('zen')} />;
      case 'pomodoro':
        return <PomodoroView themeId={themeId} onExit={() => setActiveTab('zen')} />;
      case 'fire':
        return <FireView themeId={themeId} onExit={() => setActiveTab('zen')} />;
      case 'gratitude':
        return <GratitudeView themeId={themeId} onExit={() => setActiveTab('zen')} />;
      default: return null;
    }
  };

  const isZenSubView = ['breathing', 'pomodoro', 'fire', 'gratitude'].includes(activeTab);
  const shouldHideUI = isSettingsOpen || isJournalOpen || isWorldEchoOpen || isSharing || isZenSubView;

  return (
    <Layout 
      activeTab={isZenSubView ? 'zen' : activeTab as any} 
      setActiveTab={setActiveTab as any} 
      themeId={themeId} 
      hideNav={shouldHideUI || activeTab === 'log'}
      hideHeader={shouldHideUI}
      onOpenSettings={() => setIsSettingsOpen(true)}
      onOpenJournal={() => setIsJournalOpen(true)}
      onOpenWorldEcho={() => setIsWorldEchoOpen(true)}
      recentRecords={records}
    >
      <div className="pt-2">{renderContent()}</div>
      
      {isSettingsOpen && (
        <SettingsMenu 
          currentTheme={themeId}
          onThemeChange={handleThemeChange}
          onClose={() => setIsSettingsOpen(false)}
          onActivitiesChange={handleActivitiesChange}
        />
      )}

      {isJournalOpen && (
        <JournalView 
          themeId={themeId}
          onClose={() => setIsJournalOpen(false)}
        />
      )}

      {isWorldEchoOpen && (
        <WorldEchoView 
          themeId={themeId}
          onClose={() => setIsWorldEchoOpen(false)}
        />
      )}
    </Layout>
  );
};

export default App;
