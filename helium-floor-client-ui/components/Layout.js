const mainStyle = {
  margin: '0 auto',
  padding: 20,
  maxWidth: '800px',
  borderRadius: '10px',
  overflow: 'hidden',
  fontFamily: '"Source Code Pro", monospace',
  fontSize: '12px'
}

const Layout = (props) => (
  <div style={mainStyle}>
    <div>{props.children}</div>
  </div>
)

export default Layout