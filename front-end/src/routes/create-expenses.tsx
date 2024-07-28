import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/create-expenses')({
  component: () => <div>Hello /create-expenses!</div>
})