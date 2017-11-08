//@flow

import React, {Component} from 'react'
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom'
import type {ContextRouter} from 'react-router-dom'
import MediaList from './components/MediaList'
import MediaPlayer from './components/MediaPlayer'
import type {AppState} from './components/types'
import MenuBar from './components/Menu/MenuBar'
import axios from 'axios'
import apiKey from './youtube-api-key.json'
import {YT_TYPE_VIDEO} from './Config'

const autoloadThreshold = 70

class App extends Component<void, AppState> {

    constructor(props: void) {
        super(props)

        this.state = {
            videos: [],
            loading: false
        }

        this.nextPageToken = null
        this.searchTerm = ''
        this.mediaType = YT_TYPE_VIDEO
        this.loading = false

        this.handleScroll = this.handleScroll.bind(this, autoloadThreshold)
    }

    handleScroll(threshold: integer) {
        const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight
        const body = document.body
        const html = document.documentElement
        const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
        const windowBottom = windowHeight + window.pageYOffset
        if (((windowBottom + threshold) >= docHeight) && !this.loading) {
            this.searchMedias()
        }
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.handleScroll)
    }

    componentDidMount() {
        window.addEventListener("scroll", this.handleScroll)
        this.searchMedias()
    }

    /** Searches videos using state.searchTerm */
    searchMedias() {

        if (apiKey.indexOf("get your Youtube API key") >= 0) {
            alert("Put a Youtube API key in youtube-api-key.json")
            return
        }

        const searchApi = "https://www.googleapis.com/youtube/v3/search"
        const queryTerm = encodeURIComponent(this.searchTerm)
        var url = searchApi + "?q=" + queryTerm + "&key=" + apiKey + "&maxResults=12&part=snippet&order=date&type=" + this.mediaType

        this.loading = true
        if (this.nextPageToken) {
            url += "&pageToken=" + this.nextPageToken
        } else {
            this.setState({loading: this.loading})
        }

        console.log('Searching medias\n with term: "' + (this.searchTerm || 'n/a') + '"\n of type: ' + this.mediaType + '\n on url: ' + url)

        axios.get(url)
            .then((response) => {

                var videos = response.data.items
                // .filter(v => v.id.kind === type)
                    .map(v => {
                            return {
                                id: v.id.videoId || v.id.channelId || v.id.playlistId,
                                title: v.snippet.title,
                                type: this.mediaType,
                                image: v.snippet.thumbnails ? (v.snippet.thumbnails.medium || v.snippet.thumbnails.default) : 'http://via.placeholder.com/120x90'
                            }
                        }
                    )

                if (this.nextPageToken) {
                    videos = this.state.videos.concat(videos)
                }

                console.log(`Rendering ${videos.length} medias`)

                this.nextPageToken = response.data.nextPageToken

                this.loading = false
                this.setState({videos: videos, loading: this.loading})

            })
            .catch((error) => {
                console.error(error)
            })
    }

    render() {

        return (
            <div className="app">
                <BrowserRouter>
                    <div>

                        <Route render={(props: ContextRouter) => (
                            <MenuBar
                                onSearch={(term: string, type: string) => {
                                    this.nextPageToken = null
                                    this.searchTerm = term
                                    this.mediaType = type
                                    this.searchMedias()
                                    props.history.push('/' + type)
                                }}
                            />
                        )}/>

                        <Switch>

                            <Route exact path='/:type?' render={() => (
                                <MediaList
                                    videos={this.state.videos}
                                    type={this.mediaType}
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

                            <Redirect from="*" to={'/' + YT_TYPE_VIDEO}/>
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
