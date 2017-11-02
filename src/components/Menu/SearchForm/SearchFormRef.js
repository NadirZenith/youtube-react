//@flow

import React, {Component} from 'react'
import './SearchForm.css'
import {YT_TYPE_VIDEO, YT_TYPE_CHANNEL, YT_TYPE_PLAYLIST} from './../../../Config'
import type {ContextRouter} from 'react-router-dom'


type Props = {
    placeholder: string,
    onSend: (value: string) => void
}

/**
 * Form with an <input> and a <button> that
 * calls onSend(inputValue) when clicked.
 *
 * This class uses refs to get the form fields (just aninput here)
 */
class SearchFormRef extends Component<ContextRouter, Props> {
// class SearchFormRef extends Component<Props, void> {
// class VideoDetail extends Component<ContextRouter, State> {

    form: ?HTMLFormElement

    constructor(props: ContextRouter) {
    // constructor(props: Props) {
        super(props)

        // this.form = null // This is not necessary
    }

    sendValue() {
        // https://flow.org/en/docs/types/maybe/
        // I could use (this.form != null) but ESLint complains
        if (this.form instanceof HTMLFormElement) {
            const input = this.form.querySelector("[name=text]")
            const videoType = this.form.querySelector("[name=filter_video_type]:checked")
            if (input instanceof HTMLInputElement) {
                this.props.onSend(input.value, videoType.value)
            }
        }
    }

    render() {

        return (
            // Store form using refs -- https://flow.org/en/docs/react/refs/
            <form className="search-form"
                  onSubmit={(event: Event) => {
                      event.preventDefault()
                      this.sendValue()
                  }}
                  ref={form => this.form = form}>
                <input name="text" placeholder={this.props.placeholder}/>
                <div className="filter_video_type">
                    <label>
                        <input type="radio" name="filter_video_type" value={YT_TYPE_VIDEO}
                               onChange={(e: Event) => this.sendValue()}
                               defaultChecked
                        />video
                    </label><br/>
                    <label>
                        <input type="radio" name="filter_video_type" value={YT_TYPE_PLAYLIST}
                               onChange={(e: Event) => this.sendValue()}
                        />playlists
                    </label><br/>
                    <label>
                        <input type="radio" name="filter_video_type" value={YT_TYPE_CHANNEL}
                               onChange={(e: Event) => this.sendValue()}
                        />channel
                    </label>
                </div>
                <button>Search</button>
            </form>
        )
    }
}

export default SearchFormRef
