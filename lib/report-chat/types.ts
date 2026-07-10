export type ReportChatRole = "user" | "assistant"

export interface ReportChatMessage {
  id: string
  role: ReportChatRole
  content: string
  createdAt: string
}

export interface ReportChatRequest {
  reportId: string
  message: string
  history: ReportChatMessage[]
}

export interface ReportChatResponse {
  message: ReportChatMessage
}
