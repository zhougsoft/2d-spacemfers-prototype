interface ShipControlsProps {
  speedDisplay: number
  setShipAngle: (angle: number) => void
  setShipThrust: (thrust: number) => void
}

const ShipControls = ({
  speedDisplay,
  setShipAngle,
  setShipThrust,
}: ShipControlsProps) => (
  <div>
    <div
      style={{
        backgroundColor: '#111',
        padding: '0.1rem 0.3rem',
      }}>
      SPEED: {speedDisplay.toFixed(2)}
    </div>
    <div>
      <button onClick={() => setShipThrust(0.25)}>25% THRUST</button>
      <br />
      <button onClick={() => setShipThrust(0.5)}>50% THRUST</button>
      <br />
      <button onClick={() => setShipThrust(1)}>100% THRUST</button>
    </div>
    <div>
      <div>
        <button onClick={() => setShipAngle(315)}>↖️</button>
        <button onClick={() => setShipAngle(0)}>⬆️</button>
        <button onClick={() => setShipAngle(45)}>↗️</button>
      </div>
      <div>
        <button onClick={() => setShipAngle(270)}>⬅️</button>
        <button onClick={() => setShipThrust(0)}>🛑</button>
        <button onClick={() => setShipAngle(90)}>➡️</button>
      </div>
      <div>
        <button onClick={() => setShipAngle(225)}>↙️</button>
        <button onClick={() => setShipAngle(180)}>⬇️</button>
        <button onClick={() => setShipAngle(135)}>↘️</button>
      </div>
    </div>
  </div>
)

export default ShipControls
