import { Container, Row, Col, Card, Table, Button, Badge, Alert, Spinner, Modal, Form } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Application } from '../lib/types'
import PageHeader from '../components/PageHeader'

function statusBadge(status: Application['status']) {
  const map: Record<Application['status'], string> = {
    pending: 'badge-pending',
    approved: 'badge-approved',
    rejected: 'badge-rejected',
  }
  const label = status.charAt(0).toUpperCase() + status.slice(1)
  return <Badge className={map[status]}>{label}</Badge>
}

export default function AdminDashboard() {
  const [apps, setApps] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [rejectTarget, setRejectTarget] = useState<Application | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [acting, setActing] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false })
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    setApps((data as Application[]) || [])
  }

  useEffect(() => {
    load()
  }, [])

  const total = apps.length
  const pending = apps.filter((a) => a.status === 'pending').length
  const approved = apps.filter((a) => a.status === 'approved').length
  const rejected = apps.filter((a) => a.status === 'rejected').length

  async function fetchUserCount(): Promise<number> {
    const { count, error } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'student')
    if (error) return 0
    return count || 0
  }

  const [userCount, setUserCount] = useState(0)
  useEffect(() => {
    fetchUserCount().then(setUserCount)
  }, [])

  async function handleApprove(id: string) {
    setActionError('')
    setActing(id)
    const { error } = await supabase.rpc('approve_application', { app_id: id })
    setActing(null)
    if (error) {
      setActionError(error.message)
      return
    }
    await load()
  }

  async function confirmReject() {
    if (!rejectTarget) return
    setActionError('')
    setActing(rejectTarget.id)
    const reason = rejectReason.trim() || 'Application rejected by administrator.'
    const { error } = await supabase.rpc('reject_application', {
      app_id: rejectTarget.id,
      reason,
    })
    setActing(null)
    setRejectTarget(null)
    setRejectReason('')
    if (error) {
      setActionError(error.message)
      return
    }
    await load()
  }

  return (
    <>
      <PageHeader
        title="Admin Dashboard"
        subtitle="Review and manage bus pass applications submitted by students."
      />
      <Container className="pb-5">
        {error && <Alert variant="danger">{error}</Alert>}
        {actionError && <Alert variant="danger">{actionError}</Alert>}

        <Row className="g-3 mb-4">
          <Col sm={6} lg={2}>
            <Card className="bp-card bp-stat h-100">
              <Card.Body>
                <div className="label">Total Users</div>
                <h2>{userCount}</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col sm={6} lg={2}>
            <Card className="bp-card bp-stat h-100">
              <Card.Body>
                <div className="label">Total Applications</div>
                <h2>{total}</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col sm={6} lg={2}>
            <Card className="bp-card bp-stat h-100">
              <Card.Body>
                <div className="label">Pending</div>
                <h2>{pending}</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col sm={6} lg={2}>
            <Card className="bp-card bp-stat h-100">
              <Card.Body>
                <div className="label">Approved</div>
                <h2>{approved}</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col sm={6} lg={2}>
            <Card className="bp-card bp-stat h-100">
              <Card.Body>
                <div className="label">Rejected</div>
                <h2>{rejected}</h2>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <h4 className="bp-section-title mb-3">Applications</h4>
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : apps.length === 0 ? (
          <Card className="bp-card">
            <Card.Body className="text-center bp-muted py-4">
              No applications have been submitted yet.
            </Card.Body>
          </Card>
        ) : (
          <div className="table-responsive">
            <Table striped bordered hover className="align-middle">
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>College</th>
                  <th>Route</th>
                  <th>Pass Type</th>
                  <th>Valid From</th>
                  <th>Valid To</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {apps.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <div className="fw-semibold">{a.full_name}</div>
                      <div className="small bp-muted">{a.email}</div>
                    </td>
                    <td>{a.college}</td>
                    <td>
                      {a.source} <i className="bi bi-arrow-right mx-1"></i> {a.destination}
                    </td>
                    <td style={{ textTransform: 'capitalize' }}>{a.pass_type}</td>
                    <td>{a.start_date}</td>
                    <td>{a.end_date}</td>
                    <td>
                      {statusBadge(a.status)}
                      {a.rejection_reason && (
                        <div className="small bp-muted mt-1">{a.rejection_reason}</div>
                      )}
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <Button
                          size="sm"
                          variant="success"
                          disabled={a.status === 'approved' || acting === a.id}
                          onClick={() => handleApprove(a.id)}
                        >
                          {acting === a.id ? '...' : 'Approve'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          disabled={a.status === 'rejected' || acting === a.id}
                          onClick={() => {
                            setRejectTarget(a)
                            setRejectReason(a.rejection_reason || '')
                          }}
                        >
                          Reject
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Container>

      <Modal show={!!rejectTarget} onHide={() => setRejectTarget(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Reject Application</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="bp-muted">
            You are about to reject the application from{' '}
            <strong>{rejectTarget?.full_name}</strong>.
          </p>
          <Form.Group controlId="rejectReason">
            <Form.Label>Reason (optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Incomplete route information."
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setRejectTarget(null)}>
            Cancel
          </Button>
          <Button variant="danger" disabled={acting === rejectTarget?.id} onClick={confirmReject}>
            {acting === rejectTarget?.id ? 'Rejecting...' : 'Confirm Reject'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
