import React from 'react'
import { Container, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RouterLink = Link as any

export default function NotFound() {
  return (
    <Container className="text-center py-5">
      <h1 className="display-4" style={{ color: 'var(--bp-primary)' }}>404</h1>
      <p className="lead">The page you are looking for does not exist.</p>
      <Button as={RouterLink} to="/" variant="primary">Back to Home</Button>
    </Container>
  )
}
