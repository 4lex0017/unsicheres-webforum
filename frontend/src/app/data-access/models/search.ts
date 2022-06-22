export interface Search {
  users: SearchUsers[]
  threads: SearchThreads[]
  posts: SearchPosts[]
}


export interface SearchUsers {
  id: number
  name: string
}

export interface SearchThreads {
  id: number
  title: string
}

export interface SearchPosts {
  id: number
  content: string
  title: string
}
