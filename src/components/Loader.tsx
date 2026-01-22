export function FullPageLoader() {
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div className="lds-roller">
        <div /><div /><div /><div />
        <div /><div /><div /><div />
      </div>
    </div>
  )
}
