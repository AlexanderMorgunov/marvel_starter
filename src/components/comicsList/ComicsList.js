import './comicsList.scss';
import { useEffect } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

const ComicsList = () => {

    const {loading, error, getAllComics} = useMarvelService();

    const [charList, setCharList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [comicsEnded, setComicsEnded] = useState(false);
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        onRequest();
    },[]);

    const onRequest = ((offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllComics(offset)
        .then(onCharListLoaded);
        setOffset(offset => offset+8);
    });
    
    const onCharListLoaded = (newCharList) => {
        let ended = false;
        if(newCharList.length < 8) {
        ended = true;
        }

            setCharList([...charList, ...newCharList]);
            setNewItemLoading(false);
            setComicsEnded(ended);

    }


    function renderItems(arr) {
        const items =  arr.map((item, i) => {
            
            return (

                <li className="comics__item" key={i}>
                    <Link to={`/comics/${item.id}`}>
                    <img src={item.thumbnail} alt={item.title} className="comics__item-img"/>
                    <div className="comics__item-name">{item.title}</div>
                    <div className="comics__item-price">{item.price}</div>
                    </Link>
                </li>
            )
        });
        return (
            <ul className="comics__grid">
                {items}
            </ul>
        )
    }

    const items = renderItems(charList) ? renderItems(charList) : loading;
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading? <Spinner/> : null;

    return (
        <div className="comics__list">
            {errorMessage}
            {spinner}
            {items}
            <button className="button button__main button__long" onClick={()=> onRequest(offset)}
            disabled={newItemLoading} 
            style={{'display': comicsEnded ? 'none' : 'block'}}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;