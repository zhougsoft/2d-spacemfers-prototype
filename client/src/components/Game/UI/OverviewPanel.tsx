const OverviewPanel = ({
  overviewItems,
  playerPosition,
}: {
  overviewItems: Phaser.GameObjects.Sprite[]
  playerPosition: { x: number; y: number }
}) => {
  
  console.log('OverviewPanel', { overviewItems, playerPosition })

  return (
    <table>
      <thead>
        <tr>
          <th>distance</th>
          <th>name</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>???</td>
          <td>???</td>
        </tr>
      </tbody>
    </table>
  )
}

export default OverviewPanel
