import React from 'react'

export default class extends React.Component {
  constructor(props) {
    super(props)

    // State handler for "LIVE" text
    this.state = {
      visibility: "visible"
    }

  }

  // If state changes on parent element, check for changes
  componentDidUpdate(prevProps) {
    if (this.props.live !== prevProps.live) {
      if (this.props.live) {
        this.setState({
          visibility: "visible"
        })
      } else {
        this.setState({
          visibility: "hidden"
        })
      }
    }
  }

  render(){
    
    // Pull information from parent (Main.js) component
    const rawReading = this.props.reading
    const deviceId = this.props.deviceId
    const live = this.props.live
    var time = this.props.time ? new Date(this.props.time * 1000).toUTCString() : ''
    time = this.props.live ? new Date().toUTCString() : time


    // Display raw reading in DOM
    return (
      <div>
        <style jsx>{`
          .rawReading {
            margin: 0 auto;
            padding: 20px;
            max-width: 800px;
            border: 1px solid #DDD;
            border-radius: 10px;
            overflow: hidden;
            font-family: "Source Code Pro", monospace;
            font-size: 12px;
          }
        `}</style>
        <div className='rawReading'>
          Live Raw Reading: {rawReading} <span style={ { visibility: `${ this.state.visibility }`, color: "#FF0000" } }> LIVE </span><br /><br />
          Device ID: {deviceId}<br /><br />
          Time: {time}
        </div>
      </div>
    )
  }
}