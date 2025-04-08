import type React from "react"

interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description: string
  actionButton?: React.ReactNode
}

export default function EmptyState({ icon, title, description, actionButton }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 max-w-md mb-6">{description}</p>
      {actionButton}
    </div>
  )
}

