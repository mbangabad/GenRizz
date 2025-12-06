import Layout from "./Layout.jsx";

import Leaderboards from "./Leaderboards";

import Profile from "./Profile";

import Challenges from "./Challenges";

import Social from "./Social";

import Landing from "./Landing";

import Premium from "./Premium";

import Onboarding from "./Onboarding";

import Achievements from "./Achievements";

import Challenge from "./Challenge";

import FamilyChallenge from "./FamilyChallenge";

import Gameplay from "./Gameplay";

import Roadmap from "./Roadmap";

import PersonalityGameplay from "./PersonalityGameplay";

import OpinionGameplay from "./OpinionGameplay";

import Help from "./Help";

import Shop from "./Shop";

import Squads from "./Squads";

import CreatorStudio from "./CreatorStudio";

import Admin from "./Admin";

import TestDashboard from "./TestDashboard";

import WorldMap from "./WorldMap";

import BattleArena from "./BattleArena";

import StatsDeepDive from "./StatsDeepDive";

import Notifications from "./Notifications";

import Blueprint from "./Blueprint";

import Home from "./Home";

import Settings from "./Settings";
import NotFound from "./NotFound";
import Login from "./Login";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Leaderboards: Leaderboards,
    
    Profile: Profile,
    
    Challenges: Challenges,
    
    Social: Social,
    
    Landing: Landing,
    
    Premium: Premium,
    
    Onboarding: Onboarding,
    
    Achievements: Achievements,
    
    Challenge: Challenge,
    
    FamilyChallenge: FamilyChallenge,
    
    Gameplay: Gameplay,
    
    Roadmap: Roadmap,
    
    PersonalityGameplay: PersonalityGameplay,
    
    OpinionGameplay: OpinionGameplay,
    
    Help: Help,
    
    Shop: Shop,
    
    Squads: Squads,
    
    CreatorStudio: CreatorStudio,
    
    Admin: Admin,
    
    TestDashboard: TestDashboard,
    
    WorldMap: WorldMap,
    
    BattleArena: BattleArena,
    
    StatsDeepDive: StatsDeepDive,
    
    Notifications: Notifications,
    
    Blueprint: Blueprint,
    
    Home: Home,
    
    Settings: Settings,
    
    Login: Login,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <>
            {/* Login page bypasses Layout */}
            <Routes>
                <Route path="/login" element={<Login />} />
            </Routes>
            
            {/* All other pages use Layout */}
            {location.pathname !== '/login' && (
                <Layout currentPageName={currentPage}>
                    <Routes>            
                        <Route path="/" element={<Leaderboards />} />
                        <Route path="/Leaderboards" element={<Leaderboards />} />
                        <Route path="/Profile" element={<Profile />} />
                        <Route path="/Challenges" element={<Challenges />} />
                        <Route path="/Social" element={<Social />} />
                        <Route path="/Landing" element={<Landing />} />
                        <Route path="/Premium" element={<Premium />} />
                        <Route path="/Onboarding" element={<Onboarding />} />
                        <Route path="/Achievements" element={<Achievements />} />
                        <Route path="/Challenge" element={<Challenge />} />
                        <Route path="/FamilyChallenge" element={<FamilyChallenge />} />
                        <Route path="/Gameplay" element={<Gameplay />} />
                        <Route path="/Roadmap" element={<Roadmap />} />
                        <Route path="/PersonalityGameplay" element={<PersonalityGameplay />} />
                        <Route path="/OpinionGameplay" element={<OpinionGameplay />} />
                        <Route path="/Help" element={<Help />} />
                        <Route path="/Shop" element={<Shop />} />
                        <Route path="/Squads" element={<Squads />} />
                        <Route path="/CreatorStudio" element={<CreatorStudio />} />
                        <Route path="/Admin" element={<Admin />} />
                        <Route path="/TestDashboard" element={<TestDashboard />} />
                        <Route path="/WorldMap" element={<WorldMap />} />
                        <Route path="/BattleArena" element={<BattleArena />} />
                        <Route path="/StatsDeepDive" element={<StatsDeepDive />} />
                        <Route path="/Notifications" element={<Notifications />} />
                        <Route path="/Blueprint" element={<Blueprint />} />
                        <Route path="/Home" element={<Home />} />
                        <Route path="/Settings" element={<Settings />} />
                        {/* 404 Route - Must be last */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Layout>
            )}
        </>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}