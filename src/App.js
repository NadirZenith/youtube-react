//@flow

import React, {Component} from 'react'
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom'
import type {ContextRouter} from 'react-router-dom'
import VideoList from './components/VideoList'
import VideoPlayer from './components/VideoDetail'
import type {Video} from './components/types'
import MenuBar from './components/Menu/MenuBar'
import axios from 'axios'
import apiKey from './youtube-api-key.json'
import {YT_TYPE_VIDEO, YT_TYPE_CHANNEL} from './Config'

type State = {
    videos: Array<Video>,
    loading: boolean,
    filter: Object
};

class App extends Component<void, State> {

    constructor(props: void) {
        super(props)

        this.state = {
            videos: [],
            loading: false,
            filter: {
                video_type: YT_TYPE_VIDEO
            },
        }
    }

    /** Searches videos using state.searchTerm */
    searchVideos(searchTerm: string, type: string) {

        if (apiKey.indexOf("get your Youtube API key") >= 0) {
            alert("Put a Youtube API key in youtube-api-key.json")
            return
        }

        console.log("Searching videos: " + searchTerm + " of type: " + type)
        this.setState({loading: true, searchTerm: searchTerm})

        const searchApi = "https://www.googleapis.com/youtube/v3/search"
        const queryTerm = encodeURIComponent(searchTerm)
        const url = searchApi + "?q=" + queryTerm + "&key=" + apiKey + "&maxResults=50&part=snippet"

        axios.get(url)
            .then((response) => {

                const videos = response.data.items
                    .filter(v => v.id.kind === type)
                    .map(v => ({
                        id: v.id.videoId,
                        title: v.snippet.title,
                        image: v.snippet.thumbnails.medium
                    }))

                console.log(`Displaying ${videos.length} videos`)

                this.setState({videos: videos, loading: false})

            })
            .catch((error) => {
                console.error(error);
            });
    }

    render() {

        return (
            <div className="app">
                <BrowserRouter>
                    <div>

                        <Route render={(props: ContextRouter) => (
                            <MenuBar
                                onSearch={(value: string, type: string) => {
                                    this.searchVideos(value, type)
                                    props.history.push('/')
                                }}
                            />
                        )}/>

                        <Switch>

                            <Route exact path='/' render={() => (
                                <VideoList videos={this.state.videos} loading={this.state.loading}/>
                            )}/>

                            <Route path='/detail/:id' component={VideoPlayer}/>

                            <Redirect from="*" to="/"/>
                            {/* remove the Redirect to display the "not found" route */}
                            <Route component={() => <h1>Page not found, sorry!</h1>}/>

                        </Switch>

                    </div>
                </BrowserRouter>
            </div>
        )
    }
}

export default App
