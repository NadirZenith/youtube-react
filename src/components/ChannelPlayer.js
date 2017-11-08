//@flow

import React, {Component} from 'react'
import type {ContextRouter} from 'react-router-dom'
import type {Video} from './types'
import axios from 'axios'
import apiKey from './../youtube-api-key.json'
import './VideoDetail.css'

type State = {
    channel: Video
}

class ChannelPlayer extends Component<ContextRouter, State> {

    constructor(props: ContextRouter) {
        super(props)

        this.state = {
            channel: null,
        }

        this.loadChannel(props.id)
    }

    loadChannel(channelId: string) {

        let channelApi = "https://www.googleapis.com/youtube/v3/channels"
        let url = channelApi + "?id=" + channelId + "&part=snippet,contentDetails&key=" + apiKey

        axios.get(url)
            .then((response) => {

                const items = response.data.items
                if (items.length > 0) {
                    const v = items[0]
                    const media = {
                        id: v.id,
                        playlistId: v.contentDetails.relatedPlaylists.uploads,
                        title: v.snippet.title,
                        description: v.snippet.description,
                        image: v.snippet.thumbnails.medium
                    }
                    this.setState({channel: media})
                    this.props.onLoad(media)
                }
            })
            .catch((error) => {
                console.error(error)
            })
    }

    render() {

        if (!this.state.channel) {
            return null
        }

        return (
            <div>
                {/*<iframe src="http://www.youtube.com/embed/?listType=user_uploads&list=YOURCHANNELNAME" width="480" height="400"></iframe>*/}
                {/*<iframe title="video" src={`https://www.youtube.com/embed/?listType=user_uploads&list=` + this.state.video.playlistId}*/}
                <iframe title="video"
                        src={`https://www.youtube.com/embed/?listType=playlist&list=` + this.state.channel.playlistId}
                        frameBorder="0" allowFullScreen/>

                <h2>{this.state.channel.title}</h2>
                <p dangerouslySetInnerHTML={{__html: linkify(this.state.channel.description)}}/>
            </div>
        )
    }
}


// TODO: improve, maybe using https://www.npmjs.com/package/react-linkify
function linkify(text) {
    return text.replace(/((http|https):[^\s]+)/g, "<a target='_blank' href=\"$1\">$1</a>")
}

export default ChannelPlayer
