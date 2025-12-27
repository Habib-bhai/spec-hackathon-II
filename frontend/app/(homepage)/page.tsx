import { HomePage } from '@/features'
import React from 'react'

// main route only renders the page component (imported from features) as a child, and the page.tsx it self is a server component
const page = () => {
  return (
    <HomePage />
  )
}

export default page