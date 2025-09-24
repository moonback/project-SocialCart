import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BottomNav } from './BottomNav';
import { TopBar } from './TopBar';
import { DeployableStoriesBar } from './DeployableStoriesBar';
import { CreateStoryModal } from './CreateStoryModal';

export function Layout() {
  const [isStoriesOpen, setIsStoriesOpen] = useState(false);
  const [showCreateStoryModal, setShowCreateStoryModal] = useState(false);
  const [storiesRefreshTrigger, setStoriesRefreshTrigger] = useState(0);

  const handleToggleStories = () => {
    setIsStoriesOpen(!isStoriesOpen);
  };

  const handleCreateStory = () => {
    setShowCreateStoryModal(true);
    setIsStoriesOpen(false); // Fermer la StoriesBar quand on ouvre le modal
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-blue-50 to-surface-50 flex flex-col relative overflow-hidden">
      {/* Background decoration - Design minimaliste */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl -translate-y-48 translate-x-48 animate-float" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl translate-y-48 -translate-x-48 animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-gradient-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <TopBar 
        onToggleStories={handleToggleStories}
        isStoriesOpen={isStoriesOpen}
      />
      
      {/* StoriesBar déployable */}
      <DeployableStoriesBar 
        isOpen={isStoriesOpen}
        onClose={() => setIsStoriesOpen(false)}
        onCreateStory={handleCreateStory}
        refreshTrigger={storiesRefreshTrigger}
      />
      
      <motion.main 
        className={`flex-1 main-content-fixed relative z-10 transition-all duration-300 ${
          isStoriesOpen ? 'pt-32' : 'pt-16'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Outlet />
      </motion.main>
      
      <BottomNav />

      {/* Modal de création de story */}
      <CreateStoryModal
        isOpen={showCreateStoryModal}
        onClose={() => setShowCreateStoryModal(false)}
        onStoryCreated={() => {
          setShowCreateStoryModal(false);
          // Déclencher le refresh des stories
          setStoriesRefreshTrigger(prev => prev + 1);
        }}
      />
    </div>
  );
}