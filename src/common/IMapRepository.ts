export interface MapRecord {
  id: number
  mapData: string
  level?: string
  sort?: number
  solution?: string
  preview?: string
}

export interface IMapRepository {
  all(): Promise<Array<MapRecord>>
  store(value: MapRecord): Promise<null>
}
