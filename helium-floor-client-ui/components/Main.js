import React from 'react'
import openSocket from 'socket.io-client'
import Messages from './Messages.js'
import Sensor from './Sensor.js'
import Slider from './Slider.js'

export default class extends React.Component {
  constructor(props){
    super(props)

    // State management functions for children elements to access
    this.setSensorState = this.setSensorState.bind(this)
    this.setLive = this.setLive.bind(this)

    // Set initial state
    this.state = {

      // Liveness of current display
      live: true,

      // Current Reading
      reading: '000000',

      // Unix Timestamp of current state
      time: '',

      // ID of Helium Atom
      deviceId: '',

      // Socket endpoint on Data Aggregator (helium-floor-data-aggregator)
      socketEndpoint: 'http://localhost:3333'
    }
  }

  componentDidMount() {

    // Connect to the socket on Data Aggregator
    const { socketEndpoint } = this.state;
    const socket = openSocket(socketEndpoint);

    // On new readings coming from the socket, update the state
    socket.on('reading', data => {
      if (this.state.live) {
        this.setState({ reading: data })
      }
    })

    socket.on('device attributes', data => {
      if (this.state.live) {
        this.setState({ deviceId: data.deviceId })
      }
    })
  }

  // Helper function for setting floor sensor state from child elements
  setSensorState(historicalData) {

    this.setState({
      reading: historicalData.reading,
      time: historicalData.time
    })

    if (historicalData.deviceId) {
      this.setState({
        deviceId: historicalData.deviceId
      })
    }

  }

  // Helper function for setting liveness from child elements
  setLive(liveness) {
    this.setState({
      live: liveness
    })
  }

  render() {
    const currentReading = this.state.reading
    const deviceId = this.state.deviceId
    const live = this.state.live
    const time = this.state.time

    // Component explanations
    //
    // Messages: Text information about sensor readings
    // Sensor: Graphical representation of physical board and sensor readings
    // Slider: Slider UI for scrubbing through historical data

    return(
      <div>
        <Messages reading={currentReading} deviceId={deviceId} live={live} time={time} />
        <Sensor reading={currentReading} />
        <Slider setSensorState={this.setSensorState} setLive={this.setLive} />
      </div>
    )
  }
}