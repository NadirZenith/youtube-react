//@flow

import React from 'react'
import {Link} from 'react-router-dom'
import SearchFormRef from './SearchForm/SearchFormRef'
import './MenuBar.css'


type Props = {
    onSearch: (value: string, type: string) => void
};


/**
 * Menu bar with a search form that
 * calls onSearch(value) when search is performed.
 */
const MenuBar = (props: Props) => {

    return (
        <div className="menu-bar">
            <Link to={'/'}>
                <img className="logo"
                     src="https://www.youtube.com/yt/about/media/images/brand-resources/logos/YouTube-logo-full_color_light.svg"
                     alt="logo"/>
            </Link>
            <SearchFormRef
                placeholder="Search videos"
                onSend={(value: string, type: string) => props.onSearch(value, type)}
            />

        </div>
    )
}

export default MenuBar
