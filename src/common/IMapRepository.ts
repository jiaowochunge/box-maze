export interface MapRecord {
  id: number
  mapData: string
  level?: string
  sort?: number
  solution?: string
  preview?: string
}

export interface IMapRepository {
  // 所有地图
  all(): Promise<Array<MapRecord>>
  // 单张地图
  single(id: number): Promise<MapRecord>
  // 保存地图。 MapRecord 的 id 参数没用，随便传个0就行了
  store(value: MapRecord): Promise<null>
  // 更新地图。根据 id 更新
  update(value: MapRecord): Promise<null>
  // 删除地图
  delete(id: number): Promise<null>
}
