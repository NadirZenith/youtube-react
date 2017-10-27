//@flow

import React, {Component} from 'react'
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom'
import type {ContextRouter} from 'react-router-dom'
import VideoList from './components/VideoList'
import MediaPlayer from './components/MediaPlayer'
import type {Video} from './components/types'
import MenuBar from './components/Menu/MenuBar'
import axios from 'axios'
import apiKey from './youtube-api-key.json'
import {YT_TYPE_VIDEO} from './Config'

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
                searchTerm: ''
            },
        }
    }

    componentDidMount() {
        this.searchMedias('', YT_TYPE_VIDEO)
    }

    /** Searches videos using state.searchTerm */
    searchMedias(searchTerm: string, type: string) {

        if (apiKey.indexOf("get your Youtube API key") >= 0) {
            alert("Put a Youtube API key in youtube-api-key.json")
            return
        }

        // type = type.substring(0, type.indexOf("#")); // before char
        // type = type.substring(type.indexOf("#") + 1) // after char

        console.log("Searching videos: " + searchTerm + " of type: " + type)
        this.setState({loading: true})

        const searchApi = "https://www.googleapis.com/youtube/v3/search"
        const queryTerm = encodeURIComponent(searchTerm)
        const url = searchApi + "?q=" + queryTerm + "&key=" + apiKey + "&maxResults=50&part=snippet&order=date&type=" + type

        axios.get(url)
            .then((response) => {

                const videos = response.data.items
                // .filter(v => v.id.kind === type)
                    .map(v => {
                            return {
                                id: v.id.videoId || v.id.channelId || v.id.playlistId,
                                title: v.snippet.title,
                                type: type,
                                image: v.snippet.thumbnails ? (v.snippet.thumbnails.medium || v.snippet.thumbnails.default) : 'http://via.placeholder.com/120x90'
                            }
                        }
                    )

                console.log(`Displaying ${videos.length} videos`)

                this.setState({videos: videos, loading: false, filter: {searchTerm: searchTerm}})

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
                                    this.searchMedias(value, type)
                                    props.history.push('/' + type)
                                }}
                            />
                        )}/>

                        <Switch>

                            <Route exact path='/:type?' render={() => (
                                <VideoList
                                    videos={this.state.videos}
                                    loading={this.state.loading}
                                />
                            )}/>

                            <Route exact path='/:type/:id' render={(props: ContextRouter) => {
                                // use {...props} to pass contextRouter to component
                                return <MediaPlayer
                                    {...props}
                                    id={props.match.params.id}
                                    type={props.match.params.type}
                                    loading={this.state.loading}
                                />
                            }}/>
                            {/*<Route path='/:type/:id' component={MediaPlayer}/>*/}

                            <Redirect from="*" to="/video"/>
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
