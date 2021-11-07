import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import OfertaTrener from "../components/Home/Home_offer_trainer"
import HomeCarousel from "../components/Home/Home_carousel";
import OfertaUser from "../components/Home/Home_offer_user";
import {Link} from "react-router-dom";
import CookieCon from "../components/Home/CookieCon";
import HomeWelcome from "../components/Home/Home_welcome";
import HomeOffer from "../components/Home/Home_offer";

function Home() {
    return (
        <div className="home">

            <div className="container-fluid m-0 p-0">
                <HomeWelcome></HomeWelcome>

            </div>

            <div className="container text-center">
                <HomeCarousel></HomeCarousel>
            </div>

            <div className="container text-center">

                <HomeOffer></HomeOffer>

                {/*/!* user *!/*/}
                <OfertaUser></OfertaUser>

                {/*/!* trener *!/*/}
                <h1 style={{"fontSize": "5vw"}} className="display-1 pb-4 pt-4">Jesteś trenerem?</h1>
                <h4 style={{"fontSize": "2vw"}} className="font-weight-light pb-4">Dołącz do naszego zespołu!</h4>
                <OfertaTrener></OfertaTrener>
                <Link className="btn btn-lg" to="/register">Dołącz</Link>
            </div>

            <div className="container">

                <div className="row">
                    <div className="col m-5 text-center font-weight-light">
                        Lorem ipsum pipsum
                    </div>
                </div>

            </div>

            <CookieCon></CookieCon>

        </div>
    );
}

export default Home;
