//@flow

import React, {Component} from 'react'
import type {ContextRouter} from 'react-router-dom'
import type {Video} from './types'
import axios from 'axios'
import apiKey from './../youtube-api-key.json'
import './VideoDetail.css'

type State = {
    playlist: Video
}

class PlaylistPlayer extends Component<ContextRouter, State> {

    constructor(props: ContextRouter) {
        super(props)

        this.state = {
            playlist: null,
        }

        this.loadPlaylist(props.id)

    }

    loadPlaylist(playlistId: string) {

        let playlistApi = "https://www.googleapis.com/youtube/v3/playlists"
        let url = playlistApi + "?id=" + playlistId + "&part=snippet&key=" + apiKey

        axios.get(url)
            .then((response) => {

                const items = response.data.items
                if (items.length > 0) {
                    const v = items[0]
                    const playlist = {
                        id: v.id,
                        title: v.snippet.title,
                        description: v.snippet.description,
                        image: v.snippet.thumbnails.medium
                    }
                    this.setState({playlist: playlist})
                    this.props.onLoad(playlist)
                }
            })
            .catch((error) => {
                console.error(error)
            })
    }

    render() {

        if(!this.state.playlist){
            return null
        }

        return (
            <div>
                <iframe title="video" src={`https://www.youtube.com/embed/?listType=playlist&list=` + this.state.playlist.id}
                        frameBorder="0" allowFullScreen/>

                <h2>{this.state.playlist.title}</h2>
                <p dangerouslySetInnerHTML={{__html: linkify(this.state.playlist.description)}}/>
            </div>
        )
    }
}


// TODO: improve, maybe using https://www.npmjs.com/package/react-linkify
function linkify(text) {
    return text.replace(/((http|https):[^\s]+)/g, "<a target='_blank' href=\"$1\">$1</a>")
}

export default PlaylistPlayer
