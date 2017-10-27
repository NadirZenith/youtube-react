//@flow

import React, {Component} from 'react'
import type {ContextRouter} from 'react-router-dom'
import './VideoDetail.css'
import {YT_TYPE_PLAYLIST, YT_TYPE_VIDEO} from "../Config";
import VideoPlayer from "./VideoPlayer";
import PlaylistPlayer from "./PlaylistPlayer";
import ChannelPlayer from "./ChannelPlayer";

type State = {
    loading: boolean
};

class MediaPlayer extends Component<ContextRouter, State> {

    constructor(props: ContextRouter) {
        super(props)

        this.state = {
            loading: true
        }
    }

    componentDidMount() {
        this.setState({loading: false})
    }

    render() {
        let player;

        if (this.state.loading) {
            player = "loading data..."
        } else {

            if (this.props.type === YT_TYPE_VIDEO) {
                player = ( <VideoPlayer id={this.props.id}/> )

            } else if (this.props.type === YT_TYPE_PLAYLIST) {
                player = ( <PlaylistPlayer id={this.props.id}/> )

            } else {
                // console.log('implementing')
                // return null
                player = ( <ChannelPlayer id={this.props.id}/> )

            }
        }

        return (
            <div className="media-detail">
                <a href="" onClick={this.props.history.goBack}>&larr; Go Back</a>
                {player}
            </div>
        )
    }
}

export default MediaPlayer
