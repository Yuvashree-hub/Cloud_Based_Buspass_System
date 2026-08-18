import { Form, Button, Card, Alert, Container } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useState, FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import PageHeader from '../components/PageHeader'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    navigate('/dashboard')
  }

  return (
    <>
      <PageHeader title="Student Login" subtitle="Sign in to manage your bus pass applications." />
      <Container className="pb-5">
        <div className="bp-form">
          <Card className="bp-card">
            <Card.Body className="p-4">
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="loginEmail">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@college.edu"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="loginPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                  />
                </Form.Group>
                <Button type="submit" variant="primary" disabled={loading} className="w-100">
                  {loading ? 'Signing in...' : 'Login'}
                </Button>
              </Form>
              <div className="text-center mt-3">
                <span className="bp-muted">Don't have an account? </span>
                <Link to="/register">Register here</Link>
              </div>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </>
  )
}
