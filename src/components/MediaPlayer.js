//@flow

import React, {Component} from 'react'
import type {ContextRouter} from 'react-router-dom'
import type {Video} from './types'
import axios from 'axios'
import apiKey from './../youtube-api-key.json'
import './VideoDetail.css'
import {YT_TYPE_PLAYLIST, YT_TYPE_VIDEO} from "../Config";
import VideoPlayer from "./VideoPlayer";

type State = {
    video: Video,
    loading: boolean
};

class MediaPlayer extends Component<ContextRouter, State> {

    constructor(props: ContextRouter) {
        super(props)

        console.log(props)
        this.state = {
            type: this.props.match.params.type,
            id: this.props.match.params.id,
            loading: true
        }

        // this.loadVideo(this.props.match.params.id)
    }

    render() {

        let loadingOrData;

        if (this.state.loading) {
            loadingOrData = "loading data..."
        } else {
            loadingOrData = (
                <div>
                    <h2>{this.state.video.title}</h2>
                    <p dangerouslySetInnerHTML={{__html: linkify(this.state.video.description)}}/>
                </div>
            )
        }
        let player;
            console.log(this)
        if (this.state.type === YT_TYPE_VIDEO){
            player = (
                <VideoPlayer id={this.state.id} />
            )
                {/*<iframe title="video" src={`https://www.youtube.com/embed/` + this.props.match.params.id}*/}
                        {/*frameBorder="0" allowFullScreen/>*/}
        } else{
            alert('hi')
        }
        {/*<VideoPlayer/>*/}
        // if(this.p)

        return (
            <div className="video-detail">
                <a href="" onClick={this.props.history.goBack}>&larr; Go Back</a>
                {player}

                <div>{loadingOrData}</div>
            </div>
        )
    }
}

// TODO: improve, maybe using https://www.npmjs.com/package/react-linkify
function linkify(text) {
    return text.replace(/((http|https):[^\s]+)/g, "<a target='_blank' href=\"$1\">$1</a>")
}

export default MediaPlayer
