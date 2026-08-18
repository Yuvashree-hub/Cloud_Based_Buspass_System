import React from 'react'
import { Container, Row, Col, Card, Table, Button, Alert, Badge, Spinner } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import type { Application } from '../lib/types'
import PageHeader from '../components/PageHeader'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RouterLink = Link as any

function statusBadge(status: Application['status']) {
  const map: Record<Application['status'], string> = {
    pending: 'badge-pending',
    approved: 'badge-approved',
    rejected: 'badge-rejected',
  }
  const label = status.charAt(0).toUpperCase() + status.slice(1)
  return <Badge className={map[status]}>{label}</Badge>
}

export default function Dashboard() {
  const { profile, user, loading } = useAuth()
  const navigate = useNavigate()
  const [apps, setApps] = useState<Application[]>([])
  const [loadingApps, setLoadingApps] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return
    setLoadingApps(true)
    supabase
      .from('applications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        setLoadingApps(false)
        if (error) {
          setError(error.message)
          return
        }
        setApps((data as Application[]) || [])
      })
  }, [user])

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    )
  }

  const pending = apps.filter((a) => a.status === 'pending').length
  const approved = apps.filter((a) => a.status === 'approved').length
  const rejected = apps.filter((a) => a.status === 'rejected').length

  return (
    <>
      <PageHeader
        title={`Welcome, ${profile?.full_name || 'Student'}`}
        subtitle="Manage your bus pass applications below."
      />
      <Container className="pb-5">
        <Row className="g-3 mb-4">
          <Col sm={6} lg={3}>
            <Card className="bp-card bp-stat h-100">
              <Card.Body>
                <div className="label">My Applications</div>
                <h2>{apps.length}</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col sm={6} lg={3}>
            <Card className="bp-card bp-stat h-100">
              <Card.Body>
                <div className="label">Pending</div>
                <h2>{pending}</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col sm={6} lg={3}>
            <Card className="bp-card bp-stat h-100">
              <Card.Body>
                <div className="label">Approved</div>
                <h2>{approved}</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col sm={6} lg={3}>
            <Card className="bp-card bp-stat h-100">
              <Card.Body>
                <div className="label">Rejected</div>
                <h2>{rejected}</h2>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="g-3 mb-4">
          <Col md={4}>
            <Card className="bp-card h-100">
              <Card.Body className="text-center">
                <i className="bi bi-file-earmark-plus fs-2" style={{ color: 'var(--bp-secondary)' }}></i>
                <h5 className="card-title mt-2">Apply for Bus Pass</h5>
                <p className="bp-muted small">Submit a new application for a bus pass.</p>
                <Button as={RouterLink} to="/apply" variant="primary" className="w-100">Apply Now</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="bp-card h-100">
              <Card.Body className="text-center">
                <i className="bi bi-card-checklist fs-2" style={{ color: 'var(--bp-secondary)' }}></i>
                <h5 className="card-title mt-2">Application Status</h5>
                <p className="bp-muted small">View the status of all your applications below.</p>
                <Button variant="outline-primary" className="w-100" onClick={() => navigate('#recent')}>
                  View Below
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="bp-card h-100">
              <Card.Body className="text-center">
                <i className="bi bi-credit-card-2-front fs-2" style={{ color: 'var(--bp-secondary)' }}></i>
                <h5 className="card-title mt-2">My Bus Pass</h5>
                <p className="bp-muted small">View and print your approved bus pass.</p>
                <Button as={RouterLink} to="/my-pass" variant="outline-primary" className="w-100">
                  View My Pass
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <h4 className="bp-section-title mb-3" id="recent">Recent Applications</h4>
        {error && <Alert variant="danger">{error}</Alert>}
        {loadingApps ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : apps.length === 0 ? (
          <Card className="bp-card">
            <Card.Body className="text-center bp-muted py-4">
              You have not submitted any applications yet.
              <div className="mt-2">
                <Button as={RouterLink} to="/apply" variant="primary">Apply for Bus Pass</Button>
              </div>
            </Card.Body>
          </Card>
        ) : (
          <div className="table-responsive">
            <Table striped bordered hover className="align-middle">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Source</th>
                  <th>Destination</th>
                  <th>Pass Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {apps.map((a, i) => (
                  <tr key={a.id}>
                    <td>{i + 1}</td>
                    <td>{a.source}</td>
                    <td>{a.destination}</td>
                    <td style={{ textTransform: 'capitalize' }}>{a.pass_type}</td>
                    <td>{a.start_date}</td>
                    <td>{a.end_date}</td>
                    <td>{statusBadge(a.status)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Container>
    </>
  )
}
