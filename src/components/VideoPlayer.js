//@flow

import React, {Component} from 'react'
import type {ContextRouter} from 'react-router-dom'
import type {Video} from './types'
import axios from 'axios'
import apiKey from './../youtube-api-key.json'
import './VideoDetail.css'

type State = {
    video: Video
}

class VideoPlayer extends Component<ContextRouter, State> {

    constructor(props: ContextRouter) {
        super(props)

        this.state = {
            video: null,
        }

        this.loadVideo(props.id)
    }

    loadVideo(videoId: string) {

        let videosApi = "https://www.googleapis.com/youtube/v3/videos"
        let url = videosApi + "?id=" + videoId + "&part=snippet&key=" + apiKey

        axios.get(url)
            .then((response) => {

                const items = response.data.items
                if (items.length > 0) {
                    const v = items[0]
                    const video = {
                        id: v.id,
                        title: v.snippet.title,
                        description: v.snippet.description,
                        image: v.snippet.thumbnails.medium
                    }
                    this.setState({video: video})
                }
            })
            .catch((error) => {
                console.error(error)
            })
    }

    render() {

        if(!this.state.video){
            return null
        }

        return (
            <div>
                <iframe title="video" src={`https://www.youtube.com/embed/` + this.state.video.id}
                        frameBorder="0" allowFullScreen/>

                <h2>{this.state.video.title}</h2>
                <p dangerouslySetInnerHTML={{__html: linkify(this.state.video.description)}}/>
            </div>
        )
    }
}

// TODO: improve, maybe using https://www.npmjs.com/package/react-linkify
function linkify(text) {
    return text.replace(/((http|https):[^\s]+)/g, "<a target='_blank' href=\"$1\">$1</a>")
}

export default VideoPlayer
