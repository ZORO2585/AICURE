import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Disease {
  id: string;
  name: string;
  type: 'crop' | 'livestock';
  confidence: number;
  severity: 'low' | 'medium' | 'high';
  description: string;
  treatment: string;
  image: string;
  date: string;
  location: string;
}

interface AppContextType {
  diseases: Disease[];
  addDisease: (disease: Disease) => void;
  language: string;
  setLanguage: (lang: string) => void;
  isOnline: boolean;
  setIsOnline: (status: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [diseases, setDiseases] = useState<Disease[]>([
    {
      id: '1',
      name: 'Late Blight',
      type: 'crop',
      confidence: 92,
      severity: 'high',
      description: 'Fungal disease affecting tomato and potato crops',
      treatment: 'Apply copper-based fungicide, remove infected plants, improve air circulation',
      image: 'https://images.pexels.com/photos/4503270/pexels-photo-4503270.jpeg',
      date: '2024-01-15',
      location: 'Field A-North'
    },
    {
      id: '2',
      name: 'Mastitis',
      type: 'livestock',
      confidence: 87,
      severity: 'medium',
      description: 'Bacterial infection in dairy cattle udders',
      treatment: 'Antibiotic treatment, improved milking hygiene, isolation of infected animals',
      image: 'https://images.pexels.com/photos/422218/pexels-photo-422218.jpeg',
      date: '2024-01-12',
      location: 'Barn B-West'
    }
  ]);
  
  const [language, setLanguage] = useState('en');
  const [isOnline, setIsOnline] = useState(true);

  const addDisease = (disease: Disease) => {
    setDiseases(prev => [disease, ...prev]);
  };

  return (
    <AppContext.Provider value={{
      diseases,
      addDisease,
      language,
      setLanguage,
      isOnline,
      setIsOnline
    }}>
      {children}
    </AppContext.Provider>
  );
};