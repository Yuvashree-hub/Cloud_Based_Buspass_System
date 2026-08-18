import { Form, Button, Card, Alert, Container } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useState, FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import PageHeader from '../components/PageHeader'

export default function Register() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [college, setCollege] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    const { data, error: signUpError } = await supabase.auth.signUp({ email, password })
    if (signUpError) {
      setLoading(false)
      setError(signUpError.message)
      return
    }

    const userId = data.user?.id
    if (!userId) {
      setLoading(false)
      setError('Registration failed. Please try again.')
      return
    }

    const { error: profileError } = await supabase.from('profiles').insert({
      id: userId,
      full_name: fullName,
      college,
      phone,
      role: 'student',
    })

    if (profileError) {
      setLoading(false)
      setError('Account created, but profile could not be saved: ' + profileError.message)
      return
    }

    setLoading(false)
    navigate('/dashboard')
  }

  return (
    <>
      <PageHeader title="Student Registration" subtitle="Create an account to apply for a bus pass online." />
      <Container className="pb-5">
        <div className="bp-form">
          <Card className="bp-card">
            <Card.Body className="p-4">
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="regName">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="As per your ID card"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="regEmail">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@college.edu"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="regCollege">
                  <Form.Label>College / Institution</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="e.g. State College of Engineering"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="regPhone">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="regPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="regConfirm">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    required
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Re-enter your password"
                  />
                </Form.Group>
                <Button type="submit" variant="primary" disabled={loading} className="w-100">
                  {loading ? 'Creating account...' : 'Register'}
                </Button>
              </Form>
              <div className="text-center mt-3">
                <span className="bp-muted">Already have an account? </span>
                <Link to="/login">Login here</Link>
              </div>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </>
  )
}
