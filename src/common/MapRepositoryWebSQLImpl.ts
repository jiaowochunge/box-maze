import { IMapRepository, MapRecord } from 'common/IMapRepository'

import sampleMap from 'assets/maps/sample.json'

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
          update_at DATETIME )')
        tx.executeSql('SELECT * FROM maps', [], (tx: SQLTransaction, rs: SQLResultSet) => {
          if (rs.rows.length == 0) {
            const mapData = JSON.stringify(sampleMap)
            tx.executeSql('INSERT INTO maps (map_data, level, sort) VALUES (?, ?, ?)', [mapData, '第一关', 1])
          }
        })
      }, (error: SQLError) => {
        reject(error)
      }, () => {
        resolve()
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
              level: row.level,
              solution: row.solution,
              preview: row.preview
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

  /** only id & level retrieved
   */
  allWithoutData() {
    return new Promise<Array<MapRecord>>((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql('SELECT id, level FROM maps', [], (tx: SQLTransaction, rs: SQLResultSet) => {
          let transRecord: Array<MapRecord> = []
          for (let i = 0; i < rs.rows.length; i++) {
            let row = rs.rows.item(i)
            transRecord.push({
              id: row.id,
              mapData: null,
              level: row.level
            })
          }

          resolve(transRecord)
        })
      }, (error: SQLError) => {
        reject(error)
      })
    })
  }

  single(id: number) {
    return new Promise<MapRecord>((resolve, reject) => {
      this.db.transaction((tx: SQLTransaction) => {
        tx.executeSql('SELECT * FROM maps WHERE id=?', [id], (tx: SQLTransaction, rs: SQLResultSet) => {
          if (rs.rows.length != 1) {
            reject('no record found')
          } else {
            let row = rs.rows.item(0)
            resolve({
              id: row.id,
              mapData: row['map_data'],
              level: row.level,
              sort: row.sort,
              solution: row.solution,
              preview: row.preview
            })
          }
        })
      }, (error: SQLError) => {
        reject(error)
      })
    })
  }

  store(value: MapRecord) {
    return new Promise<null>((resolve, reject) => {
      this.db.transaction((tx: SQLTransaction) => {
        tx.executeSql('INSERT INTO maps (map_data, level, sort, solution, preview) VALUES (?, ?, ?, ?, ?)',
          [value.mapData, value.level, value.sort, value.solution, value.preview],
          (tx: SQLTransaction, rs: SQLResultSet) => {
          resolve()
        })
      }, (error: SQLError) => {
        reject(error)
      })
    })
  }

  update(value: MapRecord) {
    return new Promise<null>((resolve, reject) => {
      this.db.transaction((tx: SQLTransaction) => {
        tx.executeSql('UPDATE maps SET map_data=?, level=?, sort=?, solution=?, preview=? WHERE id=?',
          [value.mapData, value.level, value.sort, value.solution, value.preview, value.id])
      }, (error: SQLError) => {
        reject(error)
      }, () => {
        resolve()
      })
    })
  }

  delete(id: number) {
    return new Promise<null>((resolve, reject) => {
      this.db.transaction((tx: SQLTransaction) => {
        tx.executeSql('DELETE FROM maps WHERE id=?', [id])
      }, (error: SQLError) => {
        reject(error)
      }, () => {
        resolve()
      })
    })
  }

}

export const sharedMapRepo = new MapRepositoryWebSQLImpl()
sharedMapRepo.init()
