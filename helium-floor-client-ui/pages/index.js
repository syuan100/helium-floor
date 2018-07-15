import Layout from '../components/Layout.js'
import Main from '../components/Main.js'

// Header Styles
const h1 = {
  fontSize: '40px',
  marginTop: '50px',
  marginBottom: '30px'
}

export default () => (
    <Layout>

      // Import Google Font
      <link href="https://fonts.googleapis.com/css?family=Source+Code+Pro" rel="stylesheet" />

      // Header
      <div style={h1}>Floor Sensor</div>

      // Main component
      <Main></Main>
      
    </Layout>
)