import { useState } from "react";
import CharInfo from "../charInfo/CharInfo";
import CharList from "../charList/CharList";
import RandomChar from "../randomChar/RandomChar";
import ErrorBoundary from "../errorBoundary/ErrorBoundary";
import decoration from '../../resources/img/vision.png';

const MainPage = () => {

    const [selectedChar, setSelectedChar] = useState(null);

    const onCharSelected = (id) => {
        setSelectedChar(id)
    }

    return(
        <>
        <ErrorBoundary>
            <RandomChar/>
        </ErrorBoundary>
            <div className="char__content">
        <ErrorBoundary>
                <CharList onCharSelected={onCharSelected}/>
        </ErrorBoundary>
        <ErrorBoundary>
            <CharInfo charId={selectedChar}/>
        </ErrorBoundary>
            </div>
        <img className="bg-decoration" src={decoration} alt="vision"/>
        </>
    )
}

export default MainPage;