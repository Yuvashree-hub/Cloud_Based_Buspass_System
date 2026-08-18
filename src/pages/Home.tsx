import React from 'react'
import { Container, Row, Col, Button, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const BUS_IMAGE = 'https://images.pexels.com/photos/5036526/pexels-photo-5036526.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
// react-bootstrap's `as` prop typing doesn't accept react-router's Link directly.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RouterLink = Link as any

const features = [
  {
    icon: 'bi-file-earmark-text',
    title: 'Apply Online',
    text: 'Submit a bus pass application from anywhere with a simple online form.',
  },
  {
    icon: 'bi-clock-history',
    title: 'Track Status',
    text: 'Check whether your application is pending, approved, or rejected in real time.',
  },
  {
    icon: 'bi-person-check',
    title: 'Admin Approval',
    text: 'Transport department staff review and approve applications quickly.',
  },
  {
    icon: 'bi-qr-code',
    title: 'Digital Bus Pass',
    text: 'Download or print your approved digital bus pass with a unique pass ID.',
  },
]

const steps = [
  { n: '1', title: 'Register', text: 'Create your student account with college details.' },
  { n: '2', title: 'Apply', text: 'Fill in the bus pass application form with your route.' },
  { n: '3', title: 'Approval', text: 'Admin reviews your application and issues a pass.' },
  { n: '4', title: 'Print Pass', text: 'Download or print your digital bus pass.' },
]

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="bp-hero py-5">
        <Container>
          <Row className="align-items-center g-4">
            <Col lg={6} className="order-lg-1">
              <div className="mb-2">
                <span className="badge bg-light text-dark border">Cloud-Based Platform</span>
              </div>
              <h1 className="mb-3">Cloud-Based Bus Pass Management System</h1>
              <p className="bp-muted lead mb-4">
                Apply for, manage, and track your bus pass online through a simple and
                convenient digital platform.
              </p>
              <div className="d-flex flex-wrap gap-2">
                <Button as={RouterLink} to="/register" variant="primary" size="lg">
                  Apply for Bus Pass
                </Button>
                <Button as={RouterLink} to="/login" variant="outline-primary" size="lg">
                  Login
                </Button>
              </div>
            </Col>
            <Col lg={6} className="order-lg-2">
              <img
                src={BUS_IMAGE}
                alt="Modern city bus on a public road"
                className="img-fluid"
                loading="lazy"
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features */}
      <section className="py-5">
        <Container>
          <h2 className="bp-section-title text-center mb-4">How It Works</h2>
          <Row className="g-3 mb-4">
            {steps.map((s) => (
              <Col md={3} sm={6} key={s.n}>
                <Card className="bp-card h-100 text-center">
                  <Card.Body>
                    <div
                      className="d-inline-flex align-items-center justify-content-center rounded-circle mb-2"
                      style={{ width: 40, height: 40, background: 'var(--bp-primary)', color: '#fff' }}
                    >
                      {s.n}
                    </div>
                    <h5 className="bp-section-title">{s.title}</h5>
                    <p className="bp-muted small mb-0">{s.text}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <h3 className="bp-section-title text-center mb-4 mt-4">Key Features</h3>
          <Row className="g-3">
            {features.map((f) => (
              <Col md={6} lg={3} key={f.title}>
                <Card className="bp-card h-100">
                  <Card.Body>
                    <i className={`bi ${f.icon} fs-3`} style={{ color: 'var(--bp-secondary)' }}></i>
                    <h5 className="card-title mt-2">{f.title}</h5>
                    <p className="bp-muted mb-0">{f.text}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-5" style={{ background: 'var(--bp-primary)' }}>
        <Container className="text-center text-white">
          <h2 className="mb-3">Ready to get your bus pass?</h2>
          <p className="mb-4">Register today and submit your application in minutes.</p>
          <Button as={RouterLink} to="/register" variant="light" size="lg">
            Get Started
          </Button>
        </Container>
      </section>
    </>
  )
}
