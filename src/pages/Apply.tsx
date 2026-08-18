import { Container, Form, Button, Card, Alert, Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState, FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import type { PassType } from '../lib/types'
import PageHeader from '../components/PageHeader'

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

function passDurationDays(type: PassType): number {
  if (type === 'monthly') return 30
  if (type === 'quarterly') return 90
  return 365
}

export default function Apply() {
  const { profile, user, loading } = useAuth()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [college, setCollege] = useState('')
  const [phone, setPhone] = useState('')
  const [source, setSource] = useState('')
  const [destination, setDestination] = useState('')
  const [passType, setPassType] = useState<PassType>('monthly')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '')
      setCollege(profile.college || '')
      setPhone(profile.phone || '')
    }
    if (user?.email) setEmail(user.email)
  }, [profile, user])

  useEffect(() => {
    if (startDate) {
      setEndDate(addDays(startDate, passDurationDays(passType)))
    }
  }, [startDate, passType])

  if (loading) return null

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!user) {
      setError('You must be signed in to apply.')
      return
    }
    if (!startDate || !endDate) {
      setError('Please choose a start date.')
      return
    }
    if (new Date(endDate) <= new Date(startDate)) {
      setError('End date must be after the start date.')
      return
    }

    setSubmitting(true)
    const { error: insertError } = await supabase.from('applications').insert({
      user_id: user.id,
      full_name: fullName,
      email,
      college,
      phone,
      source,
      destination,
      pass_type: passType,
      start_date: startDate,
      end_date: endDate,
      status: 'pending',
    })
    setSubmitting(false)
    if (insertError) {
      setError(insertError.message)
      return
    }
    setSuccess(true)
    setTimeout(() => navigate('/dashboard'), 1200)
  }

  if (success) {
    return (
      <>
        <PageHeader title="Application Submitted" />
        <Container className="pb-5">
          <Alert variant="success" className="text-center">
            <i className="bi bi-check-circle-fill me-2"></i>
            Your application has been submitted successfully. You can track its status from your dashboard.
          </Alert>
        </Container>
      </>
    )
  }

  return (
    <>
      <PageHeader
        title="Apply for Bus Pass"
        subtitle="Fill in the details below to submit a new bus pass application."
      />
      <Container className="pb-5">
        <div className="bp-form">
          <Card className="bp-card">
            <Card.Body className="p-4">
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <h6 className="bp-section-title mb-3">Personal Details</h6>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group controlId="apName">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="apEmail">
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="apCollege">
                      <Form.Label>College / Institution</Form.Label>
                      <Form.Control
                        type="text"
                        required
                        value={college}
                        onChange={(e) => setCollege(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="apPhone">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <h6 className="bp-section-title mt-4 mb-3">Travel Details</h6>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group controlId="apSource">
                      <Form.Label>Source (Boarding Point)</Form.Label>
                      <Form.Control
                        type="text"
                        required
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        placeholder="e.g. Central Bus Station"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="apDest">
                      <Form.Label>Destination (Drop Point)</Form.Label>
                      <Form.Control
                        type="text"
                        required
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder="e.g. College Campus"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="apType">
                      <Form.Label>Pass Type</Form.Label>
                      <Form.Select
                        value={passType}
                        onChange={(e) => setPassType(e.target.value as PassType)}
                      >
                        <option value="monthly">Monthly (30 days)</option>
                        <option value="quarterly">Quarterly (90 days)</option>
                        <option value="annual">Annual (365 days)</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="apStart">
                      <Form.Label>Start Date</Form.Label>
                      <Form.Control
                        type="date"
                        required
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="apEnd">
                      <Form.Label>End Date</Form.Label>
                      <Form.Control type="date" value={endDate} readOnly />
                      <Form.Text className="bp-muted">
                        Calculated based on the selected pass type.
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-grid mt-4">
                  <Button type="submit" variant="primary" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Application'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </>
  )
}
