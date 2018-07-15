import React from 'react'

export default class extends React.Component {
  constructor(props) {
    super(props)

    // Initial state for sensor readings. Each charater in the reading string represents a different sensor.
    this.state = {
      sensorA: this.props.reading.charAt(0),
      sensorB: this.props.reading.charAt(1),
      sensorC: this.props.reading.charAt(2),
      sensorD: this.props.reading.charAt(3),
      sensorE: this.props.reading.charAt(4),
      sensorF: this.props.reading.charAt(5)
    }
  }

  // If state updates within parent component, check to see if anything changes.
  componentDidUpdate(prevProps) {
    if (this.props.reading !== prevProps.reading) {
      if (this.props.reading !== null) {
        this.setState({
          sensorA: this.props.reading.charAt(0),
          sensorB: this.props.reading.charAt(1),
          sensorC: this.props.reading.charAt(2),
          sensorD: this.props.reading.charAt(3),
          sensorE: this.props.reading.charAt(4),
          sensorF: this.props.reading.charAt(5)
        })
      } else {

        // If reading the is null, set reading to zero
        this.setState({
          sensorA: '0',
          sensorB: '0',
          sensorC: '0',
          sensorD: '0',
          sensorE: '0',
          sensorF: '0'
        })
      }
    }
  }

  // Render the board and change opacity of the sensor areas based on readings
  render() {
    return (
      <div>
        <style jsx>{`
          .fullBoard {
            margin: 0 auto;
            width: 250px;
            height: 250px;
            border: 1px solid;
            margin: 40px auto;
            box-shadow: 2px 2px 0 1px #888888;
            display: block;
          }

          .sensor {
            display: block;
            width: 50%;
            height: 33%;
            background-color: #FFCCFF;
            float: left;
          }
        `}</style>
        <div className="fullBoard">
          <div className="sensor" style={ { opacity: `0.${ this.state.sensorF }` } }></div>
          <div className="sensor" style={ { opacity: `0.${ this.state.sensorA }` } }></div>
          <div className="sensor" style={ { opacity: `0.${ this.state.sensorE }` } }></div>
          <div className="sensor" style={ { opacity: `0.${ this.state.sensorB }` } }></div>
          <div className="sensor" style={ { opacity: `0.${ this.state.sensorD }` } }></div>
          <div className="sensor" style={ { opacity: `0.${ this.state.sensorC }` } }></div>
        </div>
      </div>
    )
  }
}