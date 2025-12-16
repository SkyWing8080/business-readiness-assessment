import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Section,
  Button,
  Link,
  Hr,
} from '@react-email/components';

export default function ConversionEmail({ name, email, percentage }) {
  return (
    <Html>
      <Head />
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Text style={styles.greeting}>Hi {name},</Text>

          <Text style={styles.paragraph}>
            Over the past week, we've shared your transformation readiness assessment results 
            ({percentage}%) and the strategic questions framework we use with clients.
          </Text>

          <Text style={styles.paragraph}>
            Now let's talk about your specific situation.
          </Text>

          <Text style={styles.heading}>A Different Kind of Discovery Call</Text>

          <Text style={styles.paragraph}>
            This isn't a sales pitch. Here's what actually happens on our 45-minute exploratory calls:
          </Text>

          <Section style={styles.bulletBox}>
            <Text style={styles.bulletItem}>
              <strong>We review your assessment results</strong> – Not just the overall score, 
              but what the dimensional breakdown reveals about where you're strong vs. where 
              gaps exist.
            </Text>
            <Text style={styles.bulletItem}>
              <strong>We ask about your actual business challenges</strong> – Revenue pressure? 
              Operational inefficiencies? Competitive threats? We help you translate business 
              problems into transformation priorities.
            </Text>
            <Text style={styles.bulletItem}>
              <strong>We share relevant examples from our experience</strong> – Companies with 
              similar readiness levels, similar industries, similar constraints. What worked, 
              what didn't, and why.
            </Text>
            <Text style={styles.bulletItem}>
              <strong>We're honest about fit</strong> – If we're not the right fit, we'll tell you. 
              If you're not ready for transformation yet, we'll tell you what to strengthen first.
            </Text>
          </Section>

          <Text style={styles.paragraph}>
            No pressure. No hard sell. Just a strategic conversation about whether transformation 
            makes sense for your business right now, and if so, what the path forward looks like.
          </Text>

          <Section style={styles.ctaBox}>
            <Text style={styles.ctaText}>
              Ready to discuss your roadmap?
            </Text>
            <Button
              href="https://calendly.com/inflection-advisory"
              style={styles.button}
            >
              Book Your 45-Minute Call
            </Button>
            <Text style={styles.ctaNote}>
              Or simply reply to this email with your availability and we'll find a time.
            </Text>
          </Section>

          <Text style={styles.heading}>What Happens After the Call?</Text>

          <Text style={styles.paragraph}>
            If there's a clear fit, we'll send you a proposal within 5 business days. It will include:
          </Text>

          <Text style={styles.listItem}>• Clear scope and deliverables</Text>
          <Text style={styles.listItem}>• Detailed approach and methodology</Text>
          <Text style={styles.listItem}>• Timeline with key milestones</Text>
          <Text style={styles.listItem}>• Transparent fee structure</Text>

          <Text style={styles.paragraph}>
            If there's not a fit right now, we'll tell you honestly and point you toward resources 
            that might be more helpful at your current stage.
          </Text>

          <Text style={styles.heading}>Still Thinking It Through?</Text>

          <Text style={styles.paragraph}>
            That's completely fine. You're welcome to reply to any of our emails with questions. 
            We read and respond to every message.
          </Text>

          <Text style={styles.paragraph}>
            And if you're not ready to talk but want to stay connected, we occasionally share 
            frameworks and case studies that might be useful. Just let us know you'd like to stay 
            on the list.
          </Text>

          <Text style={styles.signature}>
            Best regards,
            <br />Justin Pher & Praveen Raman
            <br />Inflection Advisory
          </Text>

          <Hr style={styles.hr} />

          <Section style={styles.psBox}>
            <Text style={styles.psTitle}>P.S. — Why we built this practice</Text>
            <Text style={styles.psText}>
              We're in career transitions ourselves (Justin targeting GM/Regional Commercial 
              Head roles, Praveen exploring AI/tech leadership opportunities). This advisory 
              practice serves dual purposes: maintaining market relevance while building 
              something valuable for mid-market companies who need strategic guidance but 
              don't want Big Consulting pricing or approach. We have nothing to prove and no 
              quotas to hit. Just two operators helping other operators navigate transformation 
              with clarity.
            </Text>
          </Section>

          <Hr style={styles.hr} />

          <Text style={styles.footer}>
            Inflection Advisory
            <br />contact@inflection-advisory.com
            <br /><Link href={`${process.env.NEXT_PUBLIC_APP_URL}/api/unsubscribe?email=${encodeURIComponent(email)}`} style={styles.link}>Unsubscribe</Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    backgroundColor: '#f4f4f4',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  container: {
    backgroundColor: '#ffffff',
    margin: '40px auto',
    padding: '40px',
    maxWidth: '600px',
    borderRadius: '8px',
  },
  greeting: {
    fontSize: '18px',
    fontWeight: 'bold',
    margin: '0 0 20px 0',
  },
  paragraph: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#333333',
    margin: '16px 0',
  },
  heading: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#222222',
    margin: '30px 0 16px 0',
  },
  bulletBox: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '6px',
    margin: '20px 0',
  },
  bulletItem: {
    fontSize: '15px',
    lineHeight: '1.6',
    color: '#333333',
    margin: '12px 0',
  },
  listItem: {
    fontSize: '15px',
    lineHeight: '1.8',
    color: '#333333',
    margin: '4px 0',
  },
  ctaBox: {
    textAlign: 'center',
    backgroundColor: '#f0f8ff',
    padding: '32px 24px',
    borderRadius: '8px',
    margin: '30px 0',
  },
  ctaText: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#222222',
    margin: '0 0 20px 0',
  },
  button: {
    backgroundColor: '#0066cc',
    color: '#ffffff',
    padding: '14px 32px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: 'bold',
    display: 'inline-block',
  },
  ctaNote: {
    fontSize: '14px',
    color: '#666666',
    margin: '16px 0 0 0',
  },
  signature: {
    fontSize: '16px',
    lineHeight: '1.6',
    margin: '30px 0 20px 0',
  },
  psBox: {
    backgroundColor: '#fffbf0',
    padding: '20px',
    borderRadius: '6px',
    borderLeft: '4px solid #ff9800',
  },
  psTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#222222',
    margin: '0 0 8px 0',
  },
  psText: {
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#555555',
    margin: '0',
  },
  hr: {
    borderColor: '#e0e0e0',
    margin: '30px 0',
  },
  footer: {
    fontSize: '12px',
    color: '#666666',
    lineHeight: '1.6',
    textAlign: 'center',
  },
  link: {
    color: '#0066cc',
    textDecoration: 'underline',
  },
};
