import { Celestial } from '../Game'

const OverviewPanel = ({ overviewItems }: { overviewItems: Celestial[] }) => {
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
