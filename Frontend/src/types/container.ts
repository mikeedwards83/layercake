export interface IContainer {
  id: string
  name: string
  key: string
  projectId: string
  logicalApplicationId: string
  description: string
  type: number
  icon: string
  created: string
  updated: string
}

export interface IContainerType {
  id: number
  name: string
  description: string
}
