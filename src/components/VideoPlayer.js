//@flow

import React, {Component} from 'react'
import type {ContextRouter} from 'react-router-dom'
import type {Video} from './types'
import axios from 'axios'
import apiKey from './../youtube-api-key.json'
import './VideoDetail.css'
import {YT_TYPE_PLAYLIST, YT_TYPE_VIDEO} from "../Config";

type State = {
    video: Video,
    loading: boolean
};

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
                        id: v.id.videoId,
                        title: v.snippet.title,
                        description: v.snippet.description,
                        image: v.snippet.thumbnails.medium
                    }
                    this.setState({video: video, loading: false})
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    render() {

        return (
            <div className="video-detail">
            <iframe title="video" src={`https://www.youtube.com/embed/` + this.state.video.id}
                    frameBorder="0" allowFullScreen/>
            </div>
        )
    }
}


export default VideoPlayer
