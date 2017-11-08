//@flow

import React from 'react'
import {Link} from 'react-router-dom'
import VideoItem from './VideoItem'
import type {Video} from './types'
import './VideoList.css'
import { Helmet } from 'react-helmet'

type Props = {
    videos: Array<Video>,
    loading: boolean
}

const MediaList = function (props: Props) {

    let loadingOrVideos

    if (props.loading) {
        loadingOrVideos = <div>Loading...</div>
    } else {
        loadingOrVideos = props.videos
            .map(video => (
                <div className="item" key={video.id}>
                    <Link to={'/' + video.type + '/' + video.id}>
                        <VideoItem video={video}/>
                        <div className="video-title">{video.title}</div>
                    </Link>
                </div>
            ))
    }

    return (
        <div>
            <Helmet>
                <title>Youtube - {props.type}</title>
            </Helmet>
            <div className="video-list">{loadingOrVideos}</div>
        </div>
    )
}

export default MediaList
