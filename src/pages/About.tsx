import { Container, Row, Col, Card } from 'react-bootstrap'
import PageHeader from '../components/PageHeader'

const points = [
  {
    icon: 'bi-cloud',
    title: 'Cloud-Based',
    text: 'The system is hosted in the cloud, so students and administrators can access it from any device with an internet connection.',
  },
  {
    icon: 'bi-file-earmark-text',
    title: 'Paperless Applications',
    text: 'Students submit applications online, eliminating paperwork and reducing processing time at the transport office.',
  },
  {
    icon: 'bi-clock-history',
    title: 'Real-Time Status',
    text: 'Applicants can see the current status of their application without visiting the office in person.',
  },
  {
    icon: 'bi-shield-check',
    title: 'Secure & Verified',
    text: 'Each account is secured with a password, and administrators verify applications before issuing a pass.',
  },
]

export default function About() {
  return (
    <>
      <PageHeader
        title="About the System"
        subtitle="A digital platform for managing student bus passes efficiently."
      />
      <Container className="pb-5">
        <Row className="mb-4">
          <Col lg={8} className="mx-auto">
            <p className="lead">
              The Cloud-Based Bus Pass Management System is a student project designed to
              digitize the process of applying for and issuing bus passes. It replaces the
              traditional paper-based workflow with a simple online portal where students can
              register, submit applications, and receive a digital bus pass once approved.
            </p>
            <p className="bp-muted">
              The system is built for use by colleges, transport departments, and other
              institutions that issue concessional or regular bus passes to students. It is
              intended as an academic demonstration of how a real transport service portal
              could work online.
            </p>
          </Col>
        </Row>

        <h3 className="bp-section-title mb-3">Objectives</h3>
        <Row className="g-3 mb-4">
          {points.map((p) => (
            <Col md={6} key={p.title}>
              <Card className="bp-card h-100">
                <Card.Body className="d-flex">
                  <i className={`bi ${p.icon} fs-3 me-3`} style={{ color: 'var(--bp-secondary)' }}></i>
                  <div>
                    <h5 className="card-title">{p.title}</h5>
                    <p className="bp-muted mb-0">{p.text}</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <h3 className="bp-section-title mb-2">Technology</h3>
        <p className="bp-muted">
          Built with React and Vite for the front end, with Supabase providing the cloud
          database, authentication, and storage. The interface uses Bootstrap for a clean,
          responsive, and professional look.
        </p>
      </Container>
    </>
  )
}
