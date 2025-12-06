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
        <Routes>
            {/* Login page - no Layout wrapper */}
            <Route path="/login" element={<Login />} />
            
            {/* All other pages use Layout */}
            <Route path="/" element={<Layout currentPageName="Leaderboards"><Leaderboards /></Layout>} />
            <Route path="/Leaderboards" element={<Layout currentPageName={currentPage}><Leaderboards /></Layout>} />
            <Route path="/Profile" element={<Layout currentPageName={currentPage}><Profile /></Layout>} />
            <Route path="/Challenges" element={<Layout currentPageName={currentPage}><Challenges /></Layout>} />
            <Route path="/Social" element={<Layout currentPageName={currentPage}><Social /></Layout>} />
            <Route path="/Landing" element={<Layout currentPageName={currentPage}><Landing /></Layout>} />
            <Route path="/Premium" element={<Layout currentPageName={currentPage}><Premium /></Layout>} />
            <Route path="/Onboarding" element={<Layout currentPageName={currentPage}><Onboarding /></Layout>} />
            <Route path="/Achievements" element={<Layout currentPageName={currentPage}><Achievements /></Layout>} />
            <Route path="/Challenge" element={<Layout currentPageName={currentPage}><Challenge /></Layout>} />
            <Route path="/FamilyChallenge" element={<Layout currentPageName={currentPage}><FamilyChallenge /></Layout>} />
            <Route path="/Gameplay" element={<Layout currentPageName={currentPage}><Gameplay /></Layout>} />
            <Route path="/Roadmap" element={<Layout currentPageName={currentPage}><Roadmap /></Layout>} />
            <Route path="/PersonalityGameplay" element={<Layout currentPageName={currentPage}><PersonalityGameplay /></Layout>} />
            <Route path="/OpinionGameplay" element={<Layout currentPageName={currentPage}><OpinionGameplay /></Layout>} />
            <Route path="/Help" element={<Layout currentPageName={currentPage}><Help /></Layout>} />
            <Route path="/Shop" element={<Layout currentPageName={currentPage}><Shop /></Layout>} />
            <Route path="/Squads" element={<Layout currentPageName={currentPage}><Squads /></Layout>} />
            <Route path="/CreatorStudio" element={<Layout currentPageName={currentPage}><CreatorStudio /></Layout>} />
            <Route path="/Admin" element={<Layout currentPageName={currentPage}><Admin /></Layout>} />
            <Route path="/TestDashboard" element={<Layout currentPageName={currentPage}><TestDashboard /></Layout>} />
            <Route path="/WorldMap" element={<Layout currentPageName={currentPage}><WorldMap /></Layout>} />
            <Route path="/BattleArena" element={<Layout currentPageName={currentPage}><BattleArena /></Layout>} />
            <Route path="/StatsDeepDive" element={<Layout currentPageName={currentPage}><StatsDeepDive /></Layout>} />
            <Route path="/Notifications" element={<Layout currentPageName={currentPage}><Notifications /></Layout>} />
            <Route path="/Blueprint" element={<Layout currentPageName={currentPage}><Blueprint /></Layout>} />
            <Route path="/Home" element={<Layout currentPageName={currentPage}><Home /></Layout>} />
            <Route path="/Settings" element={<Layout currentPageName={currentPage}><Settings /></Layout>} />
            {/* 404 Route - Must be last */}
            <Route path="*" element={<Layout currentPageName={currentPage}><NotFound /></Layout>} />
        </Routes>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}