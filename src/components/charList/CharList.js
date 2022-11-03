import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';
import {TransitionGroup, CSSTransition} from'react-transition-group';
import './charList.scss';

const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    
    const {loading, error, getAllCharacters} = useMarvelService();

    const myRef = useRef([]);

    useEffect(() => {
        onRequest(offset, true);
    }, [])


    const focusElement = (i) => {

            myRef.current.map(elem => {
                elem.classList.remove('char__item_selected');
                return elem;
            })

            myRef.current[i].classList.add('char__item_selected');
            myRef.current[i].focus();
    }

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllCharacters(offset)
            .then(onCharListLoaded)
    }

    const onCharListLoaded = (newCharList) => {
        let ended = false;
        if(newCharList.length < 9) {
            ended = true
        }
            setCharList([...charList, ...newCharList]);
            setNewItemLoading(false);
            setOffset(offset => offset + 9);
            setCharEnded(ended);

    }

    function renderItems(arr) {
        const items =  arr.map((item,i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            
            return (
                    <CSSTransition
                        key={item.id}
                        timeout={500}
                        classNames="char__item">

                        <li 
                            className="char__item"
                            key={item.id}
                            tabIndex={0}
                            ref={el => myRef.current[i] = el}
                            onClick={(e) => {
                                props.onCharSelected(item.id)
                                focusElement(i)
                            }}
                            onKeyPress={(e) => {
                                if (e.key === ' ' || e.key === "Enter") {
                                    props.onCharSelected(item.id);
                                    focusElement(i);
                                }
                            }}
                            >

                                <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                                <div className="char__name">{item.name}</div>
                        </li>
                    </CSSTransition>
            )
        });
        return (
            <ul className="char__grid">
            <TransitionGroup component={null}>
                {items}
            </TransitionGroup>
            </ul>
            
        )
    }

    const items = renderItems(charList);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading? <Spinner/> : null;
    

    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {items}
            <button 
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    onClick={() => onRequest(offset)}
                    style={{'display': charEnded ? 'none' : 'block'}}
                    >
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;