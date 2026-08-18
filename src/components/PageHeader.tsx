import { Container } from 'react-bootstrap'

export default function PageHeader({
  title,
  subtitle,
}: {
  title: string
  subtitle?: string
}) {
  return (
    <div className="bg-white border-bottom py-4 mb-4">
      <Container>
        <h2 className="bp-section-title mb-1">{title}</h2>
        {subtitle && <p className="bp-muted mb-0">{subtitle}</p>}
      </Container>
    </div>
  )
}
