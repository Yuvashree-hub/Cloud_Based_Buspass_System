import { Form, Button, Card, Alert, Container } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useState, FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import PageHeader from '../components/PageHeader'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError) {
      setLoading(false)
      setError(signInError.message)
      return
    }

    const userId = data.user?.id
    if (!userId) {
      setLoading(false)
      setError('Login failed. Please try again.')
      return
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .maybeSingle()

    if (profileError) {
      setLoading(false)
      setError('Could not verify admin account: ' + profileError.message)
      return
    }

    if (!profile || profile.role !== 'admin') {
      await supabase.auth.signOut()
      setLoading(false)
      setError('This account does not have administrator access.')
      return
    }

    setLoading(false)
    navigate('/admin')
  }

  return (
    <>
      <PageHeader title="Administrator Login" subtitle="Restricted access for transport department staff." />
      <Container className="pb-5">
        <div className="bp-form">
          <Card className="bp-card">
            <Card.Body className="p-4">
              <div className="text-center mb-3">
                <i className="bi bi-shield-lock fs-1" style={{ color: 'var(--bp-primary)' }}></i>
              </div>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="adminEmail">
                  <Form.Label>Admin Email</Form.Label>
                  <Form.Control
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@transport.gov"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="adminPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                  />
                </Form.Group>
                <Button type="submit" variant="primary" disabled={loading} className="w-100">
                  {loading ? 'Signing in...' : 'Admin Login'}
                </Button>
              </Form>
              <div className="text-center mt-3">
                <span className="bp-muted">Are you a student? </span>
                <Link to="/login">Student login</Link>
              </div>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </>
  )
}
