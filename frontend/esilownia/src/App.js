import React from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Header from "./components/Template/Header";
import Footer from "./components/Template/Footer";
import Home from "./Views/Home";
import Login from "./Views/Login";
import PasswordReset from "./Views/Password_reset";
import Register from "./Views/Register";
import Cadre from "./Views/Cadre";
import TrainingGroups from "./Views/TrainingGroups";
import Diet from "./Views/Diet";
import AboutUs from "./Views/About_us";
import PriceList from "./Views/Price_list";
import Account from "./Views/Account";
import Dashboard from "./Views/Dashboard";
import AccountEdit from "./Views/Account_edit";
import ModeratorPanel from "./Views/Moderator_panel";
import TrainerSpace from "./Views/TrainingGroups_TrainerSpace";
import Training from "./Views/Training";
import TreningJitsi from "./Views/Trening_Jitsi";
import GroupOfferDetails from "./Views/Group_offer_details";
import Chat from "./Views/Chat";
import Training_trainer from "./Views/Training_trainer";
import Payment_history from "./Views/Payment_history";
import Forum from "./Views/Forum";
import {DieticianSpace, DietMeetings, ForumTopicPosts} from "./Views/Index";
import DietOfferDetails from "./Views/Diet_offer_details";
import DietMeeting_Jitsi from "./Views/DietMeeting_Jitsi";
import DieticianDiet from "./components/Diet/Dietetician/DieticianDiet";
import Report from "./Views/Report";
import UserProfile from "./Views/UserProfile";

function App() {
    return (
        <div className="App">
            <Router>
                <Header/>
                <Switch>
                    <Route path="/o_nas" exact component={() => <AboutUs/>}/>
                    <Route path="/cennik" exact component={() => <PriceList/>}/>
                    <Route path="/" exact component={() => <Home/>}/>
                    <Route path="/kadra" exact component={() => <Cadre/>}/>
                    <Route path="/treningi" exact component={() => <TrainingGroups/>}/>
                    <Route path="/dieta" exact component={() => <Diet/>}/>
                    <Route path="/login" exact component={() => <Login/>}/>
                    <Route path="/password_reset" exact component={() => <PasswordReset/>}/>
                    <Route path="/register" exact component={() => <Register/>}/>
                    <Route path="/konto" exact component={() => <Account/>}/>
                    <Route path="/konto_edycja" exact component={() => <AccountEdit/>}/>
                    <Route path="/dashboard" exact component={() => <Dashboard/>}/>
                    <Route path="/cockpit" exact component={() => <ModeratorPanel/>}/>
                    <Route path="/strefa_trenera" exact component={() => <TrainerSpace/>}/>
                    <Route path="/strefa_dietetyka" exact component={() => <DieticianSpace/>}/>
                    <Route path="/strefa_trenera_treningi" exact component={() => <Training_trainer/>}/>
                    <Route path="/strefa_dietetyka_dieta" exact component={() => <DieticianDiet/>}/>
                    <Route path="/grupa_treningi" exact component={() => <Training/>}/>
                    <Route path="/grupa_diety" exact component={() => <DietMeetings/>}/>
                    <Route path="/trening" exact component={() => <TreningJitsi/>}/>
                    <Route path="/spotkanie" exact component={() => <DietMeeting_Jitsi/>}/>
                    <Route path="/grupa_szczegóły" exact component={() => <GroupOfferDetails/>}/>
                    <Route path="/dieta_szczegóły" exact component={() => <DietOfferDetails/>}/>
                    <Route path="/wiadomości" exact component={() => <Chat/>}/>
                    <Route path="/historia_płatności" exact component={() => <Payment_history/>}/>
                    <Route path="/forum" exact component={() => <Forum/>}/>
                    <Route path="/forum_temat" exact component={() => <ForumTopicPosts/>}/>
                    <Route path="/zgłoszenia" exact component={() => <Report/>}/>
                    <Route path="/profil_uzytkownika" exact component={() => <UserProfile/>}/>
                </Switch>
                <Footer/>
            </Router>
        </div>
    );
}

export default App;
