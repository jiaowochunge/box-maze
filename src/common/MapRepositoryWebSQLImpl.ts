import { IMapRepository, MapRecord } from 'common/IMapRepository'

export class MapRepositoryWebSQLImpl implements IMapRepository {

  private db: Database

  constructor() {
    this.db = window.openDatabase('boxmaze', '1.0', 'Box Maze', 2 * 1024 * 1024)
  }

  // 初始化。就是创建表
  init() {
    return new Promise<null>((resolve: () => void, reject) => {
      this.db.transaction((tx: SQLTransaction) => {
        tx.executeSql('CREATE TABLE IF NOT EXISTS maps \
        (id INTEGER PRIMARY KEY AUTOINCREMENT,\
          map_data TEXT NOT NULL,\
          level VARCHAR(63),\
          sort TINYINT,\
          solution TEXT,\
          preview BLOB,\
          create_at DATETIME,\
          update_at DATETIME )', [], (tx: SQLTransaction, rs: SQLResultSet) => {
            resolve()
          }, (tx: SQLTransaction, error: SQLError) => {
            reject(error)
            return false
          })
      }, (error: SQLError) => {
        reject(error)
      })
    })
  }

  all() {
    return new Promise<Array<MapRecord>>((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql('SELECT * FROM maps', [], (tx: SQLTransaction, rs: SQLResultSet) => {
          let transRecord: Array<MapRecord> = []
          for (let i = 0; i < rs.rows.length; i++) {
            let row = rs.rows.item(i)
            transRecord.push({
              id: row.id,
              mapData: row['map_data'],
              level: row.level
            })
          }

          resolve(transRecord)
        }, (tx: SQLTransaction, error: SQLError) => {
          reject(error)
          return false
        })
      }, (error: SQLError) => {
        reject(error)
      })
    })
  }

  store(value: MapRecord) {
    return new Promise<null>((resolve, reject) => {
      this.db.transaction((tx: SQLTransaction) => {
        tx.executeSql('INSERT INTO maps (map_data, level, sort, solution, preview) VALUES (?, ?, ?, ?, ?)', [value.mapData, value.level, value.sort, value.solution, value.preview], (tx, rs) => {
          resolve()
        }, (tx: SQLTransaction, error: SQLError) => {
          reject(error)
          return false
        })
      }, (error: SQLError) => {
        reject(error)
      })
    })
  }

}

export const sharedMapRepo = new MapRepositoryWebSQLImpl()
sharedMapRepo.init()
