import React from 'react'
import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import type { BusPass } from '../lib/types'
import PageHeader from '../components/PageHeader'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RouterLink = Link as any

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="bus-pass-row">
      <div className="lbl">{label}</div>
      <div className="val">{value}</div>
    </div>
  )
}

export default function MyPass() {
  const { user, profile } = useAuth()
  const [passes, setPasses] = useState<BusPass[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return
    setLoading(true)
    supabase
      .from('bus_passes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        setLoading(false)
        if (error) {
          setError(error.message)
          return
        }
        setPasses((data as BusPass[]) || [])
      })
  }, [user])

  return (
    <>
      <PageHeader
        title="My Bus Pass"
        subtitle="View and print your approved digital bus pass."
      />
      <Container className="pb-5">
        {error && <Alert variant="danger">{error}</Alert>}

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : passes.length === 0 ? (
          <Card className="bp-card">
            <Card.Body className="text-center py-5">
              <i className="bi bi-credit-card-2-front fs-1 bp-muted"></i>
              <h5 className="bp-section-title mt-2">No approved bus pass yet</h5>
              <p className="bp-muted">
                Once an administrator approves your application, your digital bus pass will appear here.
              </p>
              <Button as={RouterLink} to="/apply" variant="primary">Apply for Bus Pass</Button>
            </Card.Body>
          </Card>
        ) : (
          <Row className="g-4">
            {passes.map((p) => (
              <Col lg={8} key={p.id} className="mx-auto">
                <div className="bus-pass">
                  <div className="bus-pass-header">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-truck-front-fill me-2 fs-4"></i>
                      <span className="fw-bold fs-5">BUS PASS</span>
                    </div>
                    <span className="badge badge-approved">APPROVED</span>
                  </div>
                  <div className="bus-pass-body">
                    <Field label="Student Name" value={p.full_name} />
                    <Field label="College" value={p.college} />
                    <Field label="Email" value={p.email} />
                    <Field label="Pass ID" value={p.pass_id} />
                    <Field label="Source" value={p.source} />
                    <Field label="Destination" value={p.destination} />
                    <Field label="Pass Type" value={p.pass_type.charAt(0).toUpperCase() + p.pass_type.slice(1)} />
                    <Field label="Start Date" value={p.start_date} />
                    <Field label="End Date" value={p.end_date} />
                    <Field label="Status" value="Approved" />
                  </div>
                </div>
                <div className="text-center mt-3 bp-no-print">
                  <Button variant="primary" onClick={() => window.print()}>
                    <i className="bi bi-printer me-1"></i> Print Pass
                  </Button>
                </div>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </>
  )
}
