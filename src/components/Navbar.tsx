import { Nav, Navbar, Container, NavDropdown } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AppNavbar() {
  const { user, profile, isAdmin, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  return (
    <Navbar expand="lg" className="bp-navbar" variant="dark" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <i className="bi bi-truck-front-fill bp-brand-icon" aria-hidden="true"></i>
          <span>Bus Pass Management System</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="ms-auto align-items-lg-center">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/about">About</Nav.Link>

            {!user && (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
                <Nav.Link as={Link} to="/admin/login">Admin Login</Nav.Link>
              </>
            )}

            {user && !isAdmin && (
              <>
                <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/apply">Apply for Pass</Nav.Link>
                <Nav.Link as={Link} to="/my-pass">My Bus Pass</Nav.Link>
                <NavDropdown title={profile?.full_name || 'Account'} id="user-menu" align="end">
                  <NavDropdown.Item as={Link} to="/dashboard">My Applications</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleSignOut}>Sign Out</NavDropdown.Item>
                </NavDropdown>
              </>
            )}

            {user && isAdmin && (
              <>
                <Nav.Link as={Link} to="/admin">Admin Dashboard</Nav.Link>
                <NavDropdown title="Admin" id="admin-menu" align="end">
                  <NavDropdown.Item onClick={handleSignOut}>Sign Out</NavDropdown.Item>
                </NavDropdown>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
