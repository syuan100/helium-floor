import React from 'react' 

// Slider Style
const slider = {
  height: '0px',
  border: '1px solid #ccc',
  width: '300px',
  margin: '0 auto',
  marginTop: '80px',
  marginBottom: '70px',
  position: 'relative'
}

export default class extends React.Component {
  constructor(){
    super()

    // Initiate DOM reference for slider UI elements
    this.sliderButton = React.createRef()
    this.slider = React.createRef()

    // Set initial state of the slider
    this.state = {

      // Place slider all the way to the right (indicating liveness)
      left: 282,

      // Empty state to store historical data later
      historicalReadings: {},

      // Data Aggregator endpoint for querying GoogleFirestore
      firestoreEndpoint: 'http://localhost:3030/firestore'

    }

    // Based on mouse position (clientX), make sure the button doesn't go past bounds of the slider
    this.calculateButtonBoundary = (clientX) => {
      var finalLeftX = clientX - this.slider.current.getBoundingClientRect().left
      if (clientX < this.slider.current.getBoundingClientRect().left) {
        finalLeftX = 0
      } else if (clientX > this.slider.current.getBoundingClientRect().right - 20) {
        finalLeftX = this.sliderWidth
      }
      return(finalLeftX)
    }

    // Set liveness depending on slider position.
    this.determineLiveState = (position) => {
      if (position < 60) {
        this.props.setLive(false)
        return position
      } else {
        this.props.setLive(true)
        return 59
      }
    }

  }

  componentDidMount() {

    // Workaround for removing ghost image from draggable elements
    this.dragImg = new Image(0,0);
    this.dragImg.src =
    'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

    // When the component hits the DOM, set the slider width
    this.sliderWidth = this.slider.current.offsetWidth - 20
  }

  // Event listener for when someone starts to drag the slider Button
  startDrag = (event) => {

    // 1). Make sure to remove ghost image
    event.dataTransfer.setDragImage(this.dragImg, 0, 0)

    // 2). Call Firebase through Data Aggregator to get historical data (last 60 readings)
    fetch(this.state.firestoreEndpoint, {
      crossDomain:true,
      method: 'GET'
    })
    .then(response => {
      return(response.json())
    })
    .then(data => {
      this.setState({ historicalReadings: data.reverse() }) // Set state with new historical data
    })
  }

  // Event Listener for as the slider is being dragged
  sliderDragging = (event) => {

    // 1). Set button X position to mouse X position (clientX)
    this.setState({ left: this.calculateButtonBoundary(event.clientX) })

    // 2). Calculate what reading should be shown based on slider position
    var sliderPosition = this.determineLiveState(Math.floor(this.state.left/(this.sliderWidth/60)))

    // 3). Set state to historic reading
    this.props.setSensorState(this.state.historicalReadings[sliderPosition] )

  }

  // Event Listener for when slider has stopped being dragged
  stopDrag = (event) => {

    // 1). Set button position again to current mouse position (glitch fix)
    this.setState({ left: this.calculateButtonBoundary(event.clientX) })
  }

  render() {
    const { response } = this.state;
    return (
      <div style={slider} className="slider" ref={this.slider}>
        <style jsx>{`
          .sliderButton {
            width: 15px;
            height: 30px;
            border-radius: 10px;
            border: 1px solid #ccc;
            background-color: #fff;
            margin-top: -15px;
            cursor: pointer;
            float: right;
            position: absolute;
          }
          .sliderButton:hover {
            border-color: #93dde8 !important;
          }
        `}</style>
        <div style={ { left: `${ this.state.left }px` } } className="sliderButton" draggable="true" onDrag={this.sliderDragging} onDragStart={this.startDrag} onDragEnd={this.stopDrag} onDragOver={this.preventDefault} ref={this.sliderButton}>
        </div>
      </div>
    )
  }
}